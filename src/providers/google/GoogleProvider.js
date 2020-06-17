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

const authorize = async ({ applicationCredentials }) => {
  assert(applicationCredentials);
  //TODO check if file exists
  const keys = require(applicationCredentials);

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
  const { applicationCredentials } = config;
  const accessToken = await authorize({ applicationCredentials });

  const configProviderDefault = {
    //rename manageByTag ?
    tag: "-managed-by-gru",
    managedByKey: "managed-by",
    managedByValue: "grucloud",
    managedByDescription: "Managed By GruCloud",
    accessToken,
  };

  const core = CoreProvider({
    type: "google",
    name,
    mandatoryConfigKeys: [
      "project",
      "region",
      "zone",
      "applicationCredentials",
    ],
    config: _.defaults(config, configProviderDefault),
    fnSpecs,
  });

  return core;
};
