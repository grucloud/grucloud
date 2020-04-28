const assert = require("assert");
const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");
const compare = require("../../Utils").compare;
const { toTagName } = require("../TagName");

const logger = require("../../logger")({ prefix: "MockProvider" });

const toJSON = (x) => JSON.stringify(x, null, 4);

const getByName = ({ name, items = [] }) => {
  if (!name) {
    throw Error(`getByName no name`);
  }
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
//TODO use deepMerge ?
const fnSpecs = (config) => {
  const configDefault = ({ name, options }) => ({
    name,
    tags: [toTagName(name, config.tag)],
    ...options,
  });

  return [
    {
      type: "Image",
      url: "/image",
      methods: { list: true },
      toId: (obj) => obj.name,
    },
    {
      type: "Volume",
      url: "/volume",
      configDefault,
    },
    {
      type: "Ip",
      url: "ip",
      findName: (item) => {
        //prefix for creating and checking tags ?
        //TODO loop through tags
        return item?.tags[0];
      },
      getByName,
      configDefault,
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
      url: "/server",
      getByName,
      configDefault: ({ name, options }) => ({
        boot_type: "local",
        ...configDefault({ name, options }),
      }),
      compare: ({ target, live }) => {
        logger.debug(`compare server`);
        const diff = compare({
          target,
          targetKeys: ["machineType"],
          live,
        });
        logger.debug(`compare ${toString(diff)}`);
        return diff;
      },
    },
  ];
};

module.exports = MockProvider = ({ name }, config = {}) => {
  const mockCloud = MockCloud(config.mockCloudInitStates);

  return CoreProvider({
    type: "mock",
    name,
    config: { ...config, mockCloud },
    fnSpecs,
    Client: MockClient,
    hooks: {
      init: () => {},
    },
  });
};
