const assert = require("assert");
const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");

const apis = (config) => [
  {
    name: "Image",
    initState: [["1", { name: "Ubuntu", arch: "x86_64" }]],
  },
  { name: "Volume" },
  {
    name: "Ip",
    configTransform: (config, items) => {
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
    configTransform: (config) => ({ ...config, boot_type: "local" }),
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
