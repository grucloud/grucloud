const MockImage = require("./resources/MockImage");
const MockVolume = require("./resources/MockVolume");

const CoreProvider = require("../CoreProvider");

module.exports = MockProvider = ({ name }, config) => {
  const core = CoreProvider({
    name,
    config,
    type: "mock",
    hooks: {
      init: () => {},
    },
  });

  core.engineAdd([
    MockImage({ provider: core }, config),
    MockVolume({ provider: core }, config),
  ]);

  return {
    ...core,
    makeImage: (options, config) =>
      MockImage({ ...options, provider: core }, config),
    makeVolume: (options, config) =>
      MockVolume({ ...options, provider: core }, config),
  };
};
