const assert = require("assert");
const Axios = require("axios");
const qs = require("querystring");
const { pipe, tap, get } = require("rubico");

const AZ_AUTHORIZATION_URL = "https://login.microsoftonline.com/";

const AzAuthorize =
  ({ resource = "https://management.azure.com/", scope }) =>
  ({ tenantId, appId, password }) =>
    pipe([
      tap((params) => {
        assert(tenantId, "missing tenantId");
        assert(appId, "missing appId");
        assert(password, "missing password");
      }),
      () => ({
        baseURL: AZ_AUTHORIZATION_URL,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
      }),
      Axios.create,
      (axios) =>
        pipe([
          () =>
            axios.post(
              `${tenantId}/oauth2/token`,
              qs.stringify({
                grant_type: "client_credentials",
                client_id: appId,
                client_secret: password,
                resource,
                scope,
              })
            ),
          get("data.access_token"),
          tap((bearerToken) => {
            assert(bearerToken);
          }),
          (bearerToken) => ({ bearerToken }),
        ])(),
    ])();

exports.AzAuthorize = AzAuthorize;
