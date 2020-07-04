const assert = require("assert");
const logger = require("logger")({ prefix: "CoreProvider" });
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const ScalewayProvider = require("../ScalewayProvider");
const { ConfigLoader } = require("ConfigLoader");

describe("ScalewayProvider", async function () {
  let config;

  let provider;
  let ip;
  let image;
  let server;

  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
    provider = await ScalewayProvider({
      name: "scaleway",
      config: ConfigLoader({ baseDir: __dirname }),
    });
    await provider.destroyAll();
    ip = await provider.makeIp({ name: "myip" });
    image = await provider.useImage({
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
    server = await provider.makeServer({
      name: "web-server",
      dependencies: { image, ip },
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
  });
  after(async () => {
    await provider?.destroyAll();
  });

  it("list all config", async function () {
    const configs = await provider.listConfig();
    //console.log(JSON.stringify(configs, null, 4));
    assert(configs);
  });

  it("list lives", async function () {
    const result = await provider.listLives();
    //console.log(JSON.stringify(result, null, 4));
    assert(result);
  });
  it("list targets", async function () {
    const result = await provider.listTargets();
    assert(result);
  });
  it.skip("plan", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
