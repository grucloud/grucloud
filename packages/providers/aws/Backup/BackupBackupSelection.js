const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

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
    //TODO prefix with backup plan name
    findName: pipe([get("live"), get("SelectionName")]),
    findId: pipe([get("live.SelectionId")]),
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
                pipe([() => live, getById, defaultsDeep(live)])(),
          }),
      ])(),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#updateAccelerator-property
    //TODO
    update:
      ({ endpoint }) =>
      async ({ pickId, payload, diff, live }) =>
        pipe([
          tap((params) => {
            assert(endpoint);
          }),
          () => diff,
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
