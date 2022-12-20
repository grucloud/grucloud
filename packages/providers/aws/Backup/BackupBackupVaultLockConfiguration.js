const assert = require("assert");
const { pipe, tap, get, pick, eq, map, filter, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const pickId = pick(["BackupVaultName"]);

const decorate = () =>
  pipe([
    switchCase([
      get("Locked"),
      pick(["BackupVaultName", "MinRetentionDays", "MaxRetentionDays"]),
      () => undefined,
    ]),
  ]);

const model = ({ config }) => ({
  package: "backup",
  client: "Backup",
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#describeBackupVault-property
  getById: {
    method: "describeBackupVault",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#putBackupVaultLockConfiguration-property
  create: {
    method: "putBackupVaultLockConfiguration",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  update: {
    method: "putBackupVaultLockConfiguration",
    filterParams: ({ payload, live, diff }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#deleteBackupVaultLockConfiguration-property
  destroy: {
    method: "deleteBackupVaultLockConfiguration",
    pickId,
  },
});

exports.BackupBackupVaultLockConfiguration = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("BackupVaultName")]),
    findId: () => pipe([get("BackupVaultName")]),
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ BackupVaultName: name }), getById({})]),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#listBackupSelections-property
    getList:
      ({ client, endpoint, getById, config }) =>
      ({ lives }) =>
        pipe([
          lives.getByType({
            type: "BackupVault",
            group: "Backup",
            providerName: config.providerName,
          }),
          filter(get("live.Locked")),
          map(
            pipe([
              get("live"),
              pick(["BackupVaultName", "MinRetentionDays", "MaxRetentionDays"]),
            ])
          ),
        ])(),
    configDefault: ({
      name,
      namespace,
      properties: { ...otherProps },
      dependencies: { backupVault },
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
