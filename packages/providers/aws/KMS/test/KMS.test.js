const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("KMS", async function () {
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
