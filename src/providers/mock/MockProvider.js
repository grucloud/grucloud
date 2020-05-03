const assert = require("assert");
const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");
const compare = require("../../Utils").compare;
const { toTagName } = require("../TagName");

const logger = require("../../logger")({ prefix: "MockProvider" });

const toJSON = (x) => JSON.stringify(x, null, 4);

//TODO use deepMerge ?
const fnSpecs = (config) => {
  const configDefault = ({ name, options }) => ({
    name,
    tags: [toTagName(name, config.tag)],
    ...options,
  });

  return [
    {
      type: "Image",
      url: "/image",
      methods: { list: true },
      toId: (obj) => obj.name,
    },
    {
      type: "Volume",
      url: "/volume",
      configDefault,
    },
    {
      type: "Ip",
      url: "ip",
      configDefault,
    },
    {
      type: "Server",
      url: "/server",
      optionsDefault: {
        machineType: "f1-micro",
        diskSizeGb: "10",
        diskTypes: "pd-standard",
      },
      configDefault: ({ name, options }) => ({
        kind: "compute#instance",
        name,
        zone: `projects/${config.project}/zones/${config.zone}`,
        machineType: `projects/${config.project}/zones/${config.zone}/machineTypes/${options.machineType}`,
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
              diskType: `projects/${config.project}/zones/${config.zone}/diskTypes/${options.diskTypes}`,
              diskSizeGb: options.diskSizeGb,
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
    },
  ];
};

module.exports = MockProvider = async ({ name }, config = {}) => {
  assert(name);
  assert(config);
  const mockCloud = MockCloud(config.mockCloudInitStates);

  return CoreProvider({
    type: "mock",
    name,
    config: { ...config, mockCloud },
    fnSpecs,
    Client: MockClient,
  });
};
