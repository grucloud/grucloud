const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

// TODO test

const pickId = pipe([
  tap(({ AppMonitorName }) => {
    assert(AppMonitorName);
  }),
  pick(["AppMonitorName", "Destination", "DestinationArn"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live);
    }),
  ]);

const getDestinationName = ({ lives, config }) =>
  pipe([
    tap((params) => {
      assert(lives);
      assert(config);
      assert(appMonitor);
      assert(Destination);
      assert(DestinationArn);
    }),
    switchCase([
      eq(get("Destination"), "CloudWatch"),
      pipe([get("Destination")]),
      //TODO
      eq(get("Destination"), "Evidently"),
      pipe([
        get("DestinationArn"),
        lives.getById({ type: "Experiment", group: "Evidently" }),
        get("name"),
      ]),
      () => {
        assert(false, "Destination should be either CloudWatch or Evidently");
      },
    ]),
    tap((name) => {
      assert(name);
    }),
  ]);

const findName =
  ({ lives, config }) =>
  ({ AppMonitorName, ...other }) =>
    pipe([
      () => other,
      getDestinationName({ lives, config }),
      (name) => `${AppMonitorName}::${name}`,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html
exports.RUMMetricsDestination = () => ({
  type: "MetricsDestination",
  package: "rum",
  client: "RUM",
  propertiesDefault: {},
  omitProperties: ["IamRoleArn", "DestinationArn"],
  inferName: ({ dependenciesSpec: { appMonitor }, lives, config }) =>
    pipe([
      tap((params) => {
        assert(lives);
        assert(config);
        assert(appMonitor);
        assert(Destination);
      }),
      getDestinationName({ lives, config }),
      (name) => `${appMonitor}::${name}`,
    ]),
  findName,
  findId: findName,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    appMonitor: {
      type: "AppMonitor",
      group: "RUM",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("AppMonitorName"),
          tap((AppMonitorName) => {
            assert(AppMonitorName);
          }),
        ]),
    },
    //TODO
    // evidentlyExperiment: {
    //   type: "Experiment",
    //   group: "Evidently",
    //   dependencyId: ({ lives, config }) => pipe([get("DestinationArn")]),
    // },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("IamRoleArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html#batchGetRumMetricDefinitions-property
  getById: {
    method: "batchGetRumMetricDefinitions",
    getField: "MetricDefinitions",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html#listRumMetricsDestinations-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "AppMonitor", group: "RUM" },
          pickKey: pipe([
            tap(({ Name }) => {
              assert(Name);
            }),
            ({ Name }) => ({ AppMonitorName: Name }),
          ]),
          method: "listRumMetricsDestinations",
          getParam: "Destinations",
          config,
          decorate: ({ parent }) =>
            pipe([() => ({ AppMonitorName: parent.Name }), getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html#putRumMetricsDestination-property
  create: {
    method: "putRumMetricsDestination",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html#putRumMetricsDestination-property
  update: {
    method: "putRumMetricsDestination",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html#deleteRumMetricsDestination-property
  destroy: {
    method: "deleteRumMetricsDestination",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { iamRole },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({ IamRoleArn: getField(iamRole, "Arn") }),
    ])(),
});
