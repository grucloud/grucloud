const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AppIntegrations", async function () {
  it.skip("EventIntegration", () =>
    pipe([
      () => ({
        groupType: "AppIntegrations::EventIntegration",
        livesNotFound: ({ config }) => [{ flowName: "123" }],
      }),
      awsResourceTest,
    ])());
});
