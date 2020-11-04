const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { tryCatch, pipe, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { JWT } = require("google-auth-library");
const expandTilde = require("expand-tilde");
const shell = require("shelljs");

const CoreProvider = require("../CoreProvider");
const logger = require("../../logger")({ prefix: "GoogleProvider" });
const { tos } = require("../../tos");

const GcpCompute = require("./resources/compute/");
const GcpIam = require("./resources/iam/");
const GcpStorage = require("./resources/storage/");
const GcpDns = require("./resources/dns/");

const { checkEnv } = require("../../Utils");

const computeDefault = {
  region: "europe-west4",
  zone: "europe-west4-a",
};

const fnSpecs = (config) => [
  ...GcpStorage(config),
  ...GcpIam(config),
  ...GcpCompute(config),
  ...GcpDns(config),
];

const authorize = async ({ applicationCredentials }) => {
  assert(applicationCredentials);
  if (!fs.existsSync(applicationCredentials)) {
    const message = `Cannot open application credentials file ${applicationCredentials}`;
    throw { code: 422, message };
  }
  const keys = require(applicationCredentials);
  logger.debug(`authorize with email: ${keys.client_email}`);

  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const accessToken = await new Promise((resolve, reject) => {
    client.authorize((err, response) => {
      if (err) {
        return reject(err);
      }
      if (response?.access_token) {
        resolve(response.access_token);
      } else {
        reject("Cannot get access_token");
      }
    });
  });
  return accessToken;
};

const getConfig = tryCatch(
  () => {
    const command = "gcloud info --format json";
    const { stdout, code } = shell.exec(command, { silent: true });
    if (code !== 0) {
      throw { message: `command '${command}' failed` };
    }
    const config = JSON.parse(stdout);
    logger.debug(`getConfig: ${tos(config)}`);
    return config;
  },
  (error) => {
    logger.error(`getConfig: ${tos(error)}`);
    //throw error;
  }
);
exports.authorize = authorize;

exports.GoogleProvider = async ({ name = "google", config }) => {
  checkEnv(["GOOGLE_APPLICATION_CREDENTIALS"]);
  const applicationCredentials = path.resolve(
    process.env.CONFIG_DIR,
    expandTilde(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  );
  process.env.GOOGLE_APPLICATION_CREDENTIALS = applicationCredentials;

  const configProviderDefault = await pipe([
    async (config) => ({
      ...config,
      accessToken: await authorize({
        applicationCredentials,
      }),
    }),
    (config) => {
      const localConfig = getConfig();
      if (localConfig) {
        const { project } = localConfig.config;
        return pipe([
          defaultsDeep({ project }),
          defaultsDeep(
            pick(["region", "zone"])(localConfig.config.properties.compute) ||
              {}
          ),
          defaultsDeep(computeDefault),
        ])(config);
      } else {
        return config;
      }
    },
  ])({
    managedByTag: "-managed-by-gru",
    managedByKey: "managed-by",
    managedByValue: "grucloud",
  });

  const core = CoreProvider({
    type: "google",
    name,
    mandatoryEnvs: ["GOOGLE_APPLICATION_CREDENTIALS"],
    config: defaultsDeep(configProviderDefault)(config),
    fnSpecs,
  });

  return core;
};
