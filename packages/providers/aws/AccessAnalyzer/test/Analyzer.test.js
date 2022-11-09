const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AccessAnalyzer", async function () {
  it("Analyzer", () =>
    pipe([
      () => ({
        groupType: "AccessAnalyzer::Analyzer",
        livesNotFound: ({ config }) => [{ analyzerName: "idonotexist" }],
      }),
      awsResourceTest,
    ])());
  it("ArchiveRule", () =>
    pipe([
      () => ({
        groupType: "AccessAnalyzer::ArchiveRule",
        livesNotFound: ({ config }) => [
          { analyzerName: "idonotexist", ruleName: "idonotexist" },
        ],
      }),
      awsResourceTest,
    ])());
});
