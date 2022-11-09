const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const pickId = pipe([
  tap(({ name }) => {
    assert(name);
  }),
  ({ name }) => ({ ConfigurationRecorderName: name }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

const model = ({ config }) => ({
  package: "config-service",
  client: "ConfigService",
  ignoreErrorCodes: ["NoSuchConfigurationRecorderException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeConfigurationRecorders-property
  getById: {
    method: "describeConfigurationRecorders",
    pickId,
    getField: "ConfigurationRecorders",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeConfigurationRecorders-property
  getList: {
    method: "describeConfigurationRecorders",
    getParam: "ConfigurationRecorders",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putConfigurationRecorder-property
  create: {
    method: "putConfigurationRecorder",
    filterPayload: pipe([
      (ConfigurationRecorder) => ({ ConfigurationRecorder }),
    ]),
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putConfigurationRecorder-property
  update: {
    method: "putConfigurationRecorder",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        (ConfigurationRecorder) => ({ ConfigurationRecorder }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#deleteConfigurationRecorder-property
  destroy: {
    method: "deleteConfigurationRecorder",
    pickId,
  },
});

exports.ConfigConfigurationRecorder = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.name")]),
    findId: pipe([get("live.name")]),
    getByName: getByNameCore,
    configDefault: ({
      name,
      namespace,
      properties: { ...otherProps },
      dependencies: { iamRole },
    }) =>
      pipe([
        () => otherProps,
        when(
          () => iamRole,
          defaultsDeep({ roleARN: getField(iamRole, "Arn") })
        ),
      ])(),
  });
