const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("QuickSight", async function () {
  it("Dashboard", () =>
    pipe([
      () => ({
        groupType: "QuickSight::Dashboard",
        livesNotFound: ({ config }) => [
          { DashboardId: "i13455", AwsAccountId: config.accountId() },
        ],
      }),
      awsResourceTest,
    ])());
  it("DataSet", () =>
    pipe([
      () => ({
        groupType: "QuickSight::DataSet",
        livesNotFound: ({ config }) => [
          { DataSetId: "i13455", AwsAccountId: config.accountId() },
        ],
      }),
      awsResourceTest,
    ])());
  it("DataSource", () =>
    pipe([
      () => ({
        groupType: "QuickSight::DataSource",
        livesNotFound: ({ config }) => [
          { DataSourceId: "i13455", AwsAccountId: config.accountId() },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Folder", () =>
    pipe([
      () => ({
        groupType: "QuickSight::Folder",
        livesNotFound: ({ config }) => [
          { FolderId: "i13455", AwsAccountId: config.accountId() },
        ],
      }),
      awsResourceTest,
    ])());
  it("Group", () =>
    pipe([
      () => ({
        groupType: "QuickSight::Group",
        livesNotFound: ({ config }) => [
          {
            GroupName: "e123",
            AwsAccountId: config.accountId(),
            Namespace: "default",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("GroupMembership", () =>
    pipe([
      () => ({
        groupType: "QuickSight::GroupMembership",
        livesNotFound: ({ config }) => [
          {
            GroupName: "e123",
            MemberName: "e123",
            AwsAccountId: config.accountId(),
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Ingestion", () =>
    pipe([
      () => ({
        groupType: "QuickSight::Ingestion",
        livesNotFound: ({ config }) => [
          { IngestionId: "e123", AwsAccountId: config.accountId() },
        ],
      }),
      awsResourceTest,
    ])());
  it("Template", () =>
    pipe([
      () => ({
        groupType: "QuickSight::Template",
        livesNotFound: ({ config }) => [
          { TemplateId: "e123", AwsAccountId: config.accountId() },
        ],
      }),
      awsResourceTest,
    ])());
  it("Theme", () =>
    pipe([
      () => ({
        groupType: "QuickSight::Theme",
        livesNotFound: ({ config }) => [
          { ThemeId: "e123", AwsAccountId: config.accountId() },
        ],
      }),
      awsResourceTest,
    ])());
  it("User", () =>
    pipe([
      () => ({
        groupType: "QuickSight::User",
        livesNotFound: ({ config }) => [
          { UserName: "e123", AwsAccountId: config.accountId() },
        ],
      }),
      awsResourceTest,
    ])());
});
