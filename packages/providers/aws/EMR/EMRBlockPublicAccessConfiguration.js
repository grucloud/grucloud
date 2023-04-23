const assert = require("assert");
const { pipe, tap, pick } = require("rubico");
const { defaultsDeep, identity, isDeepEqual } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([() => ({})]);

const defaultBlock = {
  BlockPublicAccessConfiguration: {
    BlockPublicSecurityGroupRules: true,
    PermittedPublicSecurityGroupRuleRanges: [{ MaxRange: 22, MinRange: 22 }],
  },
};
const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findName = () => () => "default";

const isDisabled = pipe([
  pick(["BlockPublicAccessConfiguration"]),
  JSON.stringify,
  JSON.parse,
  (live) => isDeepEqual(live, defaultBlock),
]);

const cannotBeDeleted = () => pipe([isDisabled]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html
exports.EMRBlockPublicAccessConfiguration = () => ({
  type: "BlockPublicAccessConfiguration",
  package: "emr",
  client: "EMR",
  propertiesDefault: {},
  omitProperties: ["BlockPublicAccessConfigurationMetadata"],
  inferName: findName,
  findName,
  findId: findName,
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#getBlockPublicAccessConfiguration-property
  getById: {
    method: "getBlockPublicAccessConfiguration",
    //getField: "BlockPublicAccessConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#getBlockPublicAccessConfiguration-property
  getList: {
    method: "getBlockPublicAccessConfiguration",
    //getParam: "BlockPublicAccessConfiguration",
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#putBlockPublicAccessConfiguration-property
  create: {
    method: "putBlockPublicAccessConfiguration",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#putBlockPublicAccessConfiguration-property
  update: {
    method: "putBlockPublicAccessConfiguration",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#putBlockPublicAccessConfiguration-property
  destroy: {
    method: "putBlockPublicAccessConfiguration",
    pickId: pipe([() => defaultBlock]),
    isInstaceDown: () => true,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
