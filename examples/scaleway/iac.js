const assert = require("assert");
const ScalewayProvider = require("@grucloud/core").ScalewayProvider;

const createResources = async ({ provider }) => {
  const ip = provider.Compute.makeIp({ name: "ip-web-server" });
  // Choose an image
  const image = provider.useImage({
    name: "ubuntu",
    filterLives: ({ resources }) => {
      const image = resources.find(
        ({ live: { name, arch, default_bootscript } }) =>
          name.includes("Ubuntu") && arch === "x86_64" /*&& default_bootscript*/
      );
      assert(image, "missing image");
      return image;
    },
  });
  return {
    ip,
    image,
    server: provider.Compute.makeServer({
      name: "web-server",
      dependencies: { image, ip },
      properties: () => ({
        name: "web-server",
        commercial_type: "DEV1-S",
        volumes: {
          0: {
            size: 20_000_000_000,
          },
        },
      }),
    }),
  };
};
exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  // Create Scaleway provider
  return {
    provider: createProvider(ScalewayProvider, {
      name: "scaleway",
      createResources,
      config: require("./config"),
    }),
  };
};
