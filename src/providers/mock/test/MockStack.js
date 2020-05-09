const assert = require("assert");
const _ = require("lodash");
const MockProvider = require("../MockProvider");

const configDefault = require("./config");

const createStack = async ({ config }) => {
  // Provider
  config = _.defaults(config, configDefault);
  assert(config);
  const provider = await MockProvider({ name: "mock", config });

  // Ip
  const ip = provider.makeIp({ name: "myip" });

  // Boot images
  const image = provider.makeImage({
    name: "ubuntu",
    config: ({ items: images }) => {
      assert(images);
      const image = images.find(
        (image) => image.name.includes("Ubuntu") && image.arch === "x86_64"
      );
      //assert(image);
      return image;
    },
  });

  //TODO Volumes
  const volume = provider.makeVolume({
    name: "volume1",
    config: () => ({
      size: 20_000_000_000,
    }),
  });

  //Server
  const server = provider.makeServer({
    name: "web-server",
    dependencies: { volume, image, ip },
    properties: {
      diskSizeGb: "20",
      machineType: "f1-micro",
    },
    config: async ({
      dependencies: { volume, image, ip },
      config: { project, zone },
    }) => {
      const ipLive = await ip.getLive();
      assert(ipLive, "cannot retrieve address");
      assert(project, "project not set");
      assert(zone, "zone not set");
      return {
        disks: [
          {
            autoDelete: true,
            initializeParams: {
              sourceImage:
                "projects/debian-cloud/global/images/debian-9-stretch-v20200420",
              diskType: `projects/${project}/zones/${zone}/diskTypes/pd-standard`,
            },
          },
        ],
        networkInterfaces: [
          {
            accessConfigs: [
              {
                natIP: await ip.getLive().address,
              },
            ],
          },
        ],
      };
    },
  });
  return { providers: [provider], ip, volume, server, image };
};

module.exports = createStack;
