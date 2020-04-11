const ComputeResource = require("./resources/Compute");
const Address = require("./resources/Address");

const CoreProvider = require("../CoreProvider");

module.exports = ScalewayProvider = ({ name }, config) => {
  // TODO check config
  // check the zone, project and region
  const init = () => {
    // TODO
    if (!config.zone) {
      throw new Error("zone is not set");
    }
  };

  const core = CoreProvider({
    type: "scaleway",
    envs: [
      "SCALEWAY_ORGANISATION_ID",
      "SCALEWAY_ACCESS_KEY",
      "SCALEWAY_SECRET_KEY",
    ],
    name,
    config,
    hooks: {
      init,
    },
  });

  core.engineAdd([
    ComputeResource({ provider: core }, config),
    Address({ provider: core }, config),
  ]);

  return {
    ...core,
    makeCompute: (name, config) =>
      ComputeResource({ name, provider: core }, config),
    makeAddress: (name, config) => Address({ name, provider: core }, config),
  };
};
