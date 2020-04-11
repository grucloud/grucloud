const MockResource = require("./resources/MockResource");
const CoreProvider = require("../CoreProvider");

module.exports = MockProvider = ({ name }, config) => {
  const init = () => {
    //Do init stuff here
  };
  const core = CoreProvider({
    name,
    config,
    type: "mock",
    hooks: {
      init,
    },
  });

  core.engineAdd([MockResource({ provider: core }, config)]);

  return {
    ...core,
    makeMockResource: (name, config) =>
      MockResource({ name, provider: core }, config),
  };
};
