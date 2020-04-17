const CoreProvider = require("../CoreProvider");
const ScalewayClient = require("./ScalewayClient");
const logger = require("logger")({ prefix: "ScalewayProvider" });

const toString = (x) => JSON.stringify(x, null, 4);

const apis = ({ organization }) => [
  {
    name: "Ip",
    url: `/ips`,
    findName: (item) => {
      //prefix for creating and checking tags ?
      return item && item.tags && item.tags[0];
    },
    getByName: ({ name, items = [] }) => {
      logger.debug(`getByName: ${name}, items: ${toString(items)}`);
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

      return items[0];
    },
    onResponseList: (data) => {
      logger.debug(`onResponse ${toString(data)}`);
      if (data && data.ips) {
        return { total: data.ips.length, items: data.ips };
      } else {
        throw Error(`Cannot find ips`);
      }
    },
    toId: (item) => {
      if (item.address) {
        return item.address;
      } else {
        throw Error(`Cannot find address`);
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
    onResponseList: (result) => {
      logger.debug(`onResponseList Volume: ${JSON.stringify(result)}`);
      const { volumes = [] } = result;
      return {
        total: volumes.length,
        items: volumes,
      };
    },
    url: `/volumes`,
    postConfig: ({ config }) => ({ ...config }),
  },
  {
    name: "Server",
    onResponseList: ({ servers }) => {
      return { total: servers.length, items: servers };
    },
    url: `servers`,
    postConfig: ({ config }) => ({ ...config, boot_type: "local" }),
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
