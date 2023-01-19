const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Glacier", async function () {
  it.skip("Vault", () =>
    pipe([
      () => ({
        groupType: "Glacier::Vault",
        livesNotFound: ({ config }) => [{}],
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
