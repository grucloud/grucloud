const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("QuickSight", async function () {
  it("AccountSubscription", () =>
    pipe([
      () => ({
        groupType: "QuickSight::AccountSubscription",
        livesNotFound: ({ config }) => [{ AwsAccountId: config.accountId() }],
      }),
      awsResourceTest,
    ])());
  it("Analysis", () =>
    pipe([
      () => ({
        groupType: "QuickSight::Analysis",
        livesNotFound: ({ config }) => [
          { AnalysisId: "i1234567890", AwsAccountId: config.accountId() },
        ],
      }),
      awsResourceTest,
    ])());
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
  it("IAMPolicyAssignment", () =>
    pipe([
      () => ({
        groupType: "QuickSight::IAMPolicyAssignment",
        livesNotFound: ({ config }) => [
          {
            AssignmentName: "a123",
            Namespace: "default",
            AwsAccountId: config.accountId(),
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Folder", () =>
    pipe([
      () => ({
        groupType: "QuickSight::Folder",
        livesNotFound: ({ config }) => [
          { FolderId: "i13455", AwsAccountId: config.accountId() },
        ],
      }),
      awsResourceTest,
    ])());
  it("FolderMembership", () =>
    pipe([
      () => ({
        groupType: "QuickSight::FolderMembership",
        livesNotFound: ({ config }) => [
          {
            FolderId: "i13455",
            AwsAccountId: config.accountId(),
            MemberId: "m123",
            MemberType: "DASHBOARD",
          },
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
  it("Ingestion", () =>
    pipe([
      () => ({
        groupType: "QuickSight::Ingestion",
        livesNotFound: ({ config }) => [
          {
            IngestionId: "e123",
            DataSetId: "i1234567890",
            AwsAccountId: config.accountId(),
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Template", () =>
    pipe([
      () => ({
        groupType: "QuickSight::Template",
        livesNotFound: ({ config }) => [
          {
            TemplateId: "e123",
            AwsAccountId: config.accountId(),
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("TemplateAlias", () =>
    pipe([
      () => ({
        groupType: "QuickSight::TemplateAlias",
        livesNotFound: ({ config }) => [
          {
            AliasName: "a123",
            TemplateId: "e123",
            AwsAccountId: config.accountId(),
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("RefreshSchedule", () =>
    pipe([
      () => ({
        groupType: "QuickSight::RefreshSchedule",
        livesNotFound: ({ config }) => [
          {
            DataSetId: "i1234567890",
            ScheduleId: "s123456789",
            AwsAccountId: config.accountId(),
          },
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
  it.skip("VpcConnection", () =>
    pipe([
      () => ({
        groupType: "QuickSight::VpcConnection",
        livesNotFound: ({ config }) => [
          { VPCConnectionId: "v-12345", AwsAccountId: config.accountId() },
        ],
      }),
      awsResourceTest,
    ])());
});
