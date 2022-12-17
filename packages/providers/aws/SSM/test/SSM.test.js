const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SSM", async function () {
  it.skip("Activation", () =>
    pipe([
      () => ({
        groupType: "SSM::Activation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
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
  it("MaintenanceWindow", () =>
    pipe([
      () => ({
        groupType: "SSM::MaintenanceWindow",
        livesNotFound: ({ config }) => [
          { WindowId: "mw-03eb0c6d842368e7b", Name: "12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("MaintenanceWindowTarget", () =>
    pipe([
      () => ({
        groupType: "SSM::MaintenanceWindowTarget",
        livesNotFound: ({ config }) => [
          {
            WindowId: "mw-03eb0c6d842368e7b",
            WindowTargetId: "37d52ba2-c758-4d0d-9ce8-57fb6258a312",
          },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("MaintenanceWindowTask", () =>
    pipe([
      () => ({
        groupType: "SSM::MaintenanceWindowTask",
        livesNotFound: ({ config }) => [
          {
            WindowId: "mw-03eb0c6d842368e7b",
            WindowTaskId: "37d52ba2-c758-4d0d-9ce8-57fb6258a312",
          },
        ],
        skipGetByName: true,
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
  it("ServiceSetting", () =>
    pipe([
      () => ({
        groupType: "SSM::ServiceSetting",
        livesNotFound: ({ config }) => [{ SettingId: "/s123" }],
      }),
      awsResourceTest,
    ])());
});
