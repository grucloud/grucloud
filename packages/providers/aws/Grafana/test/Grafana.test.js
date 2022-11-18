const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Grafana", async function () {
  it.skip("LicenseAssociation", () =>
    pipe([
      () => ({
        groupType: "Grafana::LicenseAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("RoleAssociation", () =>
    pipe([
      () => ({
        groupType: "Grafana::RoleAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Workspace", () =>
    pipe([
      () => ({
        groupType: "Grafana::Workspace",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("WorkspaceApiKey  ", () =>
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
