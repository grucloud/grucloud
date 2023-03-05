const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("RDS", async function () {
  it("DBCluster", () =>
    pipe([
      () => ({
        groupType: "RDS::DBCluster",
        livesNotFound: ({ config }) => [
          { DBClusterIdentifier: "cluster-12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBClusterEndpoint", () =>
    pipe([
      () => ({
        groupType: "RDS::DBClusterEndpoint",
        livesNotFound: ({ config }) => [
          {
            DBClusterIdentifier: "cluster-12345",
            DBClusterEndpointIdentifier: "ce123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBClusterParameterGroup", () =>
    pipe([
      () => ({
        groupType: "RDS::DBClusterParameterGroup",
        livesNotFound: ({ config }) => [
          {
            DBClusterParameterGroupName: "p123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBClusterSnapshot", () =>
    pipe([
      () => ({
        groupType: "RDS::DBClusterSnapshot",
        livesNotFound: ({ config }) => [
          {
            DBClusterSnapshotIdentifier: "p123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBInstance", () =>
    pipe([
      () => ({
        groupType: "RDS::DBInstance",
        livesNotFound: ({ config }) => [
          { DBInstanceIdentifier: "instance-12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBEngineVersion", () =>
    pipe([
      () => ({
        groupType: "RDS::DBEngineVersion",
        livesNotFound: ({ config }) => [{ Engine: "1", EngineVersion: "1" }],
      }),
      awsResourceTest,
    ])());
  it("DBProxy", () =>
    pipe([
      () => ({
        groupType: "RDS::DBProxy",
        livesNotFound: ({ config }) => [{ DBProxyName: "dbProxy-12345" }],
      }),
      awsResourceTest,
    ])());
  it("DBProxyTargetGroup", () =>
    pipe([
      () => ({
        groupType: "RDS::DBProxyTargetGroup",
        livesNotFound: ({ config }) => [
          { DBProxyName: "proxyName-12345", TargetGroupName: "target" },
        ],
        nameNotFound: "myproxy::myTarget",
      }),
      awsResourceTest,
    ])());
  it("DBSnapshot", () =>
    pipe([
      () => ({
        groupType: "RDS::DBSnapshot",
        livesNotFound: ({ config }) => [
          { DBSnapshotIdentifier: "instance-12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBSubnetGroup", () =>
    pipe([
      () => ({
        groupType: "RDS::DBSubnetGroup",
        livesNotFound: ({ config }) => [{ DBSubnetGroupName: "a12344" }],
      }),
      awsResourceTest,
    ])());
  it("EventSubscription", () =>
    pipe([
      () => ({
        groupType: "RDS::EventSubscription",
        livesNotFound: ({ config }) => [{ SubscriptionName: "s123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("ExportTask", () =>
    pipe([
      () => ({
        groupType: "RDS::ExportTask",
        livesNotFound: ({ config }) => [{ SubscriptionName: "s123" }],
      }),
      awsResourceTest,
    ])());
  it("GlobalCluster", () =>
    pipe([
      () => ({
        groupType: "RDS::GlobalCluster",
        livesNotFound: ({ config }) => [
          { GlobalClusterIdentifier: "dbProxy-12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("OptionGroup", () =>
    pipe([
      () => ({
        groupType: "RDS::OptionGroup",
        livesNotFound: ({ config }) => [{ OptionGroupName: "o-12345" }],
      }),
      awsResourceTest,
    ])());
});
