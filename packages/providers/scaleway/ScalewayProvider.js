const assert = require("assert");
const { pipe } = require("rubico");

const { defaultsDeep, isFunction } = require("rubico/x");

const compare = require("@grucloud/core/Utils").compare;
const CoreProvider = require("@grucloud/core/CoreProvider");
const ScalewayClient = require("./ScalewayClient");
const logger = require("@grucloud/core/logger")({ prefix: "ScalewayProvider" });
const ScalewayTag = require("./ScalewayTag");
const { getField } = require("@grucloud/core/ProviderCommon");
const { tos } = require("@grucloud/core/tos");

const fnSpecs = (config) => {
  const { organization } = config;
  assert(organization);
  const isOurMinion = ({ live }) =>
    ScalewayTag.isOurMinion({ live, tag: config.tag });

  return [
    {
      Client: ({ spec }) =>
        ScalewayClient({
          spec,
          url: `/ips`,
          config,
          onResponseList: (data) => {
            logger.debug(`onResponse ${tos(data)}`);
            if (data && data.ips) {
              return data.ips;
            } else {
              throw Error(`Cannot find ips`);
            }
          },
          configDefault: async ({ name, properties }) =>
            defaultsDeep({
              tags: [`name:${name}`, config.tag],
              organization,
            })(properties),
          findName: (item) => item.address,
          findTargetId: (item) => {
            return item.ip?.id;
          },
        }),
      type: "Ip",
      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        ScalewayClient({
          spec,
          url: `/bootscripts`,
          config,
          onResponseList: ({ bootscripts }) => bootscripts,
        }),
      type: "Bootscript",
      listOnly: true,
      listHide: true,
      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        ScalewayClient({
          spec,
          url: `/images`,
          onResponseList: ({ images }) => images,
          config,
        }),
      type: "Image",
      listOnly: true,
      listHide: true,
      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        ScalewayClient({
          spec,
          url: `/volumes`,
          config,
          onResponseList: (result) => {
            logger.debug(`onResponseList Volume: ${JSON.stringify(result)}`);
            const { volumes = [] } = result;
            return volumes;
          },
          configDefault: async ({ name, properties }) =>
            defaultsDeep({
              name,
              organization,
            })(properties),
        }),
      type: "Volume",
      propertiesDefault: { volume_type: "l_ssd" },
      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        ScalewayClient({
          spec,
          url: `/servers`,
          config,
          onResponseList: ({ servers }) => servers,
          findTargetId: (item) => {
            return item.server?.id;
          },
          configDefault: async ({
            name,
            properties,
            dependencies: { image, ip },
          }) => {
            return defaultsDeep({
              name,
              organization,
              tags: [name, config.tag],
              image: getField(image, "id"),
              ...(ip && { public_ip: getField(ip, "id") }),
            })(properties);
          },
        }),
      type: "Server",
      propertiesDefault: {
        dynamic_ip_required: false,
        commercial_type: "DEV1-S",
        enable_ipv6: true,
        boot_type: "local",
      },
      isOurMinion,
    },
  ];
};

exports.ScalewayProvider = ({ name = "scaleway", config }) => {
  assert(isFunction(config), "config must be a function");

  const configProviderDefault = {
    zone: "fr-par-1",
    organization: process.env.SCW_ORGANISATION,
    secretKey: process.env.SCW_SECRET_KEY,
  };

  return CoreProvider({
    type: "scaleway",
    name,
    mandatoryEnvs: ["SCW_ORGANISATION", "SCW_SECRET_KEY"],
    mandatoryConfigKeys: ["zone"],
    get config() {
      return pipe([
        () => config(configProviderDefault),
        defaultsDeep(configProviderDefault),
      ])();
    },
    fnSpecs,
  });
};
