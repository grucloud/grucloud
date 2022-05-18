const assert = require("assert");
const { map, pipe, tap, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const Promise = require("bluebird");

const MockClient = require("./MockClient");
const MockCloud = require("./MockCloud");

const CoreProvider = require("@grucloud/core/CoreProvider");
const { isOurMinion } = require("./MockTag");
const { toTagName } = require("@grucloud/core/TagName");
const { createAxiosMock } = require("./MockAxios");

const logger = require("@grucloud/core/logger")({ prefix: "MockProvider" });
const { tos } = require("@grucloud/core/tos");
const { getField, mergeConfig } = require("@grucloud/core/ProviderCommon");
const { compare } = require("../aws/node_modules/@grucloud/core/Common");

const fnSpecs = (config) => {
  const { createAxios } = config;
  assert(createAxios);

  const configDefault = ({ name, properties }) => ({
    name,
    tags: [toTagName(name, config.tag)],
    ...properties,
  });

  return pipe([
    () => [
      {
        Client: ({ spec }) =>
          MockClient({
            spec,
            url: `/image`,
            config,
          }),

        type: "Image",
        listOnly: true,
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
        dependencies: {
          securityGroup: { type: "SecurityGroup", group: "Compute" },
        },
      },
      {
        dependencies: {
          securityGroups: {
            type: "SecurityGroup",
            group: "Compute",
            list: true,
          },
          ip: {
            type: "Ip",
            group: "Compute",
          },
          volume: {
            type: "Volume",
            group: "Compute",
          },
        },
        Client: ({ spec }) =>
          MockClient({
            spec,
            url: `/server`,
            config,
            configDefault: async ({
              name,
              properties,
              dependencies: { ip },
            }) => {
              const {
                machineType,
                diskType = "pd-standard",
                diskSizeGb = 10,
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
      },
    ],
    map(
      defaultsDeep({
        isOurMinion,
        compare: compare({ filterLive: () => omit(["id"]) }),
        group: "Compute",
      })
    ),
  ])();
};
const providerType = "mock";

exports.MockProvider = ({
  name = providerType,
  config,
  configs = [],
  ...other
}) => {
  //assert(isFunction(config));

  const configDefault = {
    retryCount: 2,
    retryDelay: 100,
    mockCloud: MockCloud(),
    createAxios: createAxiosMock,
  };

  const start = () => {
    //throw Error("throw error in init");
    return Promise.delay(1);
  };

  const info = () => {
    return mergeConfigMock();
  };

  const mergeConfigMock = () => mergeConfig({ configDefault, config, configs });

  return CoreProvider({
    type: providerType,
    name,
    makeConfig: () => mergeConfigMock(),
    fnSpecs,
    start,
    info,
    ...other,
  });
};
