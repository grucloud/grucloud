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
  it("DataRepositoryAssociation", () =>
    pipe([
      () => ({
        groupType: "FSx::DataRepositoryAssociation",
        livesNotFound: ({ config }) => [{ AssociationId: "dra-1234567890" }],
      }),
      awsResourceTest,
    ])());
  it("FileCache", () =>
    pipe([
      () => ({
        groupType: "FSx::FileCache",
        livesNotFound: ({ config }) => [{ FileCacheId: "fc-12345678" }],
      }),
      awsResourceTest,
    ])());

  it("Snapshot", () =>
    pipe([
      () => ({
        groupType: "FSx::Snapshot",
        livesNotFound: ({ config }) => [{ SnapshotId: "volsnap-12345678" }],
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
