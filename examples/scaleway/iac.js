const ScalewayProvider = require("@grucloud/core").ScalewayProvider;

const createStack = async ({}) => {
  const config = {
    zone: "fr-par-1",
    organization: process.env.SCALEWAY_ORGANISATION_ID,
    secretKey: process.env.SCALEWAY_SECRET_KEY,
  };
  // Create Scaleway provider
  const provider = await ScalewayProvider({ name: "scaleway", config });
  // Allocate public Ip address
  const ip = await provider.makeIp({ name: "ip-web-server" });
  // Choose an image
  const image = await provider.useImage({
    name: "ubuntu",
    config: ({ items: images }) => {
      const image = images.find(
        ({ name, arch, default_bootscript }) =>
          name.includes("Ubuntu") && arch === "x86_64" && default_bootscript
      );
      return image;
    },
  });
  // Create a server
  await provider.makeServer({
    name: "web-server",
    dependencies: { image, ip },
    // TODO use properties
    properties: {
      name: "web-server",
      commercial_type: "DEV1-S",
      volumes: {
        "0": {
          size: 20_000_000_000,
        },
      },
    },
  });
  return { providers: [provider] };
};
module.exports = createStack;
