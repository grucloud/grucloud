require("dotenv").config();
const ScalewayProvider = require("@grucloud/core").ScalewayProvider;
const config = {
  zone: "fr-par-1",
  organization: process.env.SCALEWAY_ORGANISATION_ID,
};

const createStack = ({ options }) => {
  // Create Scaleway provider
  const provider = ScalewayProvider({ name: "scaleway" }, config);
  // Allocate public Ip address
  const ip = provider.makeIp({ name: "myip" }, ({}) => ({}));
  // Choose an image
  const image = provider.makeImage({ name: "ubuntu" }, ({ items: images }) => {
    const image = images.find(
      ({ name, arch, default_bootscript }) =>
        name.includes("Ubuntu") && arch === "x86_64" && default_bootscript
    );
    console.log(`Using Image: ${image.name}`);
    return image;
  });
  // Create a server
  provider.makeServer(
    {
      name: "web-server",
      dependencies: { image, ip },
    },
    async () => ({
      name: "web-server",
      commercial_type: "DEV1-S",
      volumes: {
        "0": {
          size: 20000000000,
        },
      },
    })
  );
  return { providers: [provider] };
};
module.exports = createStack;
