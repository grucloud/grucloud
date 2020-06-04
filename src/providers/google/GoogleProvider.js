const assert = require("assert");
const _ = require("lodash");
const { JWT } = require("google-auth-library");
const CoreProvider = require("../CoreProvider");
const GoogleClient = require("./GoogleClient");
const logger = require("../../logger")({ prefix: "GoogleProvider" });
const GoogleTag = require("./GoogleTag");
const compare = require("../../Utils").compare;
const toString = (x) => JSON.stringify(x, null, 4);
const GoogleInstance = require("./GoogleInstance");

const fnSpecs = (config) => {
  const { project, region, managedByDescription } = config;

  const isOurMinion = ({ resource }) =>
    GoogleTag.isOurMinion({ resource, config });

  return [
    {
      type: "Address",
      Client: ({ spec }) =>
        GoogleClient({
          spec,
          url: `/projects/${project}/regions/${region}/addresses/`,
          config,
          configDefault: ({ name, properties }) => ({
            name,
            description: managedByDescription,
            ...properties,
          }),
        }),

      transformConfig: ({ config, items }) => {
        assert(config);
        assert(items);
        logger.debug(
          `transformConfig: ${toString(config)}, items: ${toString(items)}`
        );
        const ip = items.find((item) => item.address === config.address);
        if (ip) {
          return ip;
        }
        return { ...config };
      },
      isOurMinion,
    },
    {
      type: "Instance",
      dependsOn: ["Address"],
      Client: ({ spec }) =>
        GoogleInstance({
          spec,
          config,
        }),
      propertiesDefault: {
        machineType: "f1-micro",
        diskSizeGb: "10",
        diskTypes: "pd-standard",
        sourceImage: "debian-9-stretch-v20200420",
      },
      compare: ({ target, live }) => {
        logger.debug(`compare server`);
        const diff = compare({
          target,
          targetKeys: [], //TODO
          live,
        });
        logger.debug(`compare ${toString(diff)}`);
        return diff;
      },
      isOurMinion,
    },
  ];
};

const configCheck = (config) => {
  assert(config, "Please provide a config");
  const { project, region, zone, applicationCredentials } = config;
  assert(project, "project is missing");
  assert(region, "region is missing");
  assert(zone, "zone is missing");
  assert(applicationCredentials, "GOOGLE_APPLICATION_CREDENTIALS is missing");
};

const authorize = async () => {
  const GOOGLE_APPLICATION_CREDENTIALS =
    process.env.GOOGLE_APPLICATION_CREDENTIALS;
  assert(GOOGLE_APPLICATION_CREDENTIALS);

  const keys = require(GOOGLE_APPLICATION_CREDENTIALS);

  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const accessToken = await new Promise((resolve, reject) => {
    client.authorize((err, response) => {
      if (response.access_token) {
        resolve(response.access_token);
      }
      reject(err);
    });
  });
  return accessToken;
};

module.exports = GoogleProvider = async ({ name, config }) => {
  configCheck(config);
  const accessToken = await authorize();

  const configProviderDefault = {
    //rename manageByTag ?
    tag: "-managed-by-gru",
    managedByKey: "managed-by",
    managedByValue: "grucloud",
    managedByDescription: "Managed By GruCloud",
    accessToken,
  };

  return CoreProvider({
    type: "google",
    name,
    config: _.defaults(config, configProviderDefault),
    fnSpecs,
  });
};
