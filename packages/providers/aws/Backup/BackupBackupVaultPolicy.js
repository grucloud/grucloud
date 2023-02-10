const assert = require("assert");
const { pipe, tap, get, pick, eq, map, filter, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { assignPolicyAccountAndRegion } = require("../IAM/AwsIamCommon");

const pickId = pick(["BackupVaultName"]);

const ignoreErrorMessages = ["Backup vault does not exist"];

const decorate = () =>
  pipe([assign({ Policy: pipe([get("Policy"), JSON.parse]) })]);

const filterPayload = pipe([
  assign({ Policy: pipe([get("Policy"), JSON.stringify]) }),
]);

exports.BackupBackupVaultPolicy = ({}) => ({
  type: "BackupVaultPolicy",
  package: "backup",
  client: "Backup",
  inferName: ({ dependenciesSpec: { backupVault } }) =>
    pipe([() => backupVault]),
  findName: () => pipe([get("BackupVaultName")]),
  findId: () => pipe([get("BackupVaultName")]),
  omitProperties: ["BackupVaultName", "BackupVaultArn"],
  dependencies: {
    backupVault: {
      type: "BackupVault",
      group: "Backup",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("BackupVaultName")]),
    },
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      assign({
        Policy: pipe([
          get("Policy"),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
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
