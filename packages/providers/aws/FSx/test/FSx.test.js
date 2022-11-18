const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("FSx", async function () {
  it.skip("Backup", () =>
    pipe([
      () => ({
        groupType: "FSx::Backup",
        livesNotFound: ({ config }) => [{}],
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
  it.skip("LustreFileSystem", () =>
    pipe([
      () => ({
        groupType: "FSx::LustreFileSystem",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("OpenzfsFileSystem", () =>
    pipe([
      () => ({
        groupType: "FSx::OpenzfsFileSystem",
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
  it.skip("OpenzfsVolume", () =>
    pipe([
      () => ({
        groupType: "FSx::OpenzfsVolume",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("WindowsFileSystem", () =>
    pipe([
      () => ({
        groupType: "FSx::WindowsFileSystem",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
