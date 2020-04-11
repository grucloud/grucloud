const CoreProvider = require("../CoreProvider");
const GoogleClient = require("./GoogleClient");

const ComputeResource = require("./resources/Compute");
const Address = require("./resources/Address");

const apis = ({ project, region, zone }) => [
  {
    name: "Address",
    url: `/projects/${project}/regions/${region}/addresses/`,
    onResponse: (data) => {
      console.log("TODO", JSON.stringify(data, null, 4));
      return { items: [] };
    },
  },
  {
    name: "VM",
    url: `/projects/${project}/zones/${zone}/instances/`,
    onResponse: (data) => {
      console.log("TODO", JSON.stringify(data, null, 4));
      return { items: [] };
    },
  },
];

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
    apis,
    Client: GoogleClient,
    name,
    config,
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
