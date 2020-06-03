const assert = require("assert");
const _ = require("lodash");
const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");
const compare = require("../../Utils").compare;
const TagName = require("../TagName");
const { toTagName } = require("../TagName");
const logger = require("../../logger")({ prefix: "MockProvider" });
//const toJSON = (x) => JSON.stringify(x, null, 4);

//TODO use deepMerge ?
const fnSpecs = (config) => {
  const configDefault = async ({ name, properties }) => ({
    name,
    tags: [toTagName(name, config.tag)],
    ...properties,
  });

  const isOurMinion = ({ resource }) =>
    TagName.isOurMinion({ resource, tag: config.tag });

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
      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        MockClient({
          spec,
          url: `/volume`,
          config,
          configDefault,
        }),

      type: "Volume",
      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        MockClient({
          spec,
          url: `/ip`,
          config,
          configDefault,
        }),
      type: "Ip",
      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        MockClient({
          spec,
          url: `/security_group`,
          config,
          configDefault,
        }),
      type: "SecurityGroup",
      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        MockClient({
          spec,
          url: `/server`,
          config,
          dependsOn: ["SecurityGroup"],
          configDefault: async ({
            name,
            properties,
            dependenciesLive: { ip },
          }) => ({
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
                    natIP: _.get(ip, "address", "<<later>>"),
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
      type: "Server",
      propertiesDefault: {
        machineType: "f1-micro",
        diskSizeGb: "10",
        diskTypes: "pd-standard",
      },

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
