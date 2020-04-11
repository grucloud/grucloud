const assert = require("assert");
const ScalewayProvider = require("./ScalewayProvider");

const GruCloud = require("../../GruCloudApp");

const config = {
  zone: "fr-par-1",
};
//TODO
const serverConfig = ({ volume }) => ({
  os: "ubuntu",
  machineType: "f1-micro",
  volumes: [
    {
      name: volume.name(),
    },
  ],
});

describe("ScalewayProvider", function () {
  const provider = ScalewayProvider({ name: "scaleway" }, config);

  const imageResource = provider.makeImage(
    { name: "ubuntu" },
    (dependencies, images) => {
      const image = images.find(
        ({ name, arch, default_bootscript }) =>
          name.includes("Ubuntu") && arch === "x86_64" && default_bootscript
      );
      return image;
    }
  );

  const volumeResource = provider.makeVolume({ name: "volume1" }, () => ({
    volume_type: "l_ssd",
    size: 20000000000,
  }));

  const webResource = provider.makeServer(
    { name: "web-server", dependencies: { volume: volumeResource } },
    serverConfig
  );

  const infra = {
    providers: [provider],
    resources: [volumeResource, webResource],
  };
  it.only("image config", async function () {
    const result = await imageResource.config();
    console.log(JSON.stringify(result, null, 4));
    assert(result.id);
  });
  it("list lives", async function () {
    const result = await provider.listLives();
    console.log(JSON.stringify(result, null, 4));
    assert(result);
  });
  it("list targets", async function () {
    const result = await provider.listTargets();
    assert(result);
  });
  it("plan", async function () {
    const gc = GruCloud(infra);
    const plan = await gc.plan();
    console.log(JSON.stringify(plan, null, 4));
    //assert.equal(plan.destroy.length, 0);
    //assert.equal(plan.newOrUpdate.length, 1);
  });
});
