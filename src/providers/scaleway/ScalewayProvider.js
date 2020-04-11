const CoreProvider = require("../CoreProvider");
const ScalewayClient = require("./ScalewayClient");

const apis = () => [
  {
    name: "Ip",
    onResponse: (data) => ({ items: data.ips }),
    url: `/ips`,
  },
  {
    name: "Bootscript",
    onResponse: (data) => ({ items: data.bootscripts }),
    url: `/bootscripts`,
  },
  {
    name: "Image",
    onResponse: (data) => ({ items: data.images }),
    url: `/images`,
  },
  {
    name: "Volume",
    onResponse: ({ volumes }) => ({
      total: volumes.length,
      items: volumes,
    }),
    url: `/volumes`,
    configTransform: (config) => ({ ...config, id: "generateid" }),
  },
  {
    name: "Server",
    onResponse: (data) => {
      return { items: data.servers };
    },
    url: `servers`,
    configTransform: (config) => ({ ...config, boot_type: "local" }),
  },
];

module.exports = ScalewayProvider = ({ name }, config) =>
  CoreProvider({
    type: "scaleway",
    envs: [
      "SCALEWAY_ORGANISATION_ID",
      "SCALEWAY_ACCESS_KEY",
      "SCALEWAY_SECRET_KEY",
    ],
    name,
    config,
    Client: ScalewayClient,
    apis,
    hooks: {
      init: () => {
        if (!config.zone) {
          throw new Error("zone is not set");
        }
      },
    },
  });
