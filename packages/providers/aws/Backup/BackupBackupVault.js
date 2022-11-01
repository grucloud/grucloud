const assert = require("assert");
const { pipe, tap, get, eq, map, pick } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource, assignTags } = require("./BackupCommon");

const buildArn = () => get("BackupVaultArn");

const decorate = ({ endpoint, live }) =>
  pipe([defaultsDeep(live), assignTags({ endpoint, buildArn: buildArn() })]);

const pickId = pipe([pick(["BackupVaultName"])]);

const managedByOther = eq(get("live.BackupVaultName"), "Default");

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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#listBackupVaults-property
  getList: {
    method: "listBackupVaults",
    getParam: "BackupVaultList",
    decorate: ({ getById, endpoint }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#createBackupVault-property
  create: {
    method: "createBackupVault",
    pickCreated: ({ payload }) => pipe([identity]),
    filterPayload: ({ Tags, ...other }) =>
      pipe([() => ({ ...other, BackupVaultTags: Tags })])(),
  },
  update:
    ({ endpoint }) =>
    async ({ pickId, payload, diff, live }) =>
      pipe([
        () => {
          throw Error("No AWS API to update a BackupVault");
        },
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#deleteBackupVault-property
  destroy: {
    method: "deleteBackupVault",
    pickId,
    preDestroy: ({ endpoint, live, getById }) =>
      pipe([
        () => live,
        pick(["BackupVaultName"]),
        endpoint().listRecoveryPointsByBackupVault,
        get("RecoveryPoints"),
        map.pool(
          20,
          pipe([
            pick(["BackupVaultName", "RecoveryPointArn"]),
            endpoint().deleteRecoveryPoint,
          ])
        ),
      ])(),
  },
});

exports.BackupBackupVault = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.BackupVaultName")]),
    findId: pipe([get("live.BackupVaultName")]),
    managedByOther,
    cannotBeDeleted: managedByOther,
    getByName: getByNameCore,
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { kmsKey },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTagsObject({
            name,
            config,
            namespace,
            userTags: Tags,
          }),
        }),
        when(
          () => kmsKey,
          defaultsDeep({ EncryptionKeyArn: getField(kmsKey, "Arn") })
        ),
      ])(),
  });
