const assert = require("assert");
const {
  pipe,
  tap,
  get,
  assign,
  map,
  eq,
  switchCase,
  fork,
  or,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  when,
  callProp,
  find,
  isEmpty,
  first,
  size,
} = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createEC2,
  tagResource,
  untagResource,
  findDependenciesVpc,
} = require("./EC2Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const ignoreErrorCodes = ["InvalidVpcEndpointId.NotFound"];
const findId = get("live.VpcEndpointId");
const pickId = pipe([
  tap(({ VpcEndpointId }) => {
    assert(VpcEndpointId);
  }),
  ({ VpcEndpointId }) => ({ VpcEndpointIds: [VpcEndpointId] }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpcEndpoint = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const findName = ({ live, lives }) =>
    pipe([
      () => live,
      get("Tags"),
      find(eq(get("Key"), "Firewall")),
      switchCase([
        isEmpty,
        pipe([
          () => ({ live, lives }),
          tap((params) => {
            assert(true);
          }),
          findNameInTagsOrId({ findId: get("live.ServiceName") }),
        ]),
        pipe([
          get("Value"),
          (id) =>
            pipe([
              fork({
                firewall: pipe([
                  () =>
                    lives.getById({
                      id,
                      type: "Firewall",
                      group: "NetworkFirewall",
                      providerName: config.providerName,
                    }),
                  get("name"),
                ]),
                subnet: pipe([
                  () => live,
                  get("SubnetIds"),
                  tap((SubnetIds) => {
                    assert.equal(size(SubnetIds), 1);
                  }),
                  first,
                  (id) =>
                    lives.getById({
                      id,
                      type: "Subnet",
                      group: "EC2",
                      providerName: config.providerName,
                    }),
                  get("name"),
                ]),
              }),
              tap(({ firewall, subnet }) => {
                assert(firewall);
                assert(subnet);
              }),
              ({ firewall, subnet }) => `vpce::${firewall}::${subnet}`,
            ])(),
        ]),
      ]),
    ])();

  const cannotBeDeleted = pipe([
    get("live.Tags"),
    find(eq(get("Key"), "Firewall")),
  ]);

  const managedByOther = or([
    cannotBeDeleted,
    pipe([
      get("live.ServiceName"),
      callProp("startsWith", "com.amazonaws.vpce"),
    ]),
  ]);

  const findDependencies = ({ live, lives, config }) => [
    findDependenciesVpc({ live }),
    {
      type: "Subnet",
      group: "EC2",
      ids: live.SubnetIds,
    },
    {
      type: "RouteTable",
      group: "EC2",
      ids: live.RouteTableIds,
    },
    {
      type: "SecurityGroup",
      group: "EC2",
      ids: pipe([() => live, get("Groups"), pluck("GroupId")])(),
    },
    {
      type: "Firewall",
      group: "NetworkFirewall",
      ids: [
        pipe([
          () => live,
          get("Tags"),
          find(eq(get("Key"), "Firewall")),
          get("Value"),
        ])(),
      ],
    },
  ];

  const decorate = () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      when(
        get("PolicyDocument"),
        assign({ PolicyDocument: pipe([get("PolicyDocument"), JSON.parse]) })
      ),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcEndpoints-property
  const getList = client.getList({
    method: "describeVpcEndpoints",
    getParam: "VpcEndpoints",
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcEndpoints-property
  const getById = client.getById({
    pickId,
    method: "describeVpcEndpoints",
    getField: "VpcEndpoints",
    decorate,
    ignoreErrorCodes,
  });

  const getByName = pipe([getByNameCore({ getList, findName })]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpcEndpoint-property
  const create = client.create({
    method: "createVpcEndpoint",
    filterPayload: assign({
      PolicyDocument: pipe([get("PolicyDocument"), JSON.stringify]),
    }),
    pickCreated: () => pipe([get("VpcEndpoint")]),
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifyVpcEndpoint-property
  //TODO update
  const update = client.update({
    method: "modifyVpcEndpoint",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVpcEndpoints-property
  const destroy = client.destroy({
    pickId,
    method: "deleteVpcEndpoints",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { vpc, subnets, securityGroups, routeTables },
  }) =>
    pipe([
      () => otherProps,
      tap((params) => {
        assert(vpc, "missing vpc dependency");
      }),
      defaultsDeep({
        ServiceName: name,
        VpcId: getField(vpc, "VpcId"),
        TagSpecifications: [
          {
            ResourceType: "vpc-endpoint",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      when(
        () => subnets,
        defaultsDeep({
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((securityGroup) => getField(securityGroup, "GroupId")),
          ])(),
        })
      ),
      when(
        () => routeTables,
        defaultsDeep({
          RouteTableIds: pipe([
            () => routeTables,
            map((routeTable) => getField(routeTable, "RouteTableId")),
          ])(),
        })
      ),
    ])();

  return {
    spec,
    findId,
    cannotBeDeleted,
    managedByOther,
    findDependencies,
    getByName,
    getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ endpoint: ec2 }),
    untagResource: untagResource({ endpoint: ec2 }),
  };
};
