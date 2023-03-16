const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("QLDB", async function () {
  it("Ledger", () =>
    pipe([
      () => ({
        groupType: "QLDB::Ledger",
        livesNotFound: ({ config }) => [{ Name: "b123" }],
      }),
      awsResourceTest,
    ])());
  it("Stream", () =>
    pipe([
      () => ({
        groupType: "QLDB::Stream",
        livesNotFound: ({ config }) => [
          { LedgerName: "l123", StreamId: "s123456789012345678901" },
        ],
      }),
      awsResourceTest,
    ])());
});
