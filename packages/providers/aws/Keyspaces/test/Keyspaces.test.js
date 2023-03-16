const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Keyspaces", async function () {
  it("Keyspace", () =>
    pipe([
      () => ({
        groupType: "Keyspaces::Keyspace",
        livesNotFound: ({ config }) => [
          {
            keyspaceName: "k123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Table", () =>
    pipe([
      () => ({
        groupType: "Keyspaces::Table",
        livesNotFound: ({ config }) => [
          {
            keyspaceName: "k123",
            tableName: "t123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
