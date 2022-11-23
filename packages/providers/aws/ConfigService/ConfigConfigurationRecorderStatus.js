const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

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

const model = ({ config }) => ({
  package: "config-service",
  client: "ConfigService",
  ignoreErrorCodes: ["NoSuchConfigurationRecorderException"],
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
});
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

exports.ConfigConfigurationRecorderStatus = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("ConfigurationRecorderName")]),
    findId: () => pipe([get("ConfigurationRecorderName")]),
    getByName: getByNameCore,
    create: updateOrCreate,
    update: updateOrCreate,
    configDefault: ({
      name,
      namespace,
      properties: { ...otherProps },
      dependencies: { deliveryChannel },
    }) =>
      pipe([
        () => ({
          ...otherProps,
          ConfigurationRecorderName: deliveryChannel.config.name,
        }),
      ])(),
  });
