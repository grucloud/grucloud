const Server = require("./resources/Compute");
const Image = require("./resources/Images");
const Address = require("./resources/Address");
const Volume = require("./resources/Volume");

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
    Image({ provider: core }, config),
    Volume({ provider: core }, config),
    Server({ provider: core }, config),
    Address({ provider: core }, config),
  ]);

  return {
    ...core,
    makeImage: (name, config) => Image({ name, provider: core }, config),
    makeVolume: (name, config) => Volume({ name, provider: core }, config),
    makeServer: (name, config) => Server({ name, provider: core }, config),
    makeAddress: (name, config) => Address({ name, provider: core }, config),
  };
};
