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
    configDefault: ({ name, options }) => ({
      ...options,
      tags: [name],
      organization,
    }),
    postConfig: ({ config, items }) => {
      //assert(items);
      //TODO check that
      logger.debug(
        `postConfig: ${toString(config)}, items: ${toString(items)}`
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
    configDefault: ({ name, options }) => ({
      volume_type: "l_ssd",
      name,
      organization,
      ...options,
    }),
  },
  {
    name: "Server",
    url: `servers`,
    findName,
    onResponseList: ({ servers }) => {
      return { total: servers.length, items: servers };
    },
    configDefault: ({ name, options }) => ({
      boot_type: "local",
      commercial_type: "DEV1-S",
      name,
      organization,
      tags: [name],
      ...options,
    }),
    configStatic: async ({ config, dependencies: { image, ip, volume } }) => {
      return {
        image: await image.config(),
        volumes: await volume.config(),
        public_ip: await ip.config(),
        ...config,
      };
    },
    configLive: async ({ config, dependencies: { image, ip, volume } }) => {
      //TODO called should called live
      const volumeLive = await volume.getLive();
      const ipLive = await ip.getLive();
      const imageLive = await image.getLive();

      logger.debug(
        `Server configLive volume: ${toString(volumeLive)}, ip: ${toString(
          ipLive
        )}`
      );
      if (!volumeLive || !ipLive || !imageLive) {
        throw Error(`configFromLive: cannot find live resources`);
      }
      return {
        image: await imageLive.uuid,
        volumes: {
          "0": {
            id: volumeLive.id,
            name: volumeLive.name,
          },
        },
        public_ip: ipLive.id,
        ...config,
      };
    },
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
