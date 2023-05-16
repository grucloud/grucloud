const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Aps", async function () {
  it.skip("AlertManagerDefinition", () =>
    pipe([
      () => ({
        groupType: "Aps::AlertManagerDefinition",
        livesNotFound: ({ config }) => [{ workspaceId: "idonotexist" }],
      }),
      awsResourceTest,
    ])());
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
