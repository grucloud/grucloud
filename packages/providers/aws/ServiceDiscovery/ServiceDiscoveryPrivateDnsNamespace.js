const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, any } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./ServiceDiscoveryCommon");

const managedByOther = () =>
  pipe([get("Tags"), any(eq(get("Key"), "AmazonECSManaged"))]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const decorate = ({ endpoint, lives, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(lives);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    assign({
      Vpc: pipe([
        get("Properties.DnsProperties.HostedZoneId", ""),
        lives.getById({
          type: "HostedZone",
          group: "Route53",
          providerName: config.providerName,
        }),
        get("live.VpcAssociations"),
        first,
        get("VPCId"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html
exports.ServiceDiscoveryPrivateDnsNamespace = () => ({
  type: "PrivateDnsNamespace",
  package: "servicediscovery",
  client: "ServiceDiscovery",
  propertiesDefault: {},
  omitProperties: [
    "CreateDate",
    "Id",
    "Arn",
    "ServiceCount",
    "Properties.DnsProperties.HostedZoneId",
    "Properties.HttpProperties",
    "Vpc",
    "Type",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["NamespaceNotFound"],
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("Vpc"),
        ]),
    },
    hostedZone: {
      type: "HostedZone",
      group: "Route53",
      parent: true,
      dependsOnTypeOnly: true,
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#getNamespace-property
  getById: {
    method: "getNamespace",
    getField: "Namespace",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#listNamespaces-property
  getList: {
    enhanceParams: () => () => ({
      Filters: [
        {
          Name: "TYPE",
          Values: ["DNS_PRIVATE"],
          Condition: "EQ",
        },
      ],
    }),
    method: "listNamespaces",
    getParam: "Namespaces",
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#createPrivateDnsNamespace-property
  create: {
    method: "createPrivateDnsNamespace",
    pickCreated: ({ payload, endpoint }) =>
      pipe([
        pick(["OperationId"]),
        endpoint().getOperation,
        get("Operation.Targets.NAMESPACE"),
        (Id) => ({ Id }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#updatePrivateDnsNamespace-property
  update: {
    method: "updatePrivateDnsNamespace",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#deleteNamespace-property
  destroy: {
    method: "deleteNamespace",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { vpc },
    config,
  }) =>
    pipe([
      () => otherProps,
      tap((params) => {
        assert(vpc);
      }),
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        Vpc: getField(vpc, "VpcId"),
      }),
    ])(),
});
