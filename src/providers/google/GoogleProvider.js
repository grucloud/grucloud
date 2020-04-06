const ComputeResource = require("./resources/Compute");
const CoreProvider = require("../CoreProvider");

module.exports = GoogleProvider = ({ name, infra, config }) => {
  const init = () => {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
    }
  };

  const core = CoreProvider({
    name,
    type: "google",
    engineResources: [
      {
        name: "compute",
        engine: ComputeResource({ config }),
      },
    ],
    hooks: {
      init,
    },
  });

  return core;
};
