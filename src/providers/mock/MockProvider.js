const assert = require("assert");
const _ = require("lodash");
const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");
const compare = require("../../Utils").compare;
const TagName = require("../TagName");
const { toTagName } = require("../TagName");
const logger = require("../../logger")({ prefix: "MockProvider" });
const { tos } = require("../../tos");
const { getField } = require("../ProviderCommon");

const fnSpecs = (config) => {
  const { createAxios } = config;
  assert(createAxios);

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
      dependsOn: ["SecurityGroup", "Ip"],
      Client: ({ spec }) =>
        MockClient({
          spec,
          url: `/server`,
          config,
          configDefault: async ({
            name,
            properties,
            dependencies: { ip },
          }) => ({
            name,
            zone: `projects/${config.project}/zones/${config.zone}`,
            machineType: `projects/${config.project}/zones/${config.zone}/machineTypes/${properties.machineType}`,
            tags: {
              items: [toTagName(name, config.tag)],
            },
            disks: [
              {
                deviceName: toTagName(name, config.tag),
                initializeParams: {
                  sourceImage:
                    "projects/debian-cloud/global/images/debian-9-stretch-v20200420",
                  diskType: `projects/${config.project}/zones/${config.zone}/diskTypes/${properties.diskTypes}`,
                  diskSizeGb: properties.diskSizeGb,
                },
              },
            ],
            networkInterfaces: [
              {
                subnetwork: `projects/${config.project}/regions/${config.region}/subnetworks/default`,
                accessConfigs: [
                  {
                    natIP: getField(ip, "address"),
                  },
                ],
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
        logger.debug(`compare ${tos(diff)}`);
        return diff;
      },
      isOurMinion,
    },
  ];
};

module.exports = MockProvider = async ({ name, config }) => {
  assert(name);
  assert(config);
  return CoreProvider({
    type: "mock",
    name,
    config,
    fnSpecs,
  });
};
