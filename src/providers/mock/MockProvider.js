const assert = require("assert");
const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");
const logger = require("logger")({ prefix: "MockProvider" });

const compare = require("../../Utils").compare;

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
    preCreate: (name, options) => ({
      name,
      ...options,
    }),
    planUpdate: async ({ resource, live }) => {
      logger.info(
        `planUpdate resource: ${toJSON(resource.serialized())}, live: ${toJSON(
          live
        )}`
      );
      const target = await resource.config();
      logger.info(`planUpdate config: ${toJSON(config)}`);
      const diff = compare(target, live);
      if (diff.length === 0) {
        return [
          { action: "UPDATE", resource: resource.serialized(), target, live },
        ];
      }
    },
  },
  {
    name: "Ip",
    getByName: ({ name, items = [] }) => {
      logger.info(`getByName: ${name}, items: ${toJSON(items)}`);
      const item = items.find((item) => item.tags.includes(name));
      return item;
    },
    preCreate: (name, options) => ({
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
