const assert = require("assert");
const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");

const identity = (x) => x;

const apis = (config) => [
  {
    name: "Image",
    initState: [["1", { name: "Ubuntu", arch: "x86_64" }]],
    preConfig: async ({ client }) => {
      const result = await client.list();
      const { items } = result.data;
      if (!items) {
        throw Error(`client.list() not formed correctly: ${result}`);
      }
      console.log("Image PRECONFIG ", items);
      return items;
    },
  },
  { name: "Volume" },
  {
    name: "Ip",
    preConfig: async ({ client }) => {
      const result = await client.list();
      const { items } = result.data;
      if (!items) {
        throw Error(`client.list() not formed correctly: ${result}`);
      }
      console.log("PRECONFIG ", items);
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
    initState: [
      [
        "36e1766f-9d5b-426f-bb82-c8db324c3fd9",
        {
          id: "36e1766f-9d5b-426f-bb82-c8db324c3fd9",
          address: "51.15.246.48",
          tags: [],
        },
      ],
    ],
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
