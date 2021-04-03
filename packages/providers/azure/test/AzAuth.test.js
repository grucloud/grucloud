const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AzAuthorize } = require("../AzAuthorize");

describe("AzAuth", function () {
  let config;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      assert(error.code, 422);
      this.skip();
    }
  });

  it("ok", async function () {
    try {
      const { TENANT_ID, APP_ID, PASSWORD } = process.env;
      assert(TENANT_ID);
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
