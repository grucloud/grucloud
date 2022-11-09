const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Neptune", async function () {
  it.skip("Cluster", () =>
    pipe([
      () => ({
        groupType: "Neptune::Cluster",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ClusterEndpoint", () =>
    pipe([
      () => ({
        groupType: "Neptune::ClusterEndpoint",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ClusterEndpoint", () =>
    pipe([
      () => ({
        groupType: "Neptune::ClusterEndpoint",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ClusterInstance", () =>
    pipe([
      () => ({
        groupType: "Neptune::ClusterInstance",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ClusterParameterGroup", () =>
    pipe([
      () => ({
        groupType: "Neptune::ClusterParameterGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ClusterSnapshot", () =>
    pipe([
      () => ({
        groupType: "Neptune::ClusterSnapshot",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ClusterEventSubscription", () =>
    pipe([
      () => ({
        groupType: "Neptune::ClusterEventSubscription",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ParameterGroup", () =>
    pipe([
      () => ({
        groupType: "Neptune::ParameterGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("SubnetGroup", () =>
    pipe([
      () => ({
        groupType: "Neptune::SubnetGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
