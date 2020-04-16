const CoreProvider = require("../CoreProvider");
const ScalewayClient = require("./ScalewayClient");
const logger = require("logger")({ prefix: "App" });

const toString = (x) => JSON.stringify(x, null, 4);

const apis = ({ organization }) => [
  {
    name: "Ip",
    onResponse: (response) => {
      logger.debug(`onResponse ${toString(response)}`);
      return { total: ips.length, items: ips };
    },
    url: `/ips`,
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
      //console.log("PRECONFIG ", items);
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
    onResponse: ({ bootscripts }) => ({
      total: bootscripts.length,
      items: bootscripts,
    }),
    url: `/bootscripts`,
  },
  {
    name: "Image",
    methods: { list: true },
    onResponse: ({ images }) => ({ total: images.length, items: images }),
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
    onResponse: (result) => {
      logger.debug(`Volume onResponse: ${JSON.stringify(result)}`);
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
    onResponse: ({ servers }) => {
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
