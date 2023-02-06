const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Aps", async function () {
  it("RuleGroupsNamespace", () =>
    pipe([
      () => ({
        groupType: "Aps::RuleGroupsNamespace",
        livesNotFound: ({ config }) => [
          { name: "123", workspaceId: "idonotexist" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Workspace", () =>
    pipe([
      () => ({
        groupType: "Aps::Workspace",
        livesNotFound: ({ config }) => [{ workspaceId: "idonotexist" }],
      }),
      awsResourceTest,
    ])());
});
