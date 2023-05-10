const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  or,
  fork,
  switchCase,
  flatMap,
} = require("rubico");
const {
  defaultsDeep,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
  append,
  find,
  size,
} = require("rubico/x");

const { getByNameCore, differenceObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const {
  buildTags,
  findNameInTagsOrId,
  replaceRegion,
} = require("../AwsCommon");
const {
  findInStatement,
  assignPolicyDocumentAccountAndRegion,
} = require("../IAM/IAMCommon");

const {
  tagResource,
  untagResource,
  getResourceNameFromTag,
} = require("./EC2Common");

const pickId = pipe([
  tap(({ VpcEndpointId }) => {
    assert(VpcEndpointId);
  }),
  ({ VpcEndpointId }) => ({ VpcEndpointIds: [VpcEndpointId] }),
]);

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
            findId: () => get("ServiceName"),
          })({ lives, config }),
          (name) =>
            pipe([
              () => live.VpcId,
              tap(() => {
                assert(live.VpcId);
                assert(name);
              }),
              lives.getById({
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
                  () => id,
                  lives.getById({
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
                  lives.getById({
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
    get("RequesterManaged"),
  ]);

const decorate = () =>
  pipe([
    when(
      get("PolicyDocument"),
      assign({ PolicyDocument: pipe([get("PolicyDocument"), JSON.parse]) })
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpcEndpoint = ({ compare }) => ({
  type: "VpcEndpoint",
  package: "ec2",
  client: "EC2",
  cannotBeDeleted,
  managedByOther,
  findName,
  findId: () =>
    pipe([
      get("VpcEndpointId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["InvalidVpcEndpointId.NotFound"],
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      //TODO
      parentForName: true,
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
    // Interface endpoint
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      parent: true,
      //TODO
      parentForName: true,
      dependencyIds: ({ lives, config }) => get("SubnetIds"),
    },
    // Gateway endpoint
    routeTables: {
      type: "RouteTable",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("RouteTableIds"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      excludeDefaultDependencies: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Groups"), pluck("GroupId")]),
    },
    // NetworkInterfaceIds ?
    firewall: {
      type: "Firewall",
      group: "NetworkFirewall",
      parent: true,
      //TODO
      parentForName: true,
      ignoreOnDestroy: true,
      dependencyId: ({ lives, config }) =>
        pipe([get("Tags"), find(eq(get("Key"), "Firewall")), get("Value")]),
    },
    iamRoles: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("PolicyDocument.Statement", []),
          flatMap(
            findInStatement({ type: "Role", group: "IAM", lives, config })
          ),
          pluck("id"),
        ]),
    },
  },
  shortName: true,
  getResourceName: getResourceNameFromTag,
  inferName:
    ({ resourceName, dependenciesSpec }) =>
    (properties) =>
      pipe([
        tap((params) => {
          assert(dependenciesSpec.vpc);
        }),
        () => "",
        switchCase([
          () => dependenciesSpec.firewall,
          pipe([
            append("vpce::"),
            append(dependenciesSpec.firewall),
            append("::"),
            append(pipe([() => dependenciesSpec.subnets, first])()),
          ]),
          pipe([
            append(dependenciesSpec.vpc),
            append("::"),
            append(resourceName || properties.ServiceName),
          ]),
        ]),
      ])(),
  omitProperties: [
    "VpcEndpointId",
    "VpcId",
    "State",
    "RouteTableIds",
    "SubnetIds",
    "Groups",
    "SecurityGroupIds",
    "NetworkInterfaceIds",
    "DnsEntries",
    "CreationTimestamp",
    "OwnerId",
  ],
  propertiesDefault: {
    PrivateDnsEnabled: false,
    RequesterManaged: false,
  },
  compare: compare({
    filterAll: () =>
      pipe([
        when(
          eq(get("VpcEndpointType"), "Interface"),
          defaultsDeep({
            IpAddressType: "ipv4",
            DnsOptions: { DnsRecordIpType: "ipv4" },
          })
        ),
        differenceObject({
          PolicyDocument: {
            Version: "2008-10-17",
            Statement: [
              {
                Action: "*",
                Effect: "Allow",
                Principal: "*",
                Resource: "*",
              },
            ],
          },
        }),
      ]),
  }),
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      when(
        eq(get("VpcEndpointType"), "Interface"),
        differenceObject({
          IpAddressType: "ipv4",
          DnsOptions: { DnsRecordIpType: "ipv4" },
        })
      ),
      differenceObject({
        PolicyDocument: {
          Version: "2008-10-17",
          Statement: [
            {
              Action: "*",
              Effect: "Allow",
              Principal: "*",
              Resource: "*",
            },
          ],
        },
      }),
      assign({
        ServiceName: pipe([
          get("ServiceName"),
          replaceRegion({ providerConfig }),
        ]),
      }),
      when(
        get("PolicyDocument"),
        assignPolicyDocumentAccountAndRegion({ providerConfig, lives })
      ),
    ]),
  addCode: ({ resource, lives }) =>
    pipe([
      () => resource,
      get("dependencies"),
      find(eq(get("type"), "Firewall")),
      get("ids"),
      first,
      unless(isEmpty, () => `\n`),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getVpcEndpoint-property
  getById: {
    pickId,
    method: "describeVpcEndpoints",
    getField: "VpcEndpoints",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#listVpcEndpoints-property
  getList: {
    method: "describeVpcEndpoints",
    getParam: "VpcEndpoints",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpcEndpoint-property
  create: {
    method: "createVpcEndpoint",
    filterPayload: assign({
      PolicyDocument: pipe([get("PolicyDocument"), JSON.stringify]),
    }),
    pickCreated: () => pipe([get("VpcEndpoint")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifyVpcEndpoint-property
  update: {
    method: "modifyVpcEndpoint",
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVpcEndpoints-property
  destroy: {
    pickId,
    method: "deleteVpcEndpoints",
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
  configDefault: ({
    name,
    resourceName,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { vpc, subnets, securityGroups, routeTables },
    config,
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
    ])(),
});
