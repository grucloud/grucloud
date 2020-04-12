const MockClient = require("./MockClient");
const CoreProvider = require("../CoreProvider");

const apis = (config) => [
  { name: "Image", initState: [["1", { name: "Ubuntu", arch: "x86_64" }]] },
  { name: "Volume" },
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
