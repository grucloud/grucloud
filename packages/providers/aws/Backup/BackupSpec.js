const assert = require("assert");
const { tap, pipe, map, get, assign, not, eq } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const { compareAws, assignPolicyAccountAndRegion } = require("../AwsCommon");

const { BackupBackupPlan } = require("./BackupBackupPlan");
const { BackupBackupSelection } = require("./BackupBackupSelection");
const { BackupBackupVault } = require("./BackupBackupVault");
const {
  BackupBackupVaultLockConfiguration,
} = require("./BackupBackupVaultLockConfiguration");
const {
  BackupBackupVaultNotification,
} = require("./BackupBackupVaultNotification");
const { BackupBackupVaultPolicy } = require("./BackupBackupVaultPolicy");
const { BackupFramework } = require("./BackupFramework");
const { BackupGlobalSettings } = require("./BackupGlobalSettings");
const { BackupRegionSettings } = require("./BackupRegionSettings");

const GROUP = "Backup";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    {
      type: "BackupPlan",
      Client: BackupBackupPlan,
      propertiesDefault: {},
      omitProperties: [
        "BackupPlanArn",
        "BackupPlanId",
        "CreationDate",
        "VersionId",
        "Rules[].RuleId",
      ],
      inferName: get("properties.BackupPlanName"),
      dependencies: {
        backupVaults: {
          type: "BackupVault",
          group: GROUP,
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("Rules"),
              map(
                pipe([
                  get("TargetBackupVaultName"),
                  (name) =>
                    lives.getByName({
                      name,
                      type: "BackupVault",
                      group: GROUP,
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])
              ),
            ]),
        },
      },
    },
    {
      type: "BackupSelection",
      Client: BackupBackupSelection,
      propertiesDefault: {},
      omitProperties: [
        "BackupPlanId",
        "CreationDate",
        "CreatorRequestId",
        "SelectionId",
        "IamRoleArn",
      ],
      inferName: get("properties.SelectionName"),
      dependencies: {
        backupPlan: {
          type: "BackupPlan",
          group: GROUP,
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
    },
    {
      type: "BackupVault",
      Client: BackupBackupVault,
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
      inferName: get("properties.BackupVaultName"),
      dependencies: {
        kmsKey: {
          type: "Key",
          group: "KMS",
          dependencyId: ({ lives, config }) => pipe([get("EncryptionKeyArn")]),
        },
      },
    },
    {
      type: "BackupVaultLockConfiguration",
      Client: BackupBackupVaultLockConfiguration,
      propertiesDefault: {},
      omitProperties: ["BackupVaultName"],
      inferName: get("dependenciesSpec.backupVault"),
      dependencies: {
        backupVault: {
          type: "BackupVault",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => pipe([get("BackupVaultName")]),
        },
      },
    },
    {
      type: "BackupVaultNotification",
      Client: BackupBackupVaultNotification,
      omitProperties: ["BackupVaultName", "BackupVaultArn", "SNSTopicArn"],
      inferName: get("dependenciesSpec.backupVault"),
      dependencies: {
        backupVault: {
          type: "BackupVault",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => pipe([get("BackupVaultName")]),
        },
        snsTopic: {
          type: "Topic",
          group: "SNS",
          dependencyId: ({ lives, config }) => pipe([get("SNSTopicArn")]),
        },
      },
    },
    {
      type: "BackupVaultPolicy",
      Client: BackupBackupVaultPolicy,
      omitProperties: ["BackupVaultName", "BackupVaultArn"],
      inferName: get("dependenciesSpec.backupVault"),
      dependencies: {
        backupVault: {
          type: "BackupVault",
          group: GROUP,
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
    },
    {
      type: "Framework",
      Client: BackupFramework,
      propertiesDefault: {},
      omitProperties: [
        "FrameworkStatus",
        "FrameworkArn",
        "DeploymentStatus",
        "NumberOfControls",
        "CreationTime",
      ],
      inferName: get("properties.FrameworkName"),
    },
    {
      type: "GlobalSettings",
      Client: BackupGlobalSettings,
      propertiesDefault: {},
      omitProperties: ["LastUpdateTime"],
      inferName: () => "global",
      ignoreResource: () =>
        pipe([get("live"), eq(get("isCrossAccountBackupEnabled"), "false")]),
    },
    {
      type: "RegionSettings",
      Client: BackupRegionSettings,
      propertiesDefault: {},
      omitProperties: [],
      inferName: () => "region",
      ignoreResource: () => true,
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
