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
  pick,
} = require("rubico");
const {
  defaultsDeep,
  when,
  callProp,
  find,
  isEmpty,
  first,
  size,
  append,
} = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2, tagResource, untagResource } = require("./EC2Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const ignoreErrorCodes = ["InvalidVpcEndpointId.NotFound"];

const findId = () => get("VpcEndpointId");

const pickId = pipe([
  ({ VpcEndpointId }) => ({ VpcEndpointIds: [VpcEndpointId] }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpcEndpoint = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const findName =
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("Tags"),
        find(eq(get("Key"), "Firewall")),
        switchCase([
          isEmpty,
          pipe([
            () => live,
            findNameInTagsOrId({
              findId: () => live.ServiceName,
            })({ lives, config }),
            (name) =>
              pipe([
                () => live.VpcId,
                tap(() => {
                  assert(live.VpcId);
                  assert(name);
                }),
                (id) =>
                  lives.getById({
                    id,
                    type: "Vpc",
                    group: "EC2",
                    providerName: config.providerName,
                  }),
                get("name", live.VpcId),
                tap((name) => {
                  assert(name, `no Vpc name for '${live.VpcId}'`);
                }),
                append(`::${name}`),
              ])(),
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
                    get("name", id),
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

  const cannotBeDeleted = () =>
    pipe([get("Tags"), find(eq(get("Key"), "Firewall"))]);

  const managedByOther = ({ lives, config }) =>
    or([
      cannotBeDeleted({ lives, config }),
      pipe([get("ServiceName"), callProp("startsWith", "com.amazonaws.vpce")]),
    ]);

  const decorate = () =>
    pipe([
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
  const update = client.update({
    method: "modifyVpcEndpoint",
    getById,
    filterParams: ({ payload, live, diff }) =>
      pipe([
        () => payload,
        pick([
          "DnsOptions",
          "IpAddressType",
          "PolicyDocument",
          "PrivateDnsEnabled",
          "RequesterManaged",
        ]),
        assign({
          VpcEndpointId: () => live.VpcEndpointId,
          PolicyDocument: pipe([get("PolicyDocument"), JSON.stringify]),
        }),
        tap((params) => {
          assert(true);
        }),
      ])(),
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
    resourceName,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { vpc, subnets, securityGroups, routeTables },
  }) =>
    pipe([
      () => otherProps,
      tap((params) => {
        assert(vpc, "missing vpc dependency");
        assert(name);
      }),
      defaultsDeep({
        ServiceName: name,
        VpcId: getField(vpc, "VpcId"),
        TagSpecifications: [
          {
            ResourceType: "vpc-endpoint",
            Tags: buildTags({
              config,
              namespace,
              name: resourceName,
              UserTags: Tags,
            }),
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
