const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("RedshiftData", async function () {
  it.skip("Statement", () =>
    pipe([
      () => ({
        groupType: "RedshiftData::Statement",
        livesNotFound: ({ config }) => [{ ClusterIdentifier: "c123" }],
      }),
      awsResourceTest,
    ])());
});
