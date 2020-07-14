const assert = require("assert");
const { JWT } = require("google-auth-library");
const { ConfigLoader } = require("ConfigLoader");
const { AzAuthorize } = require("../AzAuthorize");

describe("AzAuth", function () {
  let config;

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/azure" });
    } catch (error) {
      assert(error.code, 422);
      this.skip();
    }
  });

  it("ok", async function () {
    try {
      const { TENANT_ID, APP_ID, PASSWORD } = process.env;
      const { bearerToken } = await AzAuthorize({
        tenantId: TENANT_ID,
        appId: APP_ID,
        password: PASSWORD,
      });
      assert(bearerToken);
    } catch (error) {
      //console.log(error.response);
      assert(false);
    }
  });
});
