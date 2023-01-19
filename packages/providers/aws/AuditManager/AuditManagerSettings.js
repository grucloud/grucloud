const assert = require("assert");
const { pipe, tap, get, omit, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const defaultSettings = {
  defaultAssessmentReportsDestination: undefined,
  defaultProcessOwners: [],
  evidenceFinderEnablement: undefined,
  isAwsOrgEnabled: true,
  kmsKey: "DEFAULT",
  snsTopic: undefined,
};

const decorate = ({ endpoint, config }) =>
  pipe([
    get("settings"),
    omit(["kmsKey"]),
    omitIfEmpty(["defaultProcessOwners"]),
    when(
      get("evidenceFinderEnablement"),
      defaultsDeep({ evidenceFinderEnabled: true })
    ),
  ]);

const findName = () => pipe([() => "default"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html
exports.AuditManagerSettings = () => ({
  type: "Settings",
  package: "auditmanager",
  client: "AuditManager",
  propertiesDefault: {},
  omitProperties: [
    "snsTopic",
    "evidenceFinderEnablement",
    "defaultProcessOwners.roleArn",
  ],
  inferName: findName,
  findName: findName,
  findId: findName,
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  dependencies: {
    auditManagerAccount: {
      type: "AccountRegistration",
      group: "AuditManager",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([get("defaultProcessOwners.roleArn")]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => pipe([get("snsTopic")]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("defaultAssessmentReportsDestination.destination")]),
    },
  },
  getById: {
    method: "getSettings",
    pickId: () => ({ attribute: "ALL" }),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#getSettings-property
  getList: {
    method: "getSettings",
    enhanceParams: () => () => ({ attribute: "ALL" }),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#updateSettings-property
  create: {
    method: "updateSettings",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: () => true,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#updateSettings-property
  update: {
    method: "updateSettings",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#updateSettings-property
  destroy: {
    method: "updateSettings",
    pickId: () => defaultSettings,
    isInstanceDown: () => true,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { snsTopic, iamRole },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(
        () => iamRole,
        defaultsDeep({
          defaultProcessOwners: {
            roleArn: getField(iamRole, "Arn"),
          },
        })
      ),
      when(
        () => snsTopic,
        defaultsDeep({
          snsTopic: getField(snsTopic, "Attributes.TopicArn"),
        })
      ),
    ])(),
});
