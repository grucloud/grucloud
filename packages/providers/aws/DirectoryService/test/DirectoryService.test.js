const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DirectoryService", async function () {
  it("ConditionalForwarder", () =>
    pipe([
      () => ({
        groupType: "DirectoryService::ConditionalForwarder",
        livesNotFound: ({ config }) => [
          { DirectoryId: "d-1234567890", RemoteDomainName: "corp.pippo.com" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Directory", () =>
    pipe([
      () => ({
        groupType: "DirectoryService::Directory",
        livesNotFound: ({ config }) => [{ DirectoryId: "d-1234567890" }],
      }),
      awsResourceTest,
    ])());
  it("Region", () =>
    pipe([
      () => ({
        groupType: "DirectoryService::Region",
        livesNotFound: ({ config }) => [{ DirectoryId: "d-1234567890" }],
      }),
      awsResourceTest,
    ])());
  it("SharedDirectory", () =>
    pipe([
      () => ({
        groupType: "DirectoryService::SharedDirectory",
        livesNotFound: ({ config }) => [
          {
            OwnerDirectoryId: "d-1234567890",
            SharedAccountId: "123456789012",
            SharedDirectoryId: "d-1234567891",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("SharedDirectoryAccepter", () =>
    pipe([
      () => ({
        groupType: "DirectoryService::SharedDirectoryAccepter",
        livesNotFound: ({ config }) => [{ DirectoryId: "d-1234567890" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Trust", () =>
    pipe([
      () => ({
        groupType: "DirectoryService::Trust",
        livesNotFound: ({ config }) => [{ DirectoryId: "d-1234567890" }],
      }),
      awsResourceTest,
    ])());
});
