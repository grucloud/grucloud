const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ UsageLimitId }) => {
    assert(UsageLimitId);
  }),
  pick(["UsageLimitId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html
exports.RedshiftUsageLimit = () => ({
  type: "UsageLimit",
  package: "redshift",
  client: "Redshift",
  propertiesDefault: {},
  omitProperties: ["ClusterIdentifier"],
  inferName:
    ({ dependenciesSpec: { cluster } }) =>
    ({ FeatureType }) =>
      pipe([
        tap((param) => {
          assert(cluster);
          assert(FeatureType);
        }),
        () => `${cluster}::${FeatureType}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("ClusterIdentifier"),
        tap((id) => {
          assert(id);
        }),
        lives.getById({
          type: "Cluster",
          group: "Redshift",
          providerName: config.providerName,
        }),
        get("name", live.ClusterIdentifier),
        ({ cluster }) => `${cluster}::${live.FeatureType}`,
      ])(),
  findId:
    () =>
    ({ ClusterIdentifier, FeatureType }) =>
      pipe([
        tap((params) => {
          assert(ClusterIdentifier);
          assert(FeatureType);
        }),
        () => `${ClusterIdentifier}::${FeatureType}`,
      ])(),
  dependencies: {
    cluster: {
      type: "Cluster",
      group: "Redshift",
      parent: true,
      parentForName: true,
      dependencyId: ({ lives, config }) => pipe([get("ClusterIdentifier")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException", "UsageLimitNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeUsageLimit-property
  getById: {
    method: "describeUsageLimits",
    getField: "UsageLimits",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeUsageLimit-property
  getList: {
    method: "describeUsageLimits",
    getParam: "UsageLimits",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#createUsageLimit-property
  create: {
    method: "createUsageLimit",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#updateUsageLimit-property
  update: {
    method: "modifyUsageLimit",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#deleteUsageLimit-property
  destroy: {
    method: "deleteUsageLimit",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    properties: { ...otherProps },
    dependencies: { cluster },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(cluster);
        assert(account);
      }),
      () => otherProps,
      defaultsDeep({
        ClusterIdentifier: getField(cluster, "ClusterIdentifier"),
      }),
    ])(),
});
