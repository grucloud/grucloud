const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Shield", async function () {
  it.skip("Protection", () =>
    pipe([
      () => ({
        groupType: "Shield::Protection",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ProtectionGroup", () =>
    pipe([
      () => ({
        groupType: "Shield::ProtectionGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ProtectionHealthCheckAssociation", () =>
    pipe([
      () => ({
        groupType: "ProtectionHealthCheckAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("WorkspaceApiKey  ", () =>
    pipe([
      () => ({
        groupType: "Shield::WorkspaceApiKey",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("WorkspaceSamlConfiguration", () =>
    pipe([
      () => ({
        groupType: "Shield::WorkspaceSamlConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
