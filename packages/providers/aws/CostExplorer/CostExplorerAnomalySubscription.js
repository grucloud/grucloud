const assert = require("assert");
const { pipe, tap, get, pick, assign, map, eq } = require("rubico");
const { defaultsDeep, identity, when } = require("rubico/x");

const { replaceWithName } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./CostExplorerCommon");

const buildArn = () =>
  pipe([
    get("SubscriptionArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ SubscriptionArn }) => {
    assert(SubscriptionArn);
  }),
  pick(["SubscriptionArn"]),
]);

const decorate = ({ endpoint }) => pipe([assignTags({ buildArn, endpoint })]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html
exports.CostExplorerAnomalySubscription = () => ({
  type: "AnomalySubscription",
  package: "cost-explorer",
  client: "CostExplorer",
  propertiesDefault: {},
  omitProperties: [
    "SubscriptionArn",
    "MonitorArnList",
    "AccountId",
    "Subscribers[].Status",
    "Threshold",
  ],
  inferName: () =>
    pipe([
      get("SubscriptionName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("SubscriptionName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("SubscriptionArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    anomalyMonitors: {
      type: "AnomalyMonitor",
      group: "CostExplorer",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("MonitorArnList")]),
    },
  },
  ignoreErrorCodes: ["UnknownSubscriptionException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Subscribers: pipe([
          get("Subscribers"),
          map(
            when(
              eq(get("Type"), "SNS"),
              assign({
                Address: pipe([
                  get("Address"),
                  replaceWithName({
                    groupType: "SNS::Topic",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                ]),
              })
            )
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#getAnomalySubscription-property
  getById: {
    method: "getAnomalySubscriptions",
    getField: "AnomalySubscriptions",
    pickId: pipe([
      ({ MonitorArn, SubscriptionArn }) => ({
        MonitorArn,
        SubscriptionArnList: [SubscriptionArn],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#listAnomalySubscriptions-property
  getList: {
    method: "getAnomalySubscriptions",
    getParam: "AnomalySubscriptions",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#createAnomalySubscription-property
  create: {
    filterPayload: pipe([
      //thresholdExpressionStringify,
      ({ Tags, ...payload }) => ({
        AnomalySubscription: payload,
        ResourceTags: Tags,
      }),
    ]),
    method: "createAnomalySubscription",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#updateAnomalySubscription-property
  update: {
    method: "updateAnomalySubscription",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#deleteAnomalySubscription-property
  destroy: {
    method: "deleteAnomalySubscription",
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
    dependencies: { anomalyMonitors },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      assign({
        MonitorArnList: pipe([
          () => anomalyMonitors,
          map((monitor) => getField(monitor, "MonitorArn")),
        ]),
      }),
    ])(),
});
