const assert = require("assert");
const { AzAuthorize } = require("../AzAuthorize");

describe("AzAuth", function () {
  before(async function () {});

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
