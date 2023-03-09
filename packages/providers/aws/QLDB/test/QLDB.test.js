const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("QLDB", async function () {
  it.skip("Ledger", () =>
    pipe([
      () => ({
        groupType: "QLDB::Ledger",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Stream", () =>
    pipe([
      () => ({
        groupType: "QLDB::Stream",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
