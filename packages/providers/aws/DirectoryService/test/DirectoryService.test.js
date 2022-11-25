const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DirectoryService", async function () {
  it.skip("ConditionalForwarder", () =>
    pipe([
      () => ({
        groupType: "DirectoryService::ConditionalForwarder",
        livesNotFound: ({ config }) => [{}],
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
  it.skip("LogSubscription", () =>
    pipe([
      () => ({
        groupType: "DirectoryService::LogSubscription",
        livesNotFound: ({ config }) => [{ DirectoryId: "d123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Region", () =>
    pipe([
      () => ({
        groupType: "DirectoryService::Region",
        livesNotFound: ({ config }) => [{ DirectoryId: "d123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("SharedDirectory", () =>
    pipe([
      () => ({
        groupType: "DirectoryService::SharedDirectory",
        livesNotFound: ({ config }) => [
          { DirectoryId: "d123", ShareTarget: { Id: "123456789012" } },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("SharedDirectoryAccepter", () =>
    pipe([
      () => ({
        groupType: "DirectoryService::SharedDirectoryAccepter",
        livesNotFound: ({ config }) => [{ DirectoryId: "d123" }],
      }),
      awsResourceTest,
    ])());
});
