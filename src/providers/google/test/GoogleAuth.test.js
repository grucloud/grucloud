const assert = require("assert");
const { JWT } = require("google-auth-library");

describe("GoogleAuth", function () {
  it("auth", async function () {
    const GOOGLE_APPLICATION_CREDENTIALS =
      process.env.GOOGLE_APPLICATION_CREDENTIALS;
    assert(GOOGLE_APPLICATION_CREDENTIALS);

    const keys = require(GOOGLE_APPLICATION_CREDENTIALS);

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
