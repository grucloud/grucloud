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
});
