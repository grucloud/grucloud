const assert = require("assert");
const { JWT } = require("google-auth-library");
const CoreProvider = require("../CoreProvider");
const GoogleClient = require("./GoogleClient");
const logger = require("../../logger")({ prefix: "GoogleProvider" });
const { toTagName } = require("../TagName");
const compare = require("../../Utils").compare;

const onResponseList = (data) => {
  const { items = [] } = data;
  return { total: items.length, items };
};

const fnSpecs = ({ project, region, zone, tag }) => [
  {
    Client: GoogleClient,
    type: "Address",
    url: `/projects/${project}/regions/${region}/addresses/`,
    onResponseList,
    propertiesDefault: ({ name, properties }) => ({
      ...properties,
      name,
      description: toTagName(name, tag),
    }),
    postConfig: ({ config, items }) => {
      //assert(items);
      //TODO check that
      logger.debug(
        `postConfig: ${toString(config)}, items: ${toString(items)}`
      );
      const ip = items.find((item) => item.address === config.address);
      if (ip) {
        return ip;
      }
      return { ...config };
    },
  },
  /*{
    type: "Volume",
    url: `/projects/${project}/regions/${region}/volumes/`,
    onResponseList: (data) => {
      console.log("onResponseList TODO", JSON.stringify(data, null, 4));
      return { items: [] };
    },
  },*/
  {
    Client: GoogleClient,
    type: "Instance",
    url: `/projects/${project}/zones/${zone}/instances/`,
    onResponseList,
    propertiesDefault: ({ name, options }) => ({
      ...options,
      kind: "compute#instance",
      name,
      zone: `projects/${project}/zones/${zone}`,
      machineType: `projects/${project}/zones/${zone}/machineTypes/${
        options.machineType || `f1-micro`
      }`,
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
            sourceImage:
              "projects/debian-cloud/global/images/debian-9-stretch-v20200420",
            diskType: `projects/${project}/zones/${zone}/diskTypes/pd-standard`,
            diskSizeGb: "10",
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
  },
];

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

module.exports = GoogleProvider = async ({ name }, config) => {
  configCheck(config);
  const accessToken = await authorize();
  return CoreProvider({
    type: "google",
    name,
    config: { ...config, accessToken },
    fnSpecs,
  });
};
