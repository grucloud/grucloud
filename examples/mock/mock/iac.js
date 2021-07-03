const assert = require("assert");
const { MockProvider } = require("@grucloud/provider-mock");
const hook = require("./hook");

const createResources = async ({ provider }) => {
  // Ip
  const ip = provider.makeIp({ name: "myip" });

  // Boot images
  const image = provider.useImage({
    name: "ubuntu",
    filterLives: ({ items: images }) => {
      assert(images);
      const image = images.find(
        (image) => image.name.includes("Ubuntu") && image.arch === "x86_64"
      );
      //assert(image);
      return image;
    },
  });

  const volume = provider.makeVolume({
    name: "volume1",
    properties: () => ({
      size: 20_000_000_000,
    }),
  });
  // SecurityGroup
  const sg = provider.makeSecurityGroup({
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
  const server = provider.makeServer({
    name: "web-server",
    dependencies: { volume, sg: [sg], ip },
    properties: () => ({
      diskSizeGb: "20",
      machineType: "f1-micro",
    }),
  });

  return { ip, volume, server, image };
};
exports.createResources = createResources;

exports.createStack = async ({ config }) => {
  const provider = MockProvider({
    config,
  });

  const resources = await createResources({ provider });

  const hooksExtra = require("./hooksExtra");

  return {
    provider,
    resources,
    hooks: [hook, hooksExtra],
  };
};
