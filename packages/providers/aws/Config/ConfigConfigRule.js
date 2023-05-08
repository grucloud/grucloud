const assert = require("assert");
const { pipe, tap, get, pick, eq, or } = require("rubico");

const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./ConfigServiceCommon");

const managedByOther = () =>
  pipe([
    or([
      eq(get("Source.Owner"), "AWS"),
      eq(get("CreatedBy"), "securityhub.amazonaws.com"),
    ]),
  ]);

const buildArn = () =>
  pipe([
    get("ConfigRuleArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ConfigRuleName }) => {
    assert(ConfigRuleName);
  }),
  pick(["ConfigRuleName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assignTags({ buildArn: buildArn({ config }), endpoint }),
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
  update: {
    method: "putConfigRule",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#deleteConfigRule-property
  destroy: {
    method: "deleteConfigRule",
    pickId,
  },
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
