const assert = require("assert");
const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");
const compare = require("../../Utils").compare;
const { toTagName, isOurMinion } = require("../TagName");
const logger = require("../../logger")({ prefix: "MockProvider" });
//const toJSON = (x) => JSON.stringify(x, null, 4);

//TODO use deepMerge ?
const fnSpecs = (config) => {
  const configDefault = ({ name, properties }) => ({
    name,
    tags: [toTagName(name, config.tag)],
    ...properties,
  });

  return [
    {
      Client: ({ spec }) =>
        MockClient({
          spec,
          url: `/image`,
          config,
        }),

      type: "Image",
      methods: { list: true },
      toId: (obj) => obj.name,
    },
    {
      Client: ({ spec }) =>
        MockClient({
          spec,
          url: `/volume`,
          config,
        }),

      type: "Volume",
      configDefault,
      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        MockClient({
          spec,
          url: `/ip`,
          config,
        }),
      type: "Ip",
      configDefault,
      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        MockClient({
          spec,
          url: `/server`,
          config,
        }),
      type: "Server",
      propertiesDefault: {
        machineType: "f1-micro",
        diskSizeGb: "10",
        diskTypes: "pd-standard",
      },
      configDefault: ({ name, properties }) => ({
        kind: "compute#instance",
        name,
        zone: `projects/${config.project}/zones/${config.zone}`,
        machineType: `projects/${config.project}/zones/${config.zone}/machineTypes/${properties.machineType}`,
        tags: {
          items: [toTagName(name, config.tag)],
        },
        disks: [
          {
            kind: "compute#attachedDisk",
            type: "PERSISTENT",
            boot: true,
            mode: "READ_WRITE",
            autoDelete: true,
            deviceName: toTagName(name, config.tag),
            initializeParams: {
              sourceImage:
                "projects/debian-cloud/global/images/debian-9-stretch-v20200420",
              diskType: `projects/${config.project}/zones/${config.zone}/diskTypes/${properties.diskTypes}`,
              diskSizeGb: properties.diskSizeGb,
            },
            diskEncryptionKey: {},
          },
        ],
        networkInterfaces: [
          {
            kind: "compute#networkInterface",
            subnetwork: `projects/${config.project}/regions/${config.region}/subnetworks/default`,
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
      configLive: async ({ dependencies: { ip } }) => ({
        networkInterfaces: [
          {
            accessConfigs: [
              {
                natIP: await ip.config().address,
              },
            ],
          },
        ],
      }),
      compare: ({ target, live }) => {
        logger.debug(`compare server`);
        const diff = compare({
          target,
          targetKeys: ["machineType"],
          live,
        });
        logger.debug(`compare ${toString(diff)}`);
        return diff;
      },
      isOurMinion,
    },
  ];
};

module.exports = MockProvider = async ({ name, config }) => {
  assert(name);
  assert(config);
  const mockCloud = MockCloud(config.mockCloudInitStates);

  return CoreProvider({
    type: "mock",
    name,
    config: { ...config, mockCloud },
    fnSpecs,
  });
};
