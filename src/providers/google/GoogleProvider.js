const ComputeResource = require("./resources/Compute");
const CoreProvider = require("../CoreProvider");

module.exports = GoogleProvider = ({ name }, config) => {
  // TODO check config
  // check the zone, project and region

  const init = () => {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
    }
    //project: "starhackit",
    //region: "europe-west4",
    //zone: "europe-west4-a",
    // TODO
    if (!config.project) {
      throw new Error("project is not set");
    }
  };

  const core = CoreProvider({
    name,
    type: "google",
    engineResources: [ComputeResource({}, config)],
    hooks: {
      init,
    },
  });

  return core;
};
