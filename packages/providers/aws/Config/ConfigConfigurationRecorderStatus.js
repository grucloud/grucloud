const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ ConfigurationRecorderName }) => {
    assert(ConfigurationRecorderName);
  }),
  pick(["ConfigurationRecorderName"]),
]);

const decorate = ({ parent }) =>
  pipe([
    ({ name, ...other }) => ({
      ConfigurationRecorderName: name,
      ...other,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#startConfigurationRecorder-property
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#stopConfigurationRecorder-property

const updateOrCreate =
  ({ endpoint, getById }) =>
  ({ payload }) =>
    pipe([
      tap((params) => {
        assert(getById);
      }),
      () => payload,
      switchCase([
        get("recording"),
        pipe([pickId, endpoint().startConfigurationRecorder]),
        pipe([pickId, endpoint().stopConfigurationRecorder]),
      ]),
    ])();

exports.ConfigConfigurationRecorderStatus = ({}) => ({
  type: "ConfigurationRecorderStatus",
  package: "config-service",
  client: "ConfigService",
  inferName: ({ dependenciesSpec: { deliveryChannel } }) =>
    pipe([
      tap((params) => {
        assert(deliveryChannel);
      }),
      () => deliveryChannel,
    ]),
  findName: () => pipe([get("ConfigurationRecorderName")]),
  findId: () => pipe([get("ConfigurationRecorderName")]),
  ignoreErrorCodes: ["NoSuchConfigurationRecorderException"],
  propertiesDefault: {},
  omitProperties: [
    "ConfigurationRecorderName",
    "lastStartTime",
    "lastStopTime",
    "lastStatus",
    "lastErrorCode",
    "lastErrorMessage",
    "lastStatusChangeTime",
  ],
  dependencies: {
    deliveryChannel: {
      type: "DeliveryChannel",
      group: "Config",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([get("ConfigurationRecorderName")]),
    },
  },
  getById: {
    method: "describeConfigurationRecorderStatus",
    pickId: pipe([
      tap(({ ConfigurationRecorderName }) => {
        assert(ConfigurationRecorderName);
      }),
      ({ ConfigurationRecorderName }) => ({
        ConfigurationRecorderNames: [ConfigurationRecorderName],
      }),
    ]),
    getField: "ConfigurationRecordersStatus",
    decorate,
  },
  getList: {
    method: "describeConfigurationRecorderStatus",
    getParam: "ConfigurationRecordersStatus",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#stopConfigurationRecorder-property
  destroy: {
    method: "stopConfigurationRecorder",
    pickId,
    isInstanceDown: pipe([eq(get("recording"), false)]),
  },
  getByName: getByNameCore,
  create: updateOrCreate,
  update: updateOrCreate,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { deliveryChannel },
    config,
  }) =>
    pipe([
      () => ({
        ...otherProps,
        ConfigurationRecorderName: deliveryChannel.config.name,
      }),
    ])(),
});
