const assert = require("assert");
const { AzAuthorize } = require("../AzAuthorize");

describe("AzAuth", function () {
  before(async function () {});

  it("ok", async function () {
    try {
      const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } =
        process.env;
      assert(AZURE_TENANT_ID);
      const { bearerToken } = await AzAuthorize({})({
        tenantId: AZURE_TENANT_ID,
        appId: AZURE_CLIENT_ID,
        password: AZURE_CLIENT_SECRET,
      });
      assert(bearerToken);
    } catch (error) {
      //console.log(error.response);
      assert(false);
    }
  });
});
