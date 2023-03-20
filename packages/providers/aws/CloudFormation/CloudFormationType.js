const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const pickId = pipe([
  tap(({ TypeName, Type }) => {
    assert(TypeName);
  }),
  pick(["TypeName", "Type"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html
exports.CloudFormationType = () => ({
  type: "Type",
  package: "cloudformation",
  client: "CloudFormation",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "TypeTestsStatus",
    "TypeArn",
    "DefaultVersionId",
    "VersionId",
    "DeprecatedStatus",
    "SourceUrl",
    "DocumentationUrl",
    "ExecutionRoleArn",
    "LoggingConfig.LogRoleArn",
    "IsDefaultVersion",
    "TimeCreated",
    "OriginalTypeArn",
    "LatestPublicVersion",
    "IsActivated",
  ],
  inferName: () =>
    pipe([
      get("TypeName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("TypeName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["TypeNotFoundException"],
  dependencies: {
    iamExecutionRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("ExecutionRoleArn")]),
    },
    iamLogRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([get("LoggingConfig.LogRoleArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#describeType-property
  getById: {
    method: "describeType",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#listTypes-property
  getList: {
    method: "listTypes",
    getParam: "TypeSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#activateType-property
  create: {
    method: "activateType",
    pickCreated: ({ payload }) => pipe([() => payload]),
    // isInstanceUp: pipe([get("State"), isIn(["RUNNING"])]),
    // isInstanceError: pipe([get("State"), isIn(["FAILED"])]),
    // getErrorMessage: pipe([get("StateChangeReason.Message", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#updateType-property
  update: {
    method: "updateType",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#deregisterType-property
  destroy: {
    method: "deregisterType",
    pickId,
    shouldRetryOnExceptionMessages: [
      "is the default version and cannot be deregistered",
    ],
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { iamExecutionRole, iamLogRole },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => iamExecutionRole,
        assign({
          ExecutionRoleArn: () => getField(iamExecutionRole, "Arn"),
        })
      ),
      when(
        () => iamLogRole,
        defaultsDeep({
          LoggingConfig: { LogRoleArn: getField(iamLogRole, "Arn") },
        })
      ),
    ])(),
});
