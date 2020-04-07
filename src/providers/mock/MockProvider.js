const MockResource = require("./resources/MockResource");
const CoreProvider = require("../CoreProvider");

module.exports = MockProvider = ({ name, provider }, config) => {
  const init = () => {
    //Do init stuff here
  };
  const core = CoreProvider({
    name,
    type: "mock",
    engineResources: [MockResource({ provider }, config)],
    hooks: {
      init,
    },
  });

  return core;
};
