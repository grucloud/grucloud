const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("EFS", async function () {
  it("FileSystem", () =>
    pipe([
      () => ({
        groupType: "EFS::FileSystem",
        livesNotFound: ({ config }) => [
          {
            FileSystemId: `arn:aws:elasticfilesystem:us-east-1:${config.accountId()}:file-system/fs-0aaaf7b0715648e5a`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("AccessPoint", () =>
    pipe([
      () => ({
        groupType: "EFS::AccessPoint",
        livesNotFound: ({ config }) => [
          {
            AccessPointId: `arn:aws:elasticfilesystem:us-east-1:${config.accountId()}:access-point/fsap-0b3ae155f60ccbb8a`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("MountTarget", () =>
    pipe([
      () => ({
        groupType: "EFS::MountTarget",
        livesNotFound: ({ config }) => [
          {
            MountTargetId: "fsmt-0fda94134613a4f1b",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
