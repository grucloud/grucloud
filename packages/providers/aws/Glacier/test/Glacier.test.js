const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("S3Glacier", async function () {
  it.skip("Vault", () =>
    pipe([
      () => ({
        groupType: "S3Glacier::Vault",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("VaultLock", () =>
    pipe([
      () => ({
        groupType: "S3Glacier::VaultLock",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
