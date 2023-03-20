const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SSM", async function () {
  it("Activation", () =>
    pipe([
      () => ({
        groupType: "SSM::Activation",
        livesNotFound: ({ config }) => [
          { ActivationId: "e2b38703-da2d-4faa-b567-d62d04a19b5a" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Association", () =>
    pipe([
      () => ({
        groupType: "SSM::Association",
        livesNotFound: ({ config }) => [
          {
            AssociationId: "e2b38703-da2d-4faa-b567-d62d04a19b5a",
          },
        ],
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
  it("PatchBaseline", () =>
    pipe([
      () => ({
        groupType: "SSM::PatchBaseline",
        livesNotFound: ({ config }) => [
          {
            BaselineId: "pb-03ec98bc512aa3ac5",
            OperatingSystem: "AMAZON_LINUX_2",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ResourceDataSync", () =>
    pipe([
      () => ({
        groupType: "SSM::ResourceDataSync",
        livesNotFound: ({ config }) => [{ SyncName: "n123" }],
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
