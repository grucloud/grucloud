const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ConfigRuleName }) => {
    assert(ConfigRuleName);
  }),
  ({ ConfigRuleName }) => ({ ConfigRuleNames: [ConfigRuleName] }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const filterPayload = pipe([
  (RemediationConfiguration) => ({
    RemediationConfigurations: [RemediationConfiguration],
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html
exports.ConfigRemediationConfiguration = () => ({
  type: "RemediationConfiguration",
  package: "config-service",
  client: "ConfigService",
  propertiesDefault: {},
  omitProperties: ["Arn", "CreatedByService"],
  inferName:
    ({ dependenciesSpec: { configRule } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(configRule);
        }),
        () => `${configRule}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ ConfigRuleName }) =>
      pipe([
        tap((params) => {
          assert(ConfigRuleName);
        }),
        () => `${ConfigRuleName}`,
      ])(),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NoSuchRemediationConfigurationException"],
  dependencies: {
    configRule: {
      type: "ConfigRule",
      group: "Config",
      parent: true,
      required: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ConfigRuleName"),
          tap((ConfigRuleName) => {
            assert(ConfigRuleName);
          }),
        ]),
    },
    ssmDocument: {
      type: "Document",
      group: "SSM",
      parent: true,
      required: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("TargetId"),
          tap((TargetId) => {
            assert(TargetId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeRemediationConfigurations-property
  getById: {
    method: "describeRemediationConfigurations",
    getField: "RemediationConfigurations",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeRemediationConfigurations-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "ConfigRule", group: "Config" },
          pickKey: pipe([pickId]),
          method: "describeRemediationConfigurations",
          getParam: "RemediationConfigurations",
          config,
          decorate: ({ parent }) => pipe([decorate({ endpoint, config })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putRemediationConfigurations-property
  create: {
    filterPayload,
    method: "putRemediationConfigurations",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putRemediationConfigurations-property
  update: {
    method: "putRemediationConfigurations",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#deleteRemediationConfiguration-property
  destroy: {
    method: "deleteRemediationConfiguration",
    pickId: pipe([
      tap(({ ConfigRuleName }) => {
        assert(ConfigRuleName);
      }),
      pick(["ConfigRuleName", "ResourceType"]),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { ssmDocument },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => otherProps,
      when(
        () => ssmDocument,
        defaultsDeep({ TargetId: getField(ssmDocument, "Name") })
      ),
    ])(),
});
