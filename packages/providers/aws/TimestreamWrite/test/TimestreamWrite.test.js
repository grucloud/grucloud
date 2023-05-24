const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["TimestreamWrite"] });

describe("TimestreamWrite", async function () {
  it("Database", () =>
    pipe([
      () => ({
        config,
        groupType: "TimestreamWrite::Database",
        livesNotFound: ({ config }) => [{ DatabaseName: "d123" }],
      }),
      awsResourceTest,
    ])());
  it("Table", () =>
    pipe([
      () => ({
        config,
        groupType: "TimestreamWrite::Table",
        livesNotFound: ({ config }) => [
          { DatabaseName: "d123", TableName: "t123" },
        ],
      }),
      awsResourceTest,
    ])());
});
