const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Grafana", async function () {
  it.skip("RoleAssociation", () =>
    pipe([
      () => ({
        groupType: "Grafana::RoleAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Workspace", () =>
    pipe([
      () => ({
        groupType: "Grafana::Workspace",
        livesNotFound: ({ config }) => [{ workspaceId: "g-1234567890" }],
      }),
      awsResourceTest,
    ])());
  it.skip("WorkspaceApiKey", () =>
    pipe([
      () => ({
        groupType: "Grafana::WorkspaceApiKey",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("WorkspaceSamlConfiguration", () =>
    pipe([
      () => ({
        groupType: "Grafana::WorkspaceSamlConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
