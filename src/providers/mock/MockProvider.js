const assert = require("assert");
const { defaultsDeep } = require("rubico/x");

const MockClient = require("./MockClient");
const MockCloud = require("./MockCloud");

const CoreProvider = require("../CoreProvider");
const compare = require("../../Utils").compare;
const { isOurMinion } = require("./MockTag");
const { toTagName } = require("../TagName");
const { createAxiosMock } = require("./MockAxios");

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

  return [
    {
      Client: ({ spec }) =>
        MockClient({
          spec,
          url: `/image`,
          config,
        }),

      type: "Image",
      listOnly: true,
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
          configDefault: async ({ name, properties, dependencies: { ip } }) => {
            const {
              machineType,
              diskType,
              diskSizeGb,
              ...otherProperties
            } = properties;
            return defaultsDeep({
              name,
              zone: `projects/${config.project}/zones/${config.zone}`,
              machineType: `projects/${config.project}/zones/${config.zone}/machineTypes/${machineType}`,
              tags: {
                items: [toTagName(name, config.tag)],
              },
              disks: [
                {
                  deviceName: toTagName(name, config.tag),
                  initializeParams: {
                    sourceImage:
                      "projects/debian-cloud/global/images/debian-9-stretch-v20200420",
                    diskType: `projects/${config.project}/zones/${config.zone}/diskTypes/${diskType}`,
                    diskSizeGb,
                  },
                },
              ],
              networkInterfaces: [
                {
                  subnetwork: `projects/${config.project}/regions/${config.region}/subnetworks/default`,
                  accessConfigs: [
                    {
                      ...(ip && { natIP: getField(ip, "address") }),
                    },
                  ],
                },
              ],
            })(otherProperties);
          },
        }),
      type: "Server",
      propertiesDefault: {
        machineType: "f1-micro",
        diskSizeGb: "10",
        diskType: "pd-standard",
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

exports.MockProvider = ({ name = "mock", config }) => {
  assert(config);

  const configDefault = {
    retryCount: 2,
    retryDelay: 100,
    mockCloud: MockCloud(config.mockCloudInitStates),
    createAxios: createAxiosMock,
  };

  return CoreProvider({
    type: "mock",
    name,
    config: defaultsDeep(configDefault)(config),
    fnSpecs,
  });
};
