const assert = require("assert");
const MockProvider = require("../MockProvider");
const toString = (x) => JSON.stringify(x, null, 4);

const createStack = ({ config }) => {
  // Provider

  const provider = MockProvider({ name: "mock" }, config);

  // Ip
  const ip = provider.makeIp({ name: "myip" }, ({}) => ({}));

  // Boot images
  const image = provider.makeImage({ name: "ubuntu" }, ({ items: images }) => {
    assert(images);
    const image = images.find(
      (image) => image.name.includes("Ubuntu") && image.arch === "x86_64"
    );
    //assert(image);
    return image;
  });

  //Volumes
  const volume = provider.makeVolume({ name: "volume1" }, () => ({
    size: 20000000000,
  }));

  //Server
  const server = provider.makeServer(
    {
      name: "web-server",
      dependencies: { volume, image, ip },
    },
    async ({ dependencies: { volume, image, ip } }) => ({
      name: "web-server",
      commercial_type: "DEV1-S",
    })
  );
  return { provider, ip, volume, server, image };
};

module.exports = createStack;
