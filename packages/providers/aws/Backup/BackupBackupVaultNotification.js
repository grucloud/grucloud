const { getField } = require("@grucloud/core/ProviderCommon");
const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const pickId = pick(["BackupVaultName"]);

exports.BackupBackupVaultNotification = ({}) => ({
  type: "BackupVaultNotification",
  package: "backup",
  client: "Backup",
  inferName: ({ dependenciesSpec: { backupVault } }) =>
    pipe([() => backupVault]),
  findName: () => pipe([get("BackupVaultName")]),
  findId: () => pipe([get("BackupVaultName")]),
  omitProperties: ["BackupVaultName", "BackupVaultArn", "SNSTopicArn"],
  dependencies: {
    backupVault: {
      type: "BackupVault",
      group: "Backup",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("BackupVaultName")]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => pipe([get("SNSTopicArn")]),
    },
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ BackupVaultName: name }), getById({})]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#getBackupVaultNotifications-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "BackupVault", group: "Backup" },
          pickKey: pipe([pickId]),
          method: "getBackupVaultNotifications",
          config,
        }),
    ])(),
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#getBackupVaultNotifications-property
  getById: {
    method: "getBackupVaultNotifications",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#putBackupVaultNotifications-property
  create: {
    method: "putBackupVaultNotifications",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  update: {
    method: "putBackupVaultNotifications",
    filterParams: ({ payload, live, diff }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#deleteBackupVaultNotifications-property
  destroy: {
    method: "deleteBackupVaultNotifications",
    pickId,
  },
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { backupVault, snsTopic },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(backupVault);
        assert(snsTopic);
      }),
      () => otherProps,
      defaultsDeep({
        BackupVaultName: backupVault.config.BackupVaultName,
        SNSTopicArn: getField(snsTopic, "Attributes.TopicArn"),
      }),
    ])(),
});
