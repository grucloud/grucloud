const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Glacier", async function () {
  it("Vault", () =>
    pipe([
      () => ({
        groupType: "Glacier::Vault",
        livesNotFound: ({ config }) => [{ accountId: "-", vaultName: "123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("VaultLock", () =>
    pipe([
      () => ({
        groupType: "Glacier::VaultLock",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
