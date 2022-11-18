const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SSM", async function () {
  it.skip("DefaultPatchBaseline", () =>
    pipe([
      () => ({
        groupType: "SSM::DefaultPatchBaseline",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Document", () =>
    pipe([
      () => ({
        groupType: "SSM::Document",
        livesNotFound: ({ config }) => [{ Name: "12345" }],
      }),
      awsResourceTest,
    ])());
  it.skip("MaintenanceWindowTask", () =>
    pipe([
      () => ({
        groupType: "SSM::MaintenanceWindowTask",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Parameter", () =>
    pipe([
      () => ({
        groupType: "SSM::Parameter",
        livesNotFound: ({ config }) => [{ Name: "12345" }],
      }),
      awsResourceTest,
    ])());
});
