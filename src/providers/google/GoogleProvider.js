const ComputeResource = require("./resources/Compute");
const Address = require("./resources/Address");

const CoreProvider = require("../CoreProvider");

module.exports = GoogleProvider = ({ name }, config) => {
  // TODO check config
  // check the zone, project and region
  const init = () => {
    //project: "starhackit",
    //region: "europe-west4",
    //zone: "europe-west4-a",
    // TODO
    if (!config.project) {
      throw new Error("project is not set");
    }
  };

  const core = CoreProvider({
    type: "google",
    env: ["GOOGLE_SERVICE_ACCOUNT_KEY"],
    name,
    engineResources: [ComputeResource({}, config), Address({}, config)],
    hooks: {
      init,
    },
  });

  return {
    ...core,
    makeCompute: (name, config) =>
      ComputeResource({ name, provider: core }, config),
    makeAddress: (name, config) => Address({ name, provider: core }, config),
  };
};
