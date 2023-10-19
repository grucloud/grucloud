const assert = require("assert");
const { pipe, tap, get, tryCatch } = require("rubico");
const { callProp } = require("rubico/x");

const Axios = require("axios");
const { AzAuthorize } = require("../AzAuthorize");

describe("AzAuth", function () {
  before(async function () {});
  const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } = process.env;
  assert(AZURE_TENANT_ID);
  it("AzAuthorize ok", async function () {
    try {
      const bearerToken = await AzAuthorize({})({
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
  it(
    "get objectId",
    tryCatch(
      pipe([
        () => ({
          tenantId: AZURE_TENANT_ID,
          appId: AZURE_CLIENT_ID,
          password: AZURE_CLIENT_SECRET,
        }),
        AzAuthorize({
          resource: "https://graph.microsoft.com",
        }),
        tap((bearerToken) => {
          assert(bearerToken);
        }),
        (bearerToken) => ({
          baseURL: "https://graph.microsoft.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        }),
        Axios.create,
        //callProp("get", `v1.0/users/`),
        callProp("get", `v1.0/servicePrincipals(appId='${AZURE_CLIENT_ID}')`),
        tap((result) => {
          assert(result);
        }),
        get("data.id"),
        tap((id) => {
          assert(id);
        }),
      ]),
      (error) => {
        assert(false);
      }
    )
  );
});
