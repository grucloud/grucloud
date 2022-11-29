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
  it.skip("EndpointAccess", () =>
    pipe([
      () => ({
        groupType: "Redshift::EndpointAccess",
        livesNotFound: ({ config }) => [{ ClusterSubnetGroupName: "1234" }],
      }),
      awsResourceTest,
    ])());
  it.skip("EndpointAuthorization", () =>
    pipe([
      () => ({
        groupType: "Redshift::EndpointAuthorization",
        livesNotFound: ({ config }) => [{ ClusterSubnetGroupName: "1234" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Partner", () =>
    pipe([
      () => ({
        groupType: "Redshift::Partner",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
