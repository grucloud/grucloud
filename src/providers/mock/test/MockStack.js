const assert = require("assert");
const MockProvider = require("../MockProvider");
const MockCloud = require("../MockCloud");
const { createAxiosMock } = require("./MockAxios");

const createStack = async ({ config }) => {
  // Provider
  const mockCloud = MockCloud(config.mockCloudInitStates);
  const provider = await MockProvider({
    name: "mock",
    config: {
      ...config,
      mockCloud,
      createAxios: config.createAxios || createAxiosMock,
    },
  });

  // Ip
  const ip = await provider.makeIp({ name: "myip" });

  // Boot images
  const image = await provider.useImage({
    name: "ubuntu",
    transformConfig: ({ items: images }) => {
      assert(images);
      const image = images.find(
        (image) => image.name.includes("Ubuntu") && image.arch === "x86_64"
      );
      //assert(image);
      return image;
    },
  });

  const volume = await provider.makeVolume({
    name: "volume1",
    properties: () => ({
      size: 20_000_000_000,
    }),
  });
  // SecurityGroup
  const sg = await provider.makeSecurityGroup({
    name: "sg",
    properties: () => ({
      securityRules: [
        {
          name: "SSH",
          properties: {
            access: "Allow",
            direction: "Inbound",
            protocol: "Tcp",
            destinationPortRange: "22",
            destinationAddressPrefix: "*",
            sourcePortRange: "*",
            sourceAddressPrefix: "*",
            priority: 1000,
          },
        },
      ],
    }),
  });
  //Server
  const server = await provider.makeServer({
    name: "web-server",
    dependencies: { volume, sg: { sg }, ip },
    properties: () => ({
      diskSizeGb: "20",
      machineType: "f1-micro",
    }),
  });
  return { providers: [provider], ip, volume, server, image };
};

module.exports = createStack;
