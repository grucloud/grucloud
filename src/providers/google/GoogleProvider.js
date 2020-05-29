const assert = require("assert");
const { JWT } = require("google-auth-library");
const CoreProvider = require("../CoreProvider");
const GoogleClient = require("./GoogleClient");
const logger = require("../../logger")({ prefix: "GoogleProvider" });
const GoogleTag = require("./GoogleTag");
const { toTagName } = require("./GoogleTag");
const compare = require("../../Utils").compare;
const toString = (x) => JSON.stringify(x, null, 4);

const fnSpecs = (config) => {
  const { project, region, zone, tag } = config;
  const isOurMinion = ({ resource }) =>
    GoogleTag.isOurMinion({ resource, tag });

  return [
    {
      type: "Address",
      Client: ({ spec }) =>
        GoogleClient({
          spec,
          url: `/projects/${project}/regions/${region}/addresses/`,
          config,
          configDefault: ({ name, properties }) => ({
            ...properties,
            name,
            description: toTagName(name, tag),
          }),
        }),

      transformConfig: ({ config, items }) => {
        assert(config);
        assert(items);
        logger.debug(
          `postConfig: ${toString(config)}, items: ${toString(items)}`
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
      Client: ({ spec }) =>
        GoogleClient({
          spec,
          url: `/projects/${project}/zones/${zone}/instances/`,
          config,
          configDefault: ({ name, properties }) => ({
            kind: "compute#instance",
            name,
            zone: `projects/${project}/zones/${zone}`,
            machineType: `projects/${project}/zones/${zone}/machineTypes/${properties.machineType}`,
            tags: {
              items: [toTagName(name, tag)],
            },
            disks: [
              {
                kind: "compute#attachedDisk",
                type: "PERSISTENT",
                boot: true,
                mode: "READ_WRITE",
                autoDelete: true,
                deviceName: toTagName(name, tag),
                initializeParams: {
                  sourceImage: `projects/debian-cloud/global/images/${properties.sourceImage}`,
                  diskType: `projects/${project}/zones/${zone}/diskTypes/pd-standard`,
                  diskSizeGb: properties.diskSizeGb,
                },
                diskEncryptionKey: {},
              },
            ],
            networkInterfaces: [
              {
                kind: "compute#networkInterface",
                subnetwork: `projects/${project}/regions/${region}/subnetworks/default`,
                accessConfigs: [
                  {
                    kind: "compute#accessConfig",
                    name: "External NAT",
                    type: "ONE_TO_ONE_NAT",
                    networkTier: "PREMIUM",
                  },
                ],
                aliasIpRanges: [],
              },
            ],
          }),
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
  return CoreProvider({
    type: "google",
    name,
    config: { ...config, accessToken },
    fnSpecs,
  });
};
