const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

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

const model = ({ config }) => ({
  package: "backup",
  client: "Backup",
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
  update: {
    method: "updateBackupSelection",
    filterParams: ({ payload: { Tags, ...other }, live }) =>
      pipe([
        () => ({ BackupPlan: other, BackupPlanTags: Tags }),
        defaultsDeep({ BackupPlanId: live.BackupPlanId }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#deleteBackupSelection-property
  destroy: {
    method: "deleteBackupSelection",
    pickId,
  },
});

exports.BackupBackupSelection = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    managedByOther,
    cannotBeDeleted: managedByOther,
    //TODO prefix with backup plan name
    findName: () => pipe([get("SelectionName")]),
    findId: () => pipe([get("SelectionId")]),
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
    configDefault: ({
      name,
      namespace,
      properties: { ...otherProps },
      dependencies: { backupPlan, iamRole },
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
