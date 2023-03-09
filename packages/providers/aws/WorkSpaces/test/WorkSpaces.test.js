const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Workspaces", async function () {
  it.skip("Directory", () =>
    pipe([
      () => ({
        groupType: "Workspaces::Directory",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Workspace", () =>
    pipe([
      () => ({
        groupType: "Workspaces::Workspace",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
