const assert = require("assert");
const path = require("path");
const { authorize } = require("../GoogleAuthorize");

describe("GoogleAuth", function () {
  let config;
  before(async function () {});

  it("auth ko: account not found", async function () {
    const applicationCredentialsFile = path.resolve(
      __dirname,
      "grucloud-credentials-invalid.json"
    );
    try {
      await authorize({ applicationCredentialsFile });
    } catch (error) {
      assert.equal(
        error.message,
        "invalid_grant: Invalid grant: account not found"
      );
    }
  });
});
