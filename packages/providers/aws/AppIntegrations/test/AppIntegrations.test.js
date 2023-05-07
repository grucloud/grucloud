const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AppIntegrations", async function () {
  it("DataIntegration", () =>
    pipe([
      () => ({
        groupType: "AppIntegrations::DataIntegration",
        livesNotFound: ({ config }) => [{ Id: "a123" }],
      }),
      awsResourceTest,
    ])());
  it("EventIntegration", () =>
    pipe([
      () => ({
        groupType: "AppIntegrations::EventIntegration",
        livesNotFound: ({ config }) => [{ Name: "a123" }],
      }),
      awsResourceTest,
    ])());
});
