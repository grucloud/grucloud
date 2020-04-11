const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");

const apis = (config) => [
  { name: "Image" },
  { name: "Volume" },
  { name: "Server" },
];

module.exports = MockProvider = ({ name }, config) =>
  CoreProvider({
    name,
    config,
    apis,
    Client: MockClient,
    type: "mock",
    hooks: {
      init: () => {},
    },
  });
