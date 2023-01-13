const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("TimestreamWrite", async function () {
  it("Database", () =>
    pipe([
      () => ({
        groupType: "TimestreamWrite::Database",
        livesNotFound: ({ config }) => [{ DatabaseName: "d123" }],
      }),
      awsResourceTest,
    ])());
  it("Table", () =>
    pipe([
      () => ({
        groupType: "TimestreamWrite::Table",
        livesNotFound: ({ config }) => [
          { DatabaseName: "d123", TableName: "t123" },
        ],
      }),
      awsResourceTest,
    ])());
});
