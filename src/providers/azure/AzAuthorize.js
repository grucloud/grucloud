const assert = require("assert");
const Axios = require("axios");
const qs = require("querystring");

const AZ_AUTHORIZATION_URL = "https://login.microsoftonline.com/";

exports.AzAuthorize = async ({ tenantId, appId, password }) => {
  assert(tenantId);
  assert(appId);
  assert(password);

  const axios = Axios.create({
    baseURL: AZ_AUTHORIZATION_URL,
    header: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const { data } = await axios.post(
    `${tenantId}/oauth2/token`,
    qs.stringify({
      grant_type: "client_credentials",
      client_id: appId,
      client_secret: password,
      resource: "https://management.azure.com/",
    })
  );
  return { bearerToken: data.access_token };
};
