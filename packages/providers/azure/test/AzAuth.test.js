const assert = require("assert");
const { envLoader } = require("@grucloud/core/EnvLoader");
const { AzAuthorize } = require("../AzAuthorize");

describe("AzAuth", function () {
  before(async function () {
    try {
      envLoader({ configDir: "../../../examples/multi" });
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
