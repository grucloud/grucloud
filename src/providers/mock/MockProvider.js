const assert = require("assert");
const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");
const logger = require("logger")({ prefix: "MockProvider" });

const toJSON = (x) => JSON.stringify(x, null, 4);

const apis = (config) => [
  {
    name: "Image",
    methods: { list: true },
    toId: (obj) => obj.name,

    preConfig: async ({ client }) => {
      const result = await client.list();
      const { items } = result.data;
      if (!items) {
        throw Error(`client.list() not formed correctly: ${result}`);
      }
      logger.debug("preConfig image ", items);
      return items;
    },
  },
  {
    name: "Volume",
    preCreate: ({ name, options }) => ({
      name,
      ...options,
    }),
  },
  {
    name: "Ip",
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
    preCreate: ({ name, options }) => ({
      organization: config.organization,
      tags: [name],
      ...options,
    }),
    preConfig: async ({ client }) => {
      const result = await client.list();
      const { items } = result.data;
      if (!items) {
        throw Error(`client.list() not formed correctly: ${toJSON(result)}`);
      }
      //console.log("PRECONFIG ", items);
      return items;
    },
    postConfig: ({ items, config }) => {
      assert(items);
      const ip = items.find((item) => item.address === config.address);
      if (ip) {
        return ip;
      }
      return { ...config };
    },
  },
  {
    name: "Server",
    postConfig: ({ config }) => ({ ...config, boot_type: "local" }),
  },
];

module.exports = MockProvider = ({ name }, config) =>
  CoreProvider({
    type: "mock",
    name,
    config,
    apis,
    Client: MockClient,
    hooks: {
      init: () => {},
    },
  });
