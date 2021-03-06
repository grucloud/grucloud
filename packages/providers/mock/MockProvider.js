const assert = require("assert");
const { defaultsDeep, isFunction } = require("rubico/x");
const Promise = require("bluebird");

const MockClient = require("./MockClient");
const MockCloud = require("./MockCloud");

const CoreProvider = require("@grucloud/core/CoreProvider");
const { isOurMinion } = require("./MockTag");
const { toTagName } = require("@grucloud/core/TagName");
const { createAxiosMock } = require("./MockAxios");

const logger = require("@grucloud/core/logger")({ prefix: "MockProvider" });
const { tos } = require("@grucloud/core/tos");
const { getField } = require("@grucloud/core/ProviderCommon");

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
      isOurMinion,
    },
  ];
};
const providerType = "mock";

exports.MockProvider = ({ name = providerType, config, ...other }) => {
  assert(isFunction(config));

  const configDefault = {
    retryCount: 2,
    retryDelay: 100,
    mockCloud: MockCloud(config.mockCloudInitStates),
    createAxios: createAxiosMock,
  };

  const start = () => {
    //throw Error("throw error in init");
    return Promise.delay(1);
  };

  const info = () => {
    return { ...config };
  };

  return CoreProvider({
    type: providerType,
    name,
    get config() {
      return defaultsDeep(configDefault)(config());
    },
    fnSpecs,
    start,
    info,
    ...other,
  });
};
