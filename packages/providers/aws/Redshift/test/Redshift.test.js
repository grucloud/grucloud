const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Redshift", async function () {
  it("Cluster", () =>
    pipe([
      () => ({
        groupType: "Redshift::Cluster",
        livesNotFound: ({ config }) => [{ ClusterIdentifier: "c123" }],
      }),
      awsResourceTest,
    ])());
  it("ClusterParameterGroup", () =>
    pipe([
      () => ({
        groupType: "Redshift::ClusterParameterGroup",
        livesNotFound: ({ config }) => [{ ParameterGroupName: "p12345" }],
      }),
      awsResourceTest,
    ])());
  it("ClusterSubnetGroup", () =>
    pipe([
      () => ({
        groupType: "Redshift::ClusterSubnetGroup",
        livesNotFound: ({ config }) => [{ ClusterSubnetGroupName: "1234" }],
      }),
      awsResourceTest,
    ])());
  it("EndpointAccess", () =>
    pipe([
      () => ({
        groupType: "Redshift::EndpointAccess",
        livesNotFound: ({ config }) => [{ EndpointName: "e1234" }],
      }),
      awsResourceTest,
    ])());
  it("EndpointAuthorization", () =>
    pipe([
      () => ({
        groupType: "Redshift::EndpointAuthorization",
        livesNotFound: ({ config }) => [
          { ClusterIdentifier: "1234", Account: "000542909724" },
        ],
      }),
      awsResourceTest,
    ])());
  it("EventSubscription", () =>
    pipe([
      () => ({
        groupType: "Redshift::EventSubscription",
        livesNotFound: ({ config }) => [{ SubscriptionName: "s123" }],
      }),
      awsResourceTest,
    ])());
  it("Partner", () =>
    pipe([
      () => ({
        groupType: "Redshift::Partner",
        livesNotFound: ({ config }) => [
          {
            AccountId: config.accountId(),
            ClusterIdentifier: "1234",
            DatabaseName: "d123",
            PartnerName: "p123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ScheduledAction", () =>
    pipe([
      () => ({
        groupType: "Redshift::ScheduledAction",
        livesNotFound: ({ config }) => [{ ScheduledActionName: "s123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("SnapshotSchedule", () =>
    pipe([
      () => ({
        groupType: "Redshift::SnapshotSchedule",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("SnapshotScheduleAssociation", () =>
    pipe([
      () => ({
        groupType: "Redshift::SnapshotScheduleAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("UsageLimit", () =>
    pipe([
      () => ({
        groupType: "Redshift::UsageLimit",
        livesNotFound: ({ config }) => [{ UsageLimitId: "u123" }],
      }),
      awsResourceTest,
    ])());
});
