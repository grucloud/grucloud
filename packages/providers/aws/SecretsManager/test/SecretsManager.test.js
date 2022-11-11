const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SecretsManager", async function () {
  it("Secret", () =>
    pipe([
      () => ({
        groupType: "SecretsManager::Secret",
        livesNotFound: ({ config }) => [{ Name: "my-secret" }],
      }),
      awsResourceTest,
    ])());
});
