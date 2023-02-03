const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("FSx", async function () {
  it("Backup", () =>
    pipe([
      () => ({
        groupType: "FSx::Backup",
        livesNotFound: ({ config }) => [{ BackupId: "backup-12345678" }],
      }),
      awsResourceTest,
    ])());
  it.skip("DataRepositoryAssociation", () =>
    pipe([
      () => ({
        groupType: "FSx::DataRepositoryAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("FileCache", () =>
    pipe([
      () => ({
        groupType: "FSx::FileCache",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());

  it.skip("OpenzfsSnapshot", () =>
    pipe([
      () => ({
        groupType: "FSx::OpenzfsSnapshot",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Volume", () =>
    pipe([
      () => ({
        groupType: "FSx::Volume",
        livesNotFound: ({ config }) => [
          { VolumeId: "fsvol-0337c80125f855f55" },
        ],
      }),
      awsResourceTest,
    ])());
  it("FileSystem", () =>
    pipe([
      () => ({
        groupType: "FSx::FileSystem",
        livesNotFound: ({ config }) => [{ FileSystemId: "fs-012345678901" }],
      }),
      awsResourceTest,
    ])());
});
