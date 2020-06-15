const assert = require("assert");
const { JWT } = require("google-auth-library");
const { ConfigLoader } = require("ConfigLoader");
const { AzAuthorize } = require("../AzAuthorize");

describe("AzAuth", function () {
  let config;
  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      assert(error.code, 422);
      this.skip();
    }
  });

  it("ok", async function () {
    try {
      const { bearerToken } = await AzAuthorize(config);
      assert(bearerToken);
    } catch (error) {
      //console.log(error.response);
      assert(false);
    }
  });
});
