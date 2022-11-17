const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, keys, isDeepEqual } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const configurationDefault = {
  AutoEnable: false,
  AutoEnableStandards: "DEFAULT",
};

const pickId = pipe([() => ({})]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const cannotBeDeleted = pipe([
  get("live"),
  pick(keys(configurationDefault)),
  (value) => isDeepEqual(value, configurationDefault),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html
exports.SecurityHubOrganizationConfiguration = () => ({
  type: "OrganizationConfiguration",
  package: "securityhub",
  client: "SecurityHub",
  propertiesDefault: {},
  omitProperties: ["MemberAccountLimitReached"],
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  inferName: pipe([() => "default"]),
  findName: pipe([() => "default"]),
  findId: pipe([() => "default"]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    securityHubAccount: {
      type: "Account",
      group: "SecurityHub",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#describeOrganizationConfiguration-property
  getById: {
    method: "describeOrganizationConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#describeOrganizationConfiguration-property
  getList: {
    method: "describeOrganizationConfiguration",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#updateOrganizationConfiguration-property
  update: {
    method: "updateOrganizationConfiguration",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#updateOrganizationConfiguration-property
  destroy: {
    method: "updateOrganizationConfiguration",
    pickId: () => configurationDefault,
    isInstanceDown: () => true,
  },
  getByName: getByNameCore,
  configDefault: ({ properties: { ...otherProps }, dependencies: {} }) =>
    pipe([() => otherProps, defaultsDeep({})])(),
});
