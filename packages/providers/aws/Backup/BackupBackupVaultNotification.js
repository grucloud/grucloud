const { getField } = require("@grucloud/core/ProviderCommon");
const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const pickId = pick(["BackupVaultName"]);

const model = ({ config }) => ({
  package: "backup",
  client: "Backup",
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
});

exports.BackupBackupVaultNotification = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("BackupVaultName")]),
    findId: () => pipe([get("BackupVaultName")]),
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ BackupVaultName: name }), getById({})]),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#getBackupVaultNotifications-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "BackupVault", group: "Backup" },
            pickKey: pipe([pickId]),
            method: "getBackupVaultNotification",
            config,
          }),
      ])(),
    configDefault: ({
      name,
      namespace,
      properties: { ...otherProps },
      dependencies: { backupVault, snsTopic },
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
