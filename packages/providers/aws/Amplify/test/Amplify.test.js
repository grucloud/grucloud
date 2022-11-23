const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Amplify", async function () {
  it("App", () =>
    pipe([
      () => ({
        groupType: "Amplify::App",
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
  it("Branch", () =>
    pipe([
      () => ({
        groupType: "Amplify::Branch",
        livesNotFound: ({ config }) => [{ appId: "d123", branchName: "e123" }],
      }),
      awsResourceTest,
    ])());
  it("DomainAssociation", () =>
    pipe([
      () => ({
        groupType: "Amplify::DomainAssociation",
        livesNotFound: ({ config }) => [
          { appId: "d123", domainName: "pets.com" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Webhook", () =>
    pipe([
      () => ({
        groupType: "Amplify::Webhook",
        livesNotFound: ({ config }) => [{ webhookId: "11111111111111111111" }],
      }),
      awsResourceTest,
    ])());
});
