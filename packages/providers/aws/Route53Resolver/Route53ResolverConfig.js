const assert = require("assert");
const { pipe, tap, get, pick, assign, eq } = require("rubico");
const { defaultsDeep, identity, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ResourceId }) => {
    assert(ResourceId);
  }),
  pick(["ResourceId"]),
]);

const cannotBeDeleted = () => pipe([eq(get("AutodefinedReverse"), "ENABLED")]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      AutodefinedReverseFlag: pipe([
        get("AutodefinedReverse"),
        callProp("startsWith", "ENABL"),
        () => "ENABLE",
        () => "DISABLE",
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverConfig = () => ({
  type: "Config",
  package: "route53resolver",
  client: "Route53Resolver",
  propertiesDefault: {},
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  omitProperties: ["Id", "ResourceId", "OwnerId", "AutodefinedReverse"],
  inferName:
    ({ dependenciesSpec: { vpc } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(vpc);
        }),
        () => `${vpc}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ ResourceId, Id }) =>
      pipe([
        () => ResourceId,
        lives.getById({
          type: "Vpc",
          group: "EC2",
          providerName: config.providerName,
        }),
        get("name", Id),
        tap((name) => {
          //assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("Id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["InvalidParameterException", "InvalidRequestException"],
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ResourceId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getResolverConfig-property
  getById: {
    method: "getResolverConfig",
    getField: "ResolverConfig",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listResolverConfigs-property
  getList: {
    method: "listResolverConfigs",
    getParam: "ResolverConfigs",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateResolverConfig-property
  create: {
    method: "updateResolverConfig",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateResolverConfig-property
  update: {
    method: "updateResolverConfig",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateResolverConfig-property
  destroy: {
    method: "updateResolverConfig",
    pickId: pipe([pickId, defaultsDeep({ AutodefinedReverseFlag: "ENABLE" })]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { vpc },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(vpc);
      }),
      () => otherProps,
      defaultsDeep({ ResourceId: getField(vpc, "VpcId") }),
    ])(),
});
