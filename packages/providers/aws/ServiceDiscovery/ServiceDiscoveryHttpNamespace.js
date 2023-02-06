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
exports.ServiceDiscoveryHttpNamespace = () => ({
  type: "HttpNamespace",
  package: "servicediscovery",
  client: "ServiceDiscovery",
  propertiesDefault: {},
  omitProperties: ["CreateDate", "Id", "Arn", "Type"],
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
          Values: ["HTTP"],
          Condition: "EQ",
        },
      ],
    }),
    method: "listNamespaces",
    getParam: "Namespaces",
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#createHttpNamespace-property
  create: {
    method: "createHttpNamespace",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#updateHttpNamespace-property
  update: {
    method: "updateHttpNamespace",
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
