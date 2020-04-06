const MockResource = require("./resources/MockResource");
const CoreProvider = require("../CoreProvider");

module.exports = MockProvider = ({ name, infra, config }) => {
  const init = () => {
    //Do init stuff here
  };
  const core = CoreProvider({
    name,
    type: "mock",
    engineResources: [
      {
        type: "compute",
        engine: MockResource({ config }),
      },
    ],
    hooks: {
      init,
    },
  });

  return core;
};
