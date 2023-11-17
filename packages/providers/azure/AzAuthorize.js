const assert = require("assert");
const Axios = require("axios");
const Path = require("path");
const { pipe, tap, get, switchCase, or } = require("rubico");
const { getWebIdentityToken } = require("@grucloud/core/getJwt");

const AZ_AUTHORIZATION_URL = "https://login.microsoftonline.com/";

const AzAuthorizeServicePrincipal =
  ({ resource = "https://management.azure.com/", scope }) =>
  ({ tenantId, appId, password }) =>
    pipe([
      tap((params) => {
        assert(tenantId, "missing tenantId");
        assert(appId, "missing appId");
        assert(password, "missing password");
      }),
      () => ({
        method: "POST",
        url: Path.join(AZ_AUTHORIZATION_URL, tenantId, "oauth2/token"),
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: appId,
          client_secret: password,
          resource,
          scope,
        }),
      }),
      Axios.request,
      get("data.access_token"),
      tap((bearerToken) => {
        assert(bearerToken);
      }),
    ])();

const AzAuthorizeFederated =
  ({ resource }) =>
  ({ tenantId, appId }) =>
    pipe([
      tap((params) => {
        assert(tenantId, "missing tenantId");
        assert(appId, "missing appId");
      }),
      () => ({
        audience:
          process.env.AZURE_OAUTH_AUDIENCE ?? "api://AzureADTokenExchange",
      }),
      getWebIdentityToken,
      (WebIdentityToken) => ({
        method: "POST",
        url: Path.join(AZ_AUTHORIZATION_URL, tenantId, "oauth2/v2.0/token"),
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: new URLSearchParams({
          grant_type: "client_credentials",
          client_assertion_type:
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
          client_assertion: WebIdentityToken,
          client_id: appId,
          scope: `${resource}/.default`,
        }),
      }),
      Axios.request,
      get("data.access_token"),
      tap((access_token) => {
        assert(access_token);
      }),
    ])();

exports.AzAuthorize = pipe([
  switchCase([
    pipe([() => process.env.AZURE_USE_OAUTH]),
    AzAuthorizeFederated,
    AzAuthorizeServicePrincipal,
  ]),
]);
