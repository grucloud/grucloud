const assert = require("assert");
const logger = require("logger")({ prefix: "CoreProvider" });

const ScalewayProvider = require("./ScalewayProvider");

const config = require("./config");

describe("ScalewayProvider", function () {
  const provider = ScalewayProvider({ name: "scaleway" }, config);

  const ip = provider.makeIp({ name: "myip" });

  const image = provider.makeImage({
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
  /*
  const volume = provider.makeVolume({
    name: "volume1",
    config: () => ({
      size: 20000000000,
    }),
  });
*/
  const server = provider.makeServer({
    name: "web-server",
    dependencies: { image, ip },
    config: async ({ dependencies: {} }) => ({
      name: "web-server",
      commercial_type: "DEV1-S",
      volumes: {
        "0": {
          size: 20000000000,
        },
      },
    }),
  });

  before(async () => {
    await provider.destroyAll();
  });
  after(async () => {
    await provider.destroyAll();
  });

  it("server config", async function () {
    const result = await server.config();
    //console.log(JSON.stringify(result, null, 4));
    assert(result.name);
    assert.equal(result.boot_type, "local");
    //assert(result.image);
    assert(result.volumes);
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
    const plan = await provider.plan();
    //console.log(JSON.stringify(plan, null, 4));
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 2);

    await provider.deployPlan(plan);

    {
      const live = await ip.getLive();
      assert(live);
    }
    {
      const plan = await provider.plan();
      assert.equal(plan.destroy.length, 0);
      assert.equal(plan.newOrUpdate.length, 0);
    }
  });
});
