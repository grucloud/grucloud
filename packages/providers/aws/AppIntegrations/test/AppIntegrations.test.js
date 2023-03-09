const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AppIntegrations", async function () {
  it("EventIntegration", () =>
    pipe([
      () => ({
        groupType: "AppIntegrations::EventIntegration",
        livesNotFound: ({ config }) => [{ Name: "a123" }],
      }),
      awsResourceTest,
    ])());
});
