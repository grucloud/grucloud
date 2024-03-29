const assert = require("assert");
const { pipe, tap, get, eq, map, pick, or } = require("rubico");
const { defaultsDeep, when, identity, callProp } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger, assignTags, managedByEFS } = require("./BackupCommon");

const buildArn = () => get("BackupVaultArn");

const decorate = ({ endpoint, live }) =>
  pipe([defaultsDeep(live), assignTags({ endpoint, buildArn: buildArn() })]);

const pickId = pipe([pick(["BackupVaultName"])]);

const managedByOther = () =>
  or([
    eq(get("BackupVaultName"), "Default"), //
    managedByEFS,
  ]);

exports.BackupBackupVault = ({ spec, config }) => ({
  type: "BackupVault",
  package: "backup",
  client: "Backup",
  inferName: () => get("BackupVaultName"),
  findName: () => pipe([get("BackupVaultName")]),
  findId: () => pipe([get("BackupVaultName")]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  propertiesDefault: {},
  omitProperties: [
    "BackupVaultArn",
    "EncryptionKeyArn",
    "CreationDate",
    "NumberOfRecoveryPoints",
    "Locked",
    "CreatorRequestId",
    "MaxRetentionDays",
    "MinRetentionDays",
  ],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => pipe([get("EncryptionKeyArn")]),
    },
  },
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
    preDestroy: ({ endpoint, getById }) =>
      tap(
        pipe([
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
        ])
      ),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { kmsKey },
    config,
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
