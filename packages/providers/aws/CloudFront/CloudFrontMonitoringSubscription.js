const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  tryCatch,
  map,
  switchCase,
} = require("rubico");
const { defaultsDeep, find, isDeepEqual } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { isAwsError } = require("../AwsCommon");

const pickId = pipe([
  tap(({ DistributionId }) => {
    assert(DistributionId);
  }),
  pick(["DistributionId"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live.DistributionId);
    }),
    defaultsDeep({ DistributionId: live.DistributionId }),
  ]);

const propertiesDefault = {
  MonitoringSubscription: {
    RealtimeMetricsSubscriptionConfig: {
      RealtimeMetricsSubscriptionStatus: "Disabled",
    },
  },
};

const isDisabled = pipe([
  pick(["MonitoringSubscription"]),
  (live) => isDeepEqual(live, propertiesDefault),
]);

const managedByOther = () => isDisabled;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontMonitoringSubscription = () => ({
  type: "MonitoringSubscription",
  package: "cloudfront",
  client: "CloudFront",
  propertiesDefault,
  omitProperties: ["DistributionId"],
  managedByOther,
  cannotBeDeleted: managedByOther,
  inferName:
    ({ dependenciesSpec: { distribution } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(distribution);
        }),
        () => `${distribution}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ DistributionId }) =>
      pipe([
        tap(() => {
          assert(DistributionId);
        }),
        lives.getByType({
          type: "Distribution",
          group: "CloudFront",
        }),
        find(eq(get("live.Id"), DistributionId)),
        get("name", DistributionId),
      ])(),
  findId: () =>
    pipe([
      get("DistributionId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NoSuchMonitoringSubscription"],
  dependencies: {
    distribution: {
      type: "Distribution",
      group: "CloudFront",
      parent: true,
      dependencyId:
        ({ lives, config }) =>
        ({ DistributionId }) =>
          pipe([
            tap(() => {
              assert(DistributionId);
            }),
            lives.getByType({
              type: "Distribution",
              group: "CloudFront",
              providerName: config.providerName,
            }),
            find(eq(get("live.Id"), DistributionId)),
            get("id"),
          ])(),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getMonitoringSubscription-property
  getById:
    ({ endpoint, config }) =>
    () =>
    (live) =>
      pipe([
        () => live,
        pickId,
        tryCatch(
          endpoint().getMonitoringSubscription,
          // TODO only on NoSuchMonitoringSubscription, otherwise throw
          (error) => propertiesDefault
        ),
        decorate({ config, live }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getMonitoringSubscription-property
  getList:
    ({ getById }) =>
    ({ lives, config }) =>
      pipe([
        lives.getByType({
          type: "Distribution",
          group: "CloudFront",
          providerName: config.providerName,
        }),
        map(
          pipe([get("live"), ({ Id }) => ({ DistributionId: Id }), getById({})])
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createMonitoringSubscription-property
  create: {
    method: "createMonitoringSubscription",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  update:
    ({ endpoint, getById, create, destroy }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => payload,
        switchCase([
          isDisabled,
          endpoint().deleteMonitoringSubscription,
          endpoint().createMonitoringSubscription,
        ]),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteMonitoringSubscription-property
  destroy: {
    method: "deleteMonitoringSubscription",
    pickId,
    isInstanceDown: () => true,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    properties: { ...otherProps },
    dependencies: { distribution },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(distribution);
      }),
      () => otherProps,
      defaultsDeep({
        DistributionId: getField(distribution, "Id"),
      }),
    ])(),
});
