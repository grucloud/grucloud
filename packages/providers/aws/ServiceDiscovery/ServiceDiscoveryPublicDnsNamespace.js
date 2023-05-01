const assert = require("assert");
const { pipe, tap, get, pick, eq, any } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
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

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html
exports.ServiceDiscoveryPublicDnsNamespace = () => ({
  type: "PublicDnsNamespace",
  package: "servicediscovery",
  client: "ServiceDiscovery",
  propertiesDefault: {},
  omitProperties: [
    "CreateDate",
    "Id",
    "Arn",
    "Properties.DnsProperties.HostedZoneId",
    "Properties.HttpProperties",
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
      tap((Id) => {
        assert(Id);
      }),
    ]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["NamespaceNotFound"],
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
          Values: ["DNS_PUBLIC"],
          Condition: "EQ",
        },
      ],
    }),
    method: "listNamespaces",
    getParam: "Namespaces",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#createPublicDnsNamespace-property
  create: {
    method: "createPublicDnsNamespace",
    pickCreated: ({ payload, endpoint }) =>
      pipe([
        pick(["OperationId"]),
        endpoint().getOperation,
        get("Operation.Targets.NAMESPACE"),
        tap((Id) => {
          assert(Id);
        }),
        (Id) => ({ Id }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#updatePublicDnsNamespace-property
  update: {
    method: "updatePublicDnsNamespace",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
