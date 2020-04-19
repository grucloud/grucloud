const CoreProvider = require("../CoreProvider");
const GoogleClient = require("./GoogleClient");

const fnSpecs = ({ project, region, zone }) => [
  {
    type: "Address",
    url: `/projects/${project}/regions/${region}/addresses/`,
    onResponseList: (data) => {
      console.log("onResponseList TODO", JSON.stringify(data, null, 4));
      return { items: [] };
    },
  },
  {
    type: "Volume",
    url: `/projects/${project}/regions/${region}/volumes/`,
    onResponseList: (data) => {
      console.log("onResponseList TODO", JSON.stringify(data, null, 4));
      return { items: [] };
    },
  },
  {
    type: "Server",
    url: `/projects/${project}/zones/${zone}/instances/`,
    onResponseList: (data) => {
      console.log("onResponseList TODO", JSON.stringify(data, null, 4));
      return { items: [] };
    },
  },
];

module.exports = GoogleProvider = ({ name }, config) =>
  CoreProvider({
    type: "google",
    env: ["GOOGLE_SERVICE_ACCOUNT_KEY"],
    name,
    config,
    fnSpecs,
    Client: GoogleClient,
    hooks: {
      init: () => {
        //project: "starhackit",
        //region: "europe-west4",
        //zone: "europe-west4-a",
        // TODO
        if (!config.project) {
          throw new Error("project is not set");
        }
      },
    },
  });
