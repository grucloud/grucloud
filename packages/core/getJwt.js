const assert = require("assert");
const { tap, pipe, get, assign } = require("rubico");
const { when } = require("rubico/x");
const Axios = require("axios");
const { decodeJwt } = require("jose");

const logger = require("./logger")({ prefix: "JWT" });

const requestJwt = ({ tokenUrl, subject, client_secret, audience }) =>
  pipe([
    tap(() => {
      assert(tokenUrl);
      assert(subject);
      assert(client_secret);
    }),
    () => ({
      grant_type: "client_credentials",
      client_id: subject,
      client_secret,
    }),
    when(() => audience, assign({ aud: () => audience })),
    (data) => ({
      method: "POST",
      url: tokenUrl,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams(data),
    }),
    Axios.request,
    get("data.access_token"),
    tap((access_token) => {
      assert(access_token);
    }),
    tap(
      pipe([
        decodeJwt,
        tap((pcarams) => {
          assert(true);
        }),
      ])
    ),
  ])();

exports.getWebIdentityToken = async ({ audience }) => {
  const {
    GRUCLOUD_OAUTH_SERVER,
    GRUCLOUD_OAUTH_CLIENT_SECRET,
    GRUCLOUD_OAUTH_SUBJECT,
    GRUCLOUD_OAUTH_TOKEN,
  } = process.env;
  if (
    GRUCLOUD_OAUTH_SERVER &&
    GRUCLOUD_OAUTH_CLIENT_SECRET &&
    GRUCLOUD_OAUTH_SUBJECT
  ) {
    logger.info(`fetch a jwt from ${GRUCLOUD_OAUTH_SERVER}`);
    return requestJwt({
      tokenUrl: GRUCLOUD_OAUTH_SERVER,
      subject: GRUCLOUD_OAUTH_SUBJECT,
      client_secret: GRUCLOUD_OAUTH_CLIENT_SECRET,
      audience,
    });
  } else if (GRUCLOUD_OAUTH_TOKEN) {
    logger.info(`using GRUCLOUD_OAUTH_TOKEN`);
    return GRUCLOUD_OAUTH_TOKEN;
  } else {
    throw Error(
      "GRUCLOUD_OAUTH_TOKEN or (GRUCLOUD_OAUTH_SERVER, GRUCLOUD_OAUTH_CLIENT_SECRET, GRUCLOUD_OAUTH_SUBJECT) missing"
    );
  }
};
