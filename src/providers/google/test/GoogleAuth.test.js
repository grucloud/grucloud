const assert = require("assert");
const path = require("path");
const { JWT } = require("google-auth-library");
const { ConfigLoader } = require("ConfigLoader");
const { authorize } = require("../GoogleProvider");

describe("GoogleAuth", function () {
  let config;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/google/vm" });
    } catch (error) {
      assert(error.code, 422);
      this.skip();
    }
  });

  it("auth ok", async function () {
    const applicationCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    assert(applicationCredentials);

    const keys = require(applicationCredentials);

    const client = new JWT({
      email: keys.client_email,
      key: keys.private_key,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const accessToken = await new Promise((resolve, reject) => {
      client.authorize((err, response) => {
        if (response.access_token) {
          resolve(response.access_token);
        }
        reject(err);
      });
    });

    assert(accessToken);
  });
  it("auth ko: account not found", async function () {
    const applicationCredentials = path.resolve(
      __dirname,
      "grucloud-credentials-invalid.json"
    );
    try {
      await authorize({ applicationCredentials });
    } catch (error) {
      assert.equal(
        error.message,
        "invalid_grant: Invalid grant: account not found"
      );
    }
  });
});
