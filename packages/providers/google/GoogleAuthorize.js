const assert = require("assert");
const Axios = require("axios");
const { pipe, tap, get, switchCase, or } = require("rubico");
const { getWebIdentityToken } = require("@grucloud/core/getJwt");
const { GeneralSign, importPKCS8 } = require("jose");

const logger = require("@grucloud/core/logger")({ prefix: "GoogleAutorize" });

const GOOGLE_TOKEN_URL = "https://www.googleapis.com/oauth2/v4/token";
const SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const alg = "RS256";

const GoogleAuthorizeServicePrincipal = ({
  credentials: { private_key, client_email, private_key_id },
}) =>
  pipe([
    tap((params) => {
      logger.info(
        `GoogleAuthorizeServicePrincipal: ${client_email}, private_key_id: ${private_key_id}`
      );
      assert(private_key, "missing tenantId");
      assert(client_email, "missing client_email");
    }),
    () => Math.floor(new Date().getTime() / 1000),
    (iat) => ({
      iss: client_email,
      scope: SCOPE,
      aud: GOOGLE_TOKEN_URL,
      exp: iat + 3600,
      iat,
    }),
    JSON.stringify,
    (text) => new TextEncoder().encode(text),
    async (encoded) =>
      new GeneralSign(encoded)
        .addSignature(await importPKCS8(private_key, alg))
        .setProtectedHeader({ alg })
        .sign(),
    tap((params) => {
      assert(params);
    }),
    ({ signatures, payload }) => ({
      method: "POST",
      url: GOOGLE_TOKEN_URL,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${signatures[0].protected}.${payload}.${signatures[0].signature}`,
      }),
    }),
    Axios.request,
    get("data.access_token"),
    tap((bearerToken) => {
      assert(bearerToken);
    }),
  ])();

const GoogleAuthorizeWorkloadIdentity = ({
  credentials: {
    audience,
    service_account_impersonation_url,
    token_url = "https://sts.googleapis.com/v1/token",
  },
}) =>
  pipe([
    tap((params) => {
      logger.info(`GoogleAuthorizeWorkloadIdentity: audience: ${audience}`);
      assert(audience, "missing audience");
      assert(service_account_impersonation_url);
      assert(token_url);
    }),
    () => ({
      audience:
        process.env.GOOGLE_OAUTH_AUDIENCE ?? "https://demo.grucloud.com",
    }),
    getWebIdentityToken,
    (subjectToken) => ({
      method: "POST",
      url: token_url,
      headers: { "content-type": "application/json" },
      data: {
        audience,
        grantType: "urn:ietf:params:oauth:grant-type:token-exchange",
        requestedTokenType: "urn:ietf:params:oauth:token-type:access_token",
        scope: SCOPE,
        subjectTokenType: "urn:ietf:params:oauth:token-type:jwt",
        subjectToken,
      },
    }),
    Axios.request,
    get("data"),
    tap(({ access_token }) => {
      assert(access_token);
    }),
    ({ access_token }) => ({
      method: "POST",
      url: service_account_impersonation_url,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      data: {
        scope: SCOPE,
      },
    }),
    Axios.request,
    get("data.accessToken"),
    tap((accessToken) => {
      assert(accessToken);
    }),
  ])();

exports.authorize = pipe([
  switchCase([
    pipe([
      tap((params) => {
        assert(params);
      }),
      () => process.env,
      or([get("GRUCLOUD_OAUTH_SUBJECT"), get("GRUCLOUD_OAUTH_TOKEN")]),
    ]),
    GoogleAuthorizeWorkloadIdentity,
    GoogleAuthorizeServicePrincipal,
  ]),
]);
