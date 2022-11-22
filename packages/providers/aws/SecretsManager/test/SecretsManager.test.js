const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SecretsManager", async function () {
  it("ResourcePolicy", () =>
    pipe([
      () => ({
        groupType: "SecretsManager::ResourcePolicy",
        livesNotFound: ({ config }) => [{ Name: "s123" }],
      }),
      awsResourceTest,
    ])());
  it("Secret", () =>
    pipe([
      () => ({
        groupType: "SecretsManager::Secret",
        livesNotFound: ({ config }) => [{ Name: "s123" }],
      }),
      awsResourceTest,
    ])());
  it("SecretRotation", () =>
    pipe([
      () => ({
        groupType: "SecretsManager::SecretRotation",
        livesNotFound: ({ config }) => [{ Name: "my-secret" }],
      }),
      awsResourceTest,
    ])());
});
