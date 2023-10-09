const assert = require("assert");
const fs = require("fs").promises;

const { pipe, tap } = require("rubico");
const { JWT } = require("google-auth-library");

const logger = require("@grucloud/core/logger")({ prefix: "GoogleAutorize" });
const { tos } = require("@grucloud/core/tos");
const { init } = require("./GoogleInit");

const ServiceAccountName = "grucloud";

exports.authorize = async ({ credentials }) => {
  return pipe([
    tap((keys) => {
      logger.info(
        `authorize with email: ${credentials.client_email}, keyId: ${credentials.private_key_id}`
      );
      assert(credentials.private_key, "keys.private_key");
    }),
    () =>
      new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      }),
    (client) =>
      new Promise((resolve, reject) => {
        client.authorize((err, response) => {
          if (err) {
            logger.error(`authorize error with ${credentials.client_email}`);
            logger.error(tos(err));
            return reject(err);
          }
          if (response?.access_token) {
            resolve(response.access_token);
          } else {
            reject("Cannot get access_token");
          }
        });
      }),
    tap((token) => {
      logger.debug(`authorized`);
    }),
  ])();
};
