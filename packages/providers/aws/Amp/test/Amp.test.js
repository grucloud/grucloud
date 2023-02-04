const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Amp", async function () {
  it.skip("Workspace", () =>
    pipe([
      () => ({
        groupType: "Amp::Workspace",
        livesNotFound: ({ config }) => [{ workspaceId: "idonotexist" }],
      }),
      awsResourceTest,
    ])());
});
