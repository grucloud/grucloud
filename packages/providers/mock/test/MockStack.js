const assert = require("assert");
const { MockProvider } = require("../MockProvider");

const createResources = ({ provider }) => {
  // Ip
  provider.Compute.makeIp({ name: "myip" });

  // Boot images
  // const image = provider.ComputeuseImage({
  //   name: "ubuntu",
  //   filterLives: ({ resources }) => {
  //     const image = resources.find(
  //       (image) =>
  //         image.live.name.includes("Ubuntu") && image.live.arch === "x86_64"
  //     );
  //     if (!image) {
  //       //assert(image);
  //       assert(true);
  //     }
  //     return image;
  //   },
  // });

  provider.Compute.makeVolume({
    name: "volume1",
    properties: () => ({
      size: 20_000_000_000,
    }),
  });
  // SecurityGroup
  provider.Compute.makeSecurityGroup({
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
  provider.Compute.makeServer({
    name: "web-server",
    dependencies: () => ({
      volume: "volume1",
      securityGroups: ["sg"],
      ip: "myip",
    }),
    properties: () => ({
      diskSizeGb: "20",
      machineType: "f1-micro",
    }),
  });
};

exports.createResources = createResources;

exports.createStack = ({ name = "mock", createProvider }) => {
  return {
    provider: createProvider(MockProvider, {
      name,
      createResources,
      config: require("./config"),
    }),
  };
};
