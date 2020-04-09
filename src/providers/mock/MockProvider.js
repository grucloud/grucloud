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
    engineResources: [MockResource({}, config)],
    hooks: {
      init,
    },
  });

  return core;
};
