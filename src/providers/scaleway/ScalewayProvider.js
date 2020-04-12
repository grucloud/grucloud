const CoreProvider = require("../CoreProvider");
const ScalewayClient = require("./ScalewayClient");

const apis = () => [
  {
    name: "Ip",
    onResponse: ({ ips }) => ({ total: ips.length, items: ips }),
    url: `/ips`,
    configTransform: (config, items) => {
      assert(items);
      const ip = items.find((item) => item.address === config.address);
      if (ip) {
        return ip;
      }
      return { ...config };
    },
  },
  {
    name: "Bootscript",
    onResponse: ({ bootscripts }) => ({
      total: bootscripts.length,
      items: bootscripts,
    }),
    url: `/bootscripts`,
    disableDestroy: true,
  },
  {
    name: "Image",
    onResponse: ({ images }) => ({ total: images.length, items: images }),
    url: `/images`,
    disableDestroy: true,
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
    onResponse: ({ servers }) => {
      return { total: servers.length, items: servers };
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
    apis,
    Client: ScalewayClient,

    hooks: {
      init: () => {
        if (!config.zone) {
          throw new Error("zone is not set");
        }
      },
    },
  });
