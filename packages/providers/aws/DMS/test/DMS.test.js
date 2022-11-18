const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DMS", async function () {
  it.skip("Certificate", () =>
    pipe([
      () => ({
        groupType: "DMS::Certificate",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Endpoint", () =>
    pipe([
      () => ({
        groupType: "DMS::Endpoint",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("EventSubscription", () =>
    pipe([
      () => ({
        groupType: "DMS::EventSubscription",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ReplicationInstance ", () =>
    pipe([
      () => ({
        groupType: "DMS::ReplicationInstance ",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ReplicationSubnetGroup", () =>
    pipe([
      () => ({
        groupType: "DMS::ReplicationSubnetGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ReplicationTask", () =>
    pipe([
      () => ({
        groupType: "DMS::ReplicationTask",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
