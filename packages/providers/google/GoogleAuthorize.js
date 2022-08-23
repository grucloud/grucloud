const assert = require("assert");
const fs = require("fs").promises;

const { pipe, tap, switchCase, get } = require("rubico");
const {} = require("rubico/x");
const { JWT } = require("google-auth-library");

const logger = require("@grucloud/core/logger")({ prefix: "GoogleAutorize" });
const { tos } = require("@grucloud/core/tos");
const { init } = require("./GoogleInit");

const { runGCloudCommand } = require("./GoogleCommon");

const ServiceAccountName = "grucloud";

exports.authorize = async ({
  gcloudConfig,
  projectName,
  projectId,
  applicationCredentialsFile,
}) => {
  logger.info(`authorize with file: ${applicationCredentialsFile}`);

  assert(applicationCredentialsFile);
  if (
    !(await fs
      .access(applicationCredentialsFile)
      .then(() => true)
      .catch(() => false))
  ) {
    const message = `Cannot open application credentials file ${applicationCredentialsFile}\nRunning 'gc init'`;
    console.log(message);
    await init({
      gcloudConfig,
      projectName,
      projectId,
      applicationCredentialsFile,
      serviceAccountName: ServiceAccountName,
    });
  }

  return pipe([
    () => fs.readFile(applicationCredentialsFile, "utf-8"),
    JSON.parse,
    tap((keys) => {
      logger.info(
        `authorize with email: ${keys.client_email}, keyId: ${keys.private_key_id}`
      );
      assert(keys.private_key, "keys.private_key");
    }),
    (keys) =>
      pipe([
        () =>
          new JWT({
            email: keys.client_email,
            key: keys.private_key,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
          }),
        (client) =>
          new Promise((resolve, reject) => {
            client.authorize((err, response) => {
              if (err) {
                logger.error(`authorize error with ${keys.client_email}`);
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
      ])(),
    tap((token) => {
      logger.debug(`authorized ${token}`);
    }),
  ])();
};
