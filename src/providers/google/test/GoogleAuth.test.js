const assert = require("assert");
const { JWT } = require("google-auth-library");
const { ConfigLoader } = require("ConfigLoader");

describe("GoogleAuth", function () {
  let config;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/google" });
    } catch (error) {
      assert(error.code, 422);
      this.skip();
    }
  });

  it("auth", async function () {
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
});
