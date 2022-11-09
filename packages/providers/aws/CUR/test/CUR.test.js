const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CUR", async function () {
  it("ReportDefinition", () =>
    pipe([
      () => ({
        groupType: "CUR::ReportDefinition",
        livesNotFound: ({ config }) => [{ ReportName: "b123" }],
      }),
      awsResourceTest,
    ])());
});
