const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("WorkSpaces", async function () {
  it("Directory", () =>
    pipe([
      () => ({
        groupType: "WorkSpaces::Directory",
        livesNotFound: ({ config }) => [{ DirectoryId: "d-1234567890" }],
      }),
      awsResourceTest,
    ])());
  it("IpGroup", () =>
    pipe([
      () => ({
        groupType: "WorkSpaces::IpGroup",
        livesNotFound: ({ config }) => [{ GroupId: "wsipg-4lg9qdh9y" }],
      }),
      awsResourceTest,
    ])());
  it("Workspace", () =>
    pipe([
      () => ({
        groupType: "WorkSpaces::Workspace",
        livesNotFound: ({ config }) => [{ WorkspaceId: "ws-xgydcfbqc" }],
      }),
      awsResourceTest,
    ])());
});
