const assert = require("assert");
const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");
const logger = require("logger")({ prefix: "MockProvider" });

const toJSON = (x) => JSON.stringify(x, null, 4);

const getByName = ({ name, items = [] }) => {
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

  return itemsWithName[0];
};

const fnSpecs = (config) => [
  {
    type: "Image",
    methods: { list: true },
    toId: (obj) => obj.name,
  },
  {
    type: "Volume",
  },
  {
    type: "Ip",
    findName: (item) => {
      //prefix for creating and checking tags ?
      //TODO loop through tags
      return item && item.tags && item.tags[0];
    },
    getByName,
    configDefault: ({ name, options }) => ({
      tags: [name],
      ...options,
    }),
    //TODO
    configTODO: ({ items, config }) => {
      assert(items);
      const ip = items.find((item) => item.address === config.address);
      if (ip) {
        return ip;
      }
      return { ...config };
    },
  },
  {
    type: "Server",
    getByName,
    configDefault: ({ name, options }) => ({
      name,
      tags: [name],
      boot_type: "local",
      ...options,
    }),
  },
];

module.exports = MockProvider = ({ name }, config) =>
  CoreProvider({
    type: "mock",
    name,
    config,
    fnSpecs,
    Client: MockClient,
    hooks: {
      init: () => {},
    },
  });
