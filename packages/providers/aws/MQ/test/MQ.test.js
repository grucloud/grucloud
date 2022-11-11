const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("MQ", async function () {
  it("Broker", () =>
    pipe([
      () => ({
        groupType: "MQ::Broker",
        livesNotFound: ({ config }) => [
          {
            BrokerId: "b-123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Configuration", () =>
    pipe([
      () => ({
        groupType: "MQ::Configuration",
        livesNotFound: ({ config }) => [
          {
            Id: "b1234",
            LatestRevision: "1",
          },
        ],
        skipDelete: true, // NO AWS API to delete a configuration
      }),
      awsResourceTest,
    ])());
  // TODO
  it.skip("User", () =>
    pipe([
      () => ({
        groupType: "MQ::User",
        livesNotFound: ({ config }) => [
          {
            BrokerId: "b-123",
            Username: "u123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
