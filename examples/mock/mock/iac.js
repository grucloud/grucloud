const assert = require("assert");
const { tap, pipe } = require("rubico");
const { MockProvider } = require("@grucloud/provider-mock");
const hook = require("./hook");

const createResources = ({ provider }) => {
  // Ip
  provider.Compute.makeIp({ name: "myip" });

  // Boot images
  // const image = provider.useImage({
  //   name: "ubuntu",
  //   filterLives: ({ resources }) => {
  //     assert(images);
  //     const image = resources.find(
  //       (image) => image.name.includes("Ubuntu") && image.arch === "x86_64"
  //     );
  //     //assert(image);
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

exports.createStack = ({ createProvider }) => {
  return {
    provider: createProvider(MockProvider, {
      createResources,
      config: require("./config"),
    }),
    hooks: [hook, require("./hooksExtra")],
  };
};
