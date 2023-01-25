const assert = require("assert");
const { pipe, tap, get, assign, switchCase } = require("rubico");
const { defaultsDeep, when, includes } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");
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

exports.ConfigConfigurationRecorder = ({}) => ({
  type: "ConfigurationRecorder",
  package: "config-service",
  client: "ConfigService",
  findName: () => pipe([get("name")]),
  findId: () => pipe([get("name")]),
  ignoreErrorCodes: ["NoSuchConfigurationRecorderException"],
  propertiesDefault: {},
  omitProperties: [],
  inferName: () => get("name"),
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("roleARN")]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        roleARN: pipe([
          get("roleARN"),
          switchCase([
            includes("AWSServiceRoleForConfig"),
            replaceAccountAndRegion({ lives, providerConfig }),
            replaceWithName({
              groupType: "IAM::Role",
              path: "id",
              providerConfig,
              lives,
            }),
          ]),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeConfigurationRecorders-property
  getById: {
    method: "describeConfigurationRecorders",
    pickId: pipe([
      tap(({ name }) => {
        assert(name);
      }),
      ({ name }) => ({
        ConfigurationRecorderNames: [name],
      }),
    ]),
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
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { iamRole },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(() => iamRole, defaultsDeep({ roleARN: getField(iamRole, "Arn") })),
    ])(),
});
