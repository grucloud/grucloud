const assert = require("assert");
const _ = require("lodash");
const compare = require("../../Utils").compare;
const CoreProvider = require("../CoreProvider");
const ScalewayClient = require("./ScalewayClient");
const logger = require("../../logger")({ prefix: "ScalewayProvider" });
const TagName = require("../TagName");
const { getField } = require("../ProviderCommon");

const toString = (x) => JSON.stringify(x, null, 4);

const fnSpecs = (config) => {
  const { organization } = config;

  const isOurMinion = ({ resource }) =>
    TagName.isOurMinion({ resource, tag: config.tag });

  return [
    {
      Client: ({ spec }) =>
        ScalewayClient({
          spec,
          url: `/ips`,
          config,
          onResponseList: (data) => {
            logger.debug(`onResponse ${toString(data)}`);
            if (data && data.ips) {
              return { total: data.ips.length, items: data.ips };
            } else {
              throw Error(`Cannot find ips`);
            }
          },
          configDefault: async ({ name, properties }) => ({
            tags: [`name:${name}`, config.tag],
            organization,
            ...properties,
          }),
          findName: (item) => item.address,
        }),
      type: "Ip",
      /* TODO test that
      transformConfig: ({ config, items }) => {
        
        logger.debug(
          `postConfig: ${toString(config)}, items: ${toString(items)}`
        );
        const ip = items.find((item) => item.address === config.address);
        if (ip) {
          return ip;
        }
        return { ...config };
      },*/
      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        ScalewayClient({
          spec,
          url: `/bootscripts`,
          config,
          onResponseList: ({ bootscripts }) => ({
            total: bootscripts.length,
            items: bootscripts,
          }),
        }),
      type: "Bootscript",
      methods: { list: true },
    },
    {
      Client: ({ spec }) =>
        ScalewayClient({
          spec,
          url: `/images`,
          onResponseList: ({ images }) => ({
            total: images.length,
            items: images,
          }),
          config,
        }),
      type: "Image",
      methods: { list: true },
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
            return {
              total: volumes.length,
              items: volumes,
            };
          },
          configDefault: ({ name, options }) => ({
            volume_type: "l_ssd",
            name,
            organization,
            ...options,
          }),
        }),
      type: "Volume",

      isOurMinion,
    },
    {
      Client: ({ spec }) =>
        ScalewayClient({
          spec,
          url: `/servers`,
          config,
          onResponseList: ({ servers }) => {
            return { total: servers.length, items: servers };
          },
          configDefault: async ({
            name,
            properties,
            dependenciesLive: { image, ip },
          }) => {
            return {
              name,
              organization,
              tags: [name, config.tag],
              image: getField(image, "id"),
              ...(ip && { public_ip: getField(ip, "id") }),
              ...properties,
            };
          },
        }),
      type: "Server",
      compare: ({ target, live }) => {
        logger.debug(`compare server`);
        const diff = compare({
          target,
          targetKeys: ["commercial_type", "volumes.0.size"],
          live,
        });
        logger.debug(`compare ${toString(diff)}`);
        return diff;
      },
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

const configCheck = (config) => {
  assert(config, "Please provide a config");
  const { zone, organization, secretKey } = config;
  assert(zone, "zone is missing, e.g fr-par-1");
  assert(organization, "organization is missing");
  assert(secretKey, "secretKey is missing");
};

module.exports = ScalewayProvider = async ({ name, config }) => {
  configCheck(config);
  return CoreProvider({
    type: "scaleway",
    name,
    config,
    fnSpecs,
  });
};
