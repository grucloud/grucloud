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
  it.skip("Partner", () =>
    pipe([
      () => ({
        groupType: "Redshift::Partner",
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
