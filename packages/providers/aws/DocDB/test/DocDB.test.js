const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DocDB", async function () {
  it("DBCluster", () =>
    pipe([
      () => ({
        groupType: "DocDB::DBCluster",
        livesNotFound: ({ config }) => [
          {
            DBClusterIdentifier: "c123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBClusterParameterGroup", () =>
    pipe([
      () => ({
        groupType: "DocDB::DBClusterParameterGroup",
        livesNotFound: ({ config }) => [
          {
            DBClusterParameterGroupName: "i123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBClusterSnapshot", () =>
    pipe([
      () => ({
        groupType: "DocDB::DBClusterSnapshot",
        livesNotFound: ({ config }) => [
          {
            DBClusterSnapshotIdentifier: "i123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBInstance", () =>
    pipe([
      () => ({
        groupType: "DocDB::DBInstance",
        livesNotFound: ({ config }) => [
          {
            DBInstanceIdentifier: "i123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBSubnetGroup", () =>
    pipe([
      () => ({
        groupType: "DocDB::DBSubnetGroup",
        livesNotFound: ({ config }) => [
          {
            DBSubnetGroupName: "i123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("EventSubscription", () =>
    pipe([
      () => ({
        groupType: "DocDB::EventSubscription",
        livesNotFound: ({ config }) => [
          {
            SubscriptionName: "i123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("GlobalCluster", () =>
    pipe([
      () => ({
        groupType: "DocDB::GlobalCluster",
        livesNotFound: ({ config }) => [
          {
            GlobalClusterIdentifier: "i123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
