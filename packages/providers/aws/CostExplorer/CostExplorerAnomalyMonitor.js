const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./CostExplorerCommon");

const buildArn = () =>
  pipe([
    get("MonitorArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ MonitorArn }) => {
    assert(MonitorArn);
  }),
  pick(["MonitorArn"]),
]);

const decorate = ({ endpoint }) => pipe([assignTags({ buildArn, endpoint })]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html
exports.CostExplorerAnomalyMonitor = () => ({
  type: "AnomalyMonitor",
  package: "cost-explorer",
  client: "CostExplorer",
  propertiesDefault: {},
  omitProperties: [
    "MonitorArn",
    "LastEvaluatedDate",
    "LastUpdatedDate",
    "CreationDate",
    "DimensionalValueCount",
  ],
  inferName: () =>
    pipe([
      get("MonitorName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("MonitorName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("MonitorArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["UnknownMonitorException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#getAnomalyMonitor-property
  getById: {
    method: "getAnomalyMonitors",
    getField: "AnomalyMonitors",
    pickId: pipe([({ MonitorArn }) => ({ MonitorArnList: [MonitorArn] })]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#listAnomalyMonitors-property
  getList: {
    method: "getAnomalyMonitors",
    getParam: "AnomalyMonitors",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#createAnomalyMonitor-property
  create: {
    filterPayload: pipe([
      ({ Tags, ...payload }) => ({
        AnomalyMonitor: payload,
        ResourceTags: Tags,
      }),
    ]),
    method: "createAnomalyMonitor",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#updateAnomalyMonitor-property
  update: {
    method: "updateAnomalyMonitor",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#deleteAnomalyMonitor-property
  destroy: {
    method: "deleteAnomalyMonitor",
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
