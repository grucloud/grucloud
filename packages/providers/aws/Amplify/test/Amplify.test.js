const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Amplify", async function () {
  it("Application", () =>
    pipe([
      () => ({
        groupType: "Amplify::Application",
        livesNotFound: ({ config }) => [{ appId: "d123" }],
      }),
      awsResourceTest,
    ])());
  it("BackendEnvironment", () =>
    pipe([
      () => ({
        groupType: "Amplify::BackendEnvironment",
        livesNotFound: ({ config }) => [
          { appId: "d123", environmentName: "e123" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Branch", () =>
    pipe([
      () => ({
        groupType: "Amplify::Branch",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("DomainAssociation", () =>
    pipe([
      () => ({
        groupType: "Amplify::DomainAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Webhook", () =>
    pipe([
      () => ({
        groupType: "Amplify::Webhook",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
