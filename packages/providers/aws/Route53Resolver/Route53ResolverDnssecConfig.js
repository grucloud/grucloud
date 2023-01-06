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

const cannotBeDeleted = () => pipe([eq(get("FirewallFailOpen"), "DISABLED")]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      Validation: pipe([
        get("ValidationStatus"),
        callProp("startsWith", "ENABL"),
        () => "ENABLE",
        () => "DISABLE",
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverDnssecConfig = () => ({
  type: "DnssecConfig",
  package: "route53resolver",
  client: "Route53Resolver",
  propertiesDefault: {},
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  omitProperties: ["Id", "ResourceId", "OwnerId", "ValidationStatus"],
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
  ignoreErrorCodes: ["ValidationException", "AccessDeniedException"],
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getResolverDnssecConfig-property
  getById: {
    method: "getResolverDnssecConfig",
    getField: "ResolverDNSSECConfig",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listResolverDnssecConfigs-property
  getList: {
    method: "listResolverDnssecConfigs",
    getParam: "ResolverDnssecConfigs",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateDnssecConfig-property
  create: {
    method: "updateResolverDnssecConfig",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateDnssecConfig-property
  update: {
    method: "updateResolverDnssecConfig",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateDnssecConfig-property
  destroy: {
    method: "updateResolverDnssecConfig",
    pickId: pipe([pickId, defaultsDeep({ FirewallFailOpen: "DISABLED" })]),
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
