const assert = require("assert");
const logger = require("@grucloud/core/logger")({ prefix: "CoreProvider" });
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { ScalewayProvider } = require("../ScalewayProvider");

describe("ScalewayProvider", async function () {
  let config;

  let provider;
  let ip;
  let image;
  let server;

  before(async function () {
    provider = ScalewayProvider({
      name: "scaleway",
      config: () => ({}),
    });

    ip = provider.makeIp({ name: "myip" });
    image = provider.useImage({
      name: "ubuntu",
      config: ({ items: images }) => {
        assert(images);
        const image = images.find(
          ({ name, arch, default_bootscript }) =>
            name.includes("Ubuntu") && arch === "x86_64" && default_bootscript
        );
        assert(image);
        return image;
      },
    });
    server = provider.makeServer({
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
    });
  });
  after(async () => {});

  it("list all config", async function () {
    const configs = provider.listConfig();
    //console.log(JSON.stringify(configs, null, 4));
    assert(configs);
  });
  it("list targets", async function () {
    const result = provider.listTargets();
    assert(result);
  });
  it.skip("plan", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
