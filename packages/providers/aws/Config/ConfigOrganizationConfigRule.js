const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ OrganizationConfigRuleName }) => {
    assert(OrganizationConfigRuleName);
  }),
  pick(["OrganizationConfigRuleName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html
exports.ConfigOrganizationConfigRule = () => ({
  type: "OrganizationConfigRule",
  package: "config-service",
  client: "ConfigService",
  propertiesDefault: {},
  omitProperties: [
    "OrganizationConfigRuleArn",
    "ExcludedAccounts",
    "LastUpdateTime",
  ],
  inferName: () =>
    pipe([
      get("OrganizationConfigRuleName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("OrganizationConfigRuleName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("OrganizationConfigRuleName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    accountsExcluded: {
      type: "Account",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("ExcludedAccounts")]),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId: ({ lives, config }) =>
        get("OrganizationConfigRuleMetadata.LambdaFunctionArn"),
    },
  },
  ignoreErrorCodes: ["NoSuchOrganizationConfigRuleException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeOrganizationConfigRules-property
  getById: {
    method: "describeOrganizationConfigRules",
    getField: "OrganizationConfigRules",
    pickId: pipe([
      tap(({ OrganizationConfigRuleName }) => {
        assert(OrganizationConfigRuleName);
      }),
      ({ OrganizationConfigRuleName }) => ({
        OrganizationConfigRuleNames: [OrganizationConfigRuleName],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeOrganizationConfigRules-property
  getList: {
    method: "describeOrganizationConfigRules",
    getParam: "OrganizationConfigRules",
    filterResource: pipe([get("OrganizationConfigRuleMetadata")]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putOrganizationConfigRule-property
  create: {
    method: "putOrganizationConfigRule",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#updateOrganizationConfigRule-property
  update: {
    method: "putOrganizationConfigRule",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#deleteOrganizationConfigRule-property
  destroy: {
    method: "deleteOrganizationConfigRule",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    properties: { ...otherProps },
    dependencies: { accountsExcluded, lambdaFunction },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({}),
      when(
        () => accountsExcluded,
        defaultsDeep({
          ExcludedAccounts: pipe([
            () => accountsExcluded,
            map((account) => getField(account, "Id")),
          ])(),
        })
      ),
      when(
        () => lambdaFunction,
        defaultsDeep({
          OrganizationConfigRuleMetadata: {
            LambdaFunctionArn: getField(
              lambdaFunction,
              "Configuration.FunctionArn"
            ),
          },
        })
      ),
    ])(),
});
