const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Backup", async function () {
  it("BackupPlan", () =>
    pipe([
      () => ({
        groupType: "Backup::BackupPlan",
        livesNotFound: ({ config }) => [
          {
            BackupPlanId: "ab849b82-0952-421a-8b49-636a6f2157df",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("BackupSelection", () =>
    pipe([
      () => ({
        groupType: "Backup::BackupSelection",
        livesNotFound: ({ config }) => [
          {
            BackupPlanId: "ab849b82-0952-421a-8b49-636a6f2157df",
            SelectionId: "d3588f99-60dd-4278-bf9f-530acb23bb59",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("BackupVault", () =>
    pipe([
      () => ({
        groupType: "Backup::BackupVault",
        livesNotFound: ({ config }) => [
          {
            BackupVaultName: "v1234",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("BackupVaultLockConfiguration", () =>
    pipe([
      () => ({
        groupType: "Backup::BackupVaultLockConfiguration",
        livesNotFound: ({ config }) => [
          {
            BackupVaultName: "v1234",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("BackupVaultNotification", () =>
    pipe([
      () => ({
        groupType: "Backup::BackupVaultNotification",
        livesNotFound: ({ config }) => [
          {
            BackupVaultName: "v1234",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("BackupVaultPolicy", () =>
    pipe([
      () => ({
        groupType: "Backup::BackupVaultPolicy",
        livesNotFound: ({ config }) => [
          {
            BackupVaultName: "v1234",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Framework", () =>
    pipe([
      () => ({
        groupType: "Backup::Framework",
        livesNotFound: ({ config }) => [
          {
            FrameworkName: "v1234",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("GlobalSettings", () =>
    pipe([
      () => ({
        groupType: "Backup::GlobalSettings",
        livesNotFound: ({ config }) => [{}],
        skipDelete: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("RegionSettings", () =>
    pipe([
      () => ({
        groupType: "Backup::RegionSettings",
        livesNotFound: ({ config }) => [{}],
        skipDelete: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
});
