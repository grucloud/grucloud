const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Keyspaces", async function () {
  it.skip("Keyspace", () =>
    pipe([
      () => ({
        groupType: "Keyspaces::Keyspace",
        livesNotFound: ({ config }) => [
          {
            // arn: `arn:aws:ivschat:${
            //   config.region
            // }:${config.accountId()}:logging-configuration/y47bQ0MmtKmd`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Table", () =>
    pipe([
      () => ({
        groupType: "Keyspaces::Table",
        livesNotFound: ({ config }) => [
          {
            // arn: `arn:aws:ivschat:${
            //   config.region
            // }:${config.accountId()}:room/32no4tl70Fmr`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
