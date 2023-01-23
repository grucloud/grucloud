const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

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
const { BackupReportPlan } = require("./BackupReportPlan");

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    BackupBackupPlan({}),
    BackupBackupSelection({}),
    BackupBackupVault({}),
    BackupBackupVaultLockConfiguration({}),
    BackupBackupVaultNotification({}),
    BackupBackupVaultPolicy({}),
    BackupFramework({}),
    BackupGlobalSettings({}),
    BackupRegionSettings({}),
    BackupRegionSettings({}),
    BackupReportPlan({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: "Backup",
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
