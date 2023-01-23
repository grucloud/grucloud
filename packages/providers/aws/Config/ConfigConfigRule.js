const assert = require("assert");
const { pipe, tap, get, pick, eq, or } = require("rubico");

const { getByNameCore } = require("@grucloud/core/Common");

const managedByOther = () =>
  pipe([
    or([
      eq(get("Source.Owner"), "AWS"),
      eq(get("CreatedBy"), "securityhub.amazonaws.com"),
    ]),
  ]);

const pickId = pipe([
  tap(({ ConfigRuleName }) => {
    assert(ConfigRuleName);
  }),
  pick(["ConfigRuleName"]),
]);

const decorate = ({ endpoint, parent }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

exports.ConfigConfigRule = ({}) => ({
  type: "ConfigRule",
  package: "config-service",
  client: "ConfigService",
  inferName: () => get("ConfigRuleName"),
  findName: () => pipe([get("ConfigRuleName")]),
  findId: () => pipe([get("ConfigRuleName")]),
  propertiesDefault: {},
  omitProperties: [
    "ConfigRuleArn",
    "ConfigRuleId",
    "ConfigRuleState",
    "CreatedBy",
  ],
  getByName: getByNameCore,
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["NoSuchConfigRuleException"],
  getById: {
    method: "describeConfigRules",
    pickId: pipe([
      tap(({ ConfigRuleName }) => {
        assert(ConfigRuleName);
      }),
      ({ ConfigRuleName }) => ({
        ConfigRuleNames: [ConfigRuleName],
      }),
    ]),
    getField: "ConfigRules",
    decorate,
  },
  getList: {
    method: "describeConfigRules",
    getParam: "ConfigRules",
    decorate,
  },
  create: {
    method: "putConfigRule",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#deleteConfigRule-property
  destroy: {
    method: "deleteConfigRule",
    pickId,
  },
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      // TODO Tags
      () => otherProps,
    ])(),
});
