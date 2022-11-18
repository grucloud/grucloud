const assert = require("assert");
const { pipe, tap, get, pick, eq, or } = require("rubico");
const { defaultsDeep, when, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const managedByOther = pipe([
  get("live"),
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

const model = ({ config }) => ({
  package: "config-service",
  client: "ConfigService",
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
});

exports.ConfigConfigRule = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ConfigRuleName")]),
    findId: pipe([get("live.ConfigRuleName")]),
    getByName: getByNameCore,
    managedByOther,
    cannotBeDeleted: managedByOther,
    configDefault: ({
      name,
      namespace,
      properties: { ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        // TODO Tags
        () => otherProps,
      ])(),
  });
