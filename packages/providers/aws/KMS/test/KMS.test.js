const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("KMS", async function () {
  it.skip("CustomKeyStore", () =>
    pipe([
      () => ({
        groupType: "KMS::CustomKeyStore",
        livesNotFound: ({ config }) => [
          {
            KeyId: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Key", () =>
    pipe([
      () => ({
        groupType: "KMS::Key",
        livesNotFound: ({ config }) => [
          {
            KeyId: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
