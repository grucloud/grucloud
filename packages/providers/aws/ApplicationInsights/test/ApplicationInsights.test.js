const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ApplicationInsights", async function () {
  it.skip("Application", () =>
    pipe([
      () => ({
        groupType: "ApplicationInsights::Application",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
