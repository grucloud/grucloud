const assert = require("assert");
const { pipe, tap, get, pick, eq, map, filter, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const pickId = pick(["BackupVaultName"]);

const ignoreErrorMessages = ["Backup vault does not exist"];

const decorate = () =>
  pipe([assign({ Policy: pipe([get("Policy"), JSON.parse]) })]);

const filterPayload = pipe([
  assign({ Policy: pipe([get("Policy"), JSON.stringify]) }),
]);

const model = ({ config }) => ({
  package: "backup",
  client: "Backup",
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#getBackupVaultAccessPolicy-property
  getById: {
    method: "getBackupVaultAccessPolicy",
    pickId,
    decorate,
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#putBackupVaultAccessPolicy-property
  create: {
    method: "putBackupVaultAccessPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
    filterPayload,
  },
  update: {
    method: "putBackupVaultAccessPolicy",
    filterParams: ({ payload, live, diff }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#deleteBackupVaultAccessPolicy-property
  destroy: {
    method: "deleteBackupVaultAccessPolicy",
    pickId,
    ignoreErrorMessages,
  },
});

exports.BackupBackupVaultPolicy = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("BackupVaultName")]),
    findId: () => pipe([get("BackupVaultName")]),
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ BackupVaultName: name }), getById({})]),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#listBackupSelections-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "BackupVault", group: "Backup" },
            pickKey: pipe([pickId]),
            method: "getBackupVaultAccessPolicy",
            config,
            decorate,
          }),
      ])(),
    configDefault: ({
      name,
      namespace,
      properties: { ...otherProps },
      dependencies: { backupVault },
      config,
    }) =>
      pipe([
        tap((params) => {
          assert(backupVault);
        }),
        () => otherProps,
        defaultsDeep({
          BackupVaultName: backupVault.config.BackupVaultName,
        }),
      ])(),
  });
