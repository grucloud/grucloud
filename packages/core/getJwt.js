const assert = require("assert");
const { tap, pipe, get } = require("rubico");
const Axios = require("axios");

exports.getJwt = ({ tokenUrl, subject, client_secret }) =>
  pipe([
    tap(() => {
      assert(tokenUrl);
      assert(subject);
      assert(client_secret);
    }),
    () => ({
      method: "POST",
      url: tokenUrl,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: subject,
        client_secret,
        resource: "uri:app",
        scope: "openid",
      }),
    }),
    Axios.request,
    get("data.access_token"),
    tap((access_token) => {
      assert(access_token);
    }),
    tap((params) => {
      assert(true);
    }),
  ])();
