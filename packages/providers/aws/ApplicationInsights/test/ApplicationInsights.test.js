const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ApplicationInsights", async function () {
  it("Application", () =>
    pipe([
      () => ({
        groupType: "ApplicationInsights::Application",
        livesNotFound: ({ config }) => [{ ResourceGroupName: "123" }],
      }),
      awsResourceTest,
    ])());
});
