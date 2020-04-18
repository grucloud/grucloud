const _ = require("lodash");
const CoreProvider = require("../CoreProvider");
const ScalewayClient = require("./ScalewayClient");
const logger = require("logger")({ prefix: "ScalewayProvider" });

const toString = (x) => JSON.stringify(x, null, 4);

const findName = (item) => {
  const name = item && item.tags && item.tags[0];
  logger.debug(`findName: item: ${toString(item)}, name: ${name}`);
  //prefix for creating and checking tags ?
  return item && item.tags && item.tags[0];
};

const apis = ({ organization }) => [
  {
    name: "Ip",
    url: `/ips`,
    findName,
    getByName: ({ name, items = [] }) => {
      logger.debug(`getByName: ${name}, items: ${toString(items)}`);
      //TODO check with tag
      const itemsWithName = items.filter(
        (item) => item.tags && item.tags.find((tag) => tag.includes(name))
      );
      if (itemsWithName.length === 0) {
        logger.debug(`getByName: ${name}, no result`);
        return;
      }
      logger.debug(`getByName: ${name}, returns: ${toString(itemsWithName)}`);
      if (itemsWithName.length > 1) {
        logger.error(
          `getByName: ${name}, multiple result: ${toString(itemsWithName)}`
        );
      }

      return itemsWithName[0];
    },
    onResponseList: (data) => {
      logger.debug(`onResponse ${toString(data)}`);
      if (data && data.ips) {
        return { total: data.ips.length, items: data.ips };
      } else {
        throw Error(`Cannot find ips`);
      }
    },
    preCreate: ({ name, options }) => ({
      ...options,
      tags: [name],
      organization,
    }),
    preConfig: async ({ client }) => {
      const result = await client.list();
      const { items } = result.data;
      if (!items) {
        throw Error(`client.list() not formed correctly: ${result}`);
      }
      logger.debug(`preConfig ${toString(items)}`);
      return items;
    },
    postConfig: ({ config, items }) => {
      //assert(items);
      logger.debug(
        `postConfig config: ${toString(config)}, items: ${toString(items)}`
      );
      const ip = items.find((item) => item.address === config.address);
      if (ip) {
        return ip;
      }
      return { ...config };
    },
  },
  {
    name: "Bootscript",
    methods: { list: true },
    onResponseList: ({ bootscripts }) => ({
      total: bootscripts.length,
      items: bootscripts,
    }),
    url: `/bootscripts`,
  },
  {
    name: "Image",
    methods: { list: true },
    onResponseList: ({ images }) => ({ total: images.length, items: images }),
    url: `/images`,
    preConfig: async ({ client }) => {
      const result = await client.list();
      const { items } = result.data;
      if (!items) {
        throw Error(`client.list() not formed correctly: ${result}`);
      }
      // console.log("Image PRECONFIG ", items);
      return items;
    },
  },
  {
    name: "Volume",
    url: `/volumes`,
    onResponseList: (result) => {
      logger.debug(`onResponseList Volume: ${JSON.stringify(result)}`);
      const { volumes = [] } = result;
      return {
        total: volumes.length,
        items: volumes,
      };
    },
    preCreate: ({ name, options }) => ({
      ...options,
      name,
      organization,
    }),
    postConfig: ({ config }) => _.defaults(config, { volume_type: "l_ssd" }),
  },
  {
    name: "Server",
    url: `servers`,
    findName,
    onResponseList: ({ servers }) => {
      return { total: servers.length, items: servers };
    },

    postConfig: ({ config }) => ({ ...config, boot_type: "local" }),
    preCreate: ({ name, options }) => ({
      name,
      organization: config.organization,
      tags: [name],
      ...options,
    }),
  },
];

module.exports = ScalewayProvider = ({ name }, config) =>
  CoreProvider({
    type: "scaleway",
    envs: [
      "SCALEWAY_ORGANISATION_ID",
      "SCALEWAY_ACCESS_KEY",
      "SCALEWAY_SECRET_KEY",
    ],
    name,
    config,
    apis,
    Client: ScalewayClient,

    hooks: {
      init: () => {
        if (!config.zone) {
          throw new Error("zone is not set");
        }
      },
    },
  });
