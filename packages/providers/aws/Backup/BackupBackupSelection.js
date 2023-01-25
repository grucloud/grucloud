const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const { managedByEFS } = require("./BackupCommon");

const pickId = pick(["SelectionId", "BackupPlanId"]);

const decorate = () =>
  pipe([
    omitIfEmpty([
      "Conditions.StringEquals",
      "Conditions.StringLike",
      "Conditions.StringNotEquals",
      "Conditions.StringNotLike",
    ]),
    omitIfEmpty(["Conditions", "ListOfTags", "NotResources"]),
  ]);

// EFS FileSystem
const managedByOther = () => pipe([managedByEFS]);

exports.BackupBackupSelection = ({}) => ({
  type: "BackupSelection",
  package: "backup",
  client: "Backup",
  //TODO prefix with backup plan name
  inferName: () => get("SelectionName"),
  findName: () => pipe([get("SelectionName")]),
  findId: () => pipe([get("SelectionId")]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  propertiesDefault: {},
  omitProperties: [
    "BackupPlanId",
    "CreationDate",
    "CreatorRequestId",
    "SelectionId",
    "IamRoleArn",
  ],
  dependencies: {
    backupPlan: {
      type: "BackupPlan",
      group: "Backup",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("BackupPlanId")]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("IamRoleArn")]),
    },
  },
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#listBackupSelections-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "BackupPlan", group: "Backup" },
          pickKey: pipe([pick(["BackupPlanId"])]),
          method: "listBackupSelections",
          getParam: "BackupSelectionsList",
          config,
          decorate:
            ({ parent }) =>
            (live) =>
              pipe([() => live, getById({}), defaultsDeep(live)])(),
        }),
    ])(),
  update:
    ({ endpoint }) =>
    async ({ pickId, payload, diff, live }) =>
      pipe([
        () => {
          throw Error("No AWS API to update a BackupSelection");
        },
      ])(),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidParameterValueException",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#getBackupSelection-property
  getById: {
    method: "getBackupSelection",
    getField: "BackupSelection",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#createBackupSelection-property
  create: {
    method: "createBackupSelection",
    filterPayload: ({ BackupPlanId, ...other }) =>
      pipe([() => ({ BackupPlanId, BackupSelection: other })])(),
    pickCreated: ({ payload }) => pipe([identity]),
    shouldRetryOnExceptionMessages: [
      "cannot be assumed by AWS Backup",
      "is not authorized to call tag:GetResources",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#updateBackupSelection-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#deleteBackupSelection-property
  destroy: {
    method: "deleteBackupSelection",
    pickId,
  },
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { backupPlan, iamRole },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(backupPlan);
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        BackupPlanId: getField(backupPlan, "BackupPlanId"),
        IamRoleArn: getField(iamRole, "Arn"),
      }),
    ])(),
});
