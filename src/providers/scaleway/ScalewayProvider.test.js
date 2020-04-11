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

describe.only("ScalewayProvider", function () {
  const provider = ScalewayProvider({ name: "scaleway" }, config);
  const imageResource = provider.makeImage({ name: "myimage" }, () => ({}));

  const volumeResource = provider.makeVolume({ name: "volume1" }, config);
  const webResource = provider.makeServer(
    { name: "web-server", dependencies: { volume: volumeResource } },
    serverConfig
  );

  const infra = {
    providers: [provider],
    resources: [volumeResource, webResource],
  };

  it.only("Image", async function () {
    const {
      data: { items },
    } = await imageResource.client.list();
    items.map((item) => {
      assert(item.name);
      assert(item.creation_date);
      //console.log(`${item.name} ${item.creation_date}`);
    });

    assert(items);
  });

  it("volumes", async function () {
    const {
      data: { items },
    } = await volumeResource.client.list();
    assert(items);
  });
  it.only("list lives", async function () {
    const result = await provider.listLives();
    assert(result);
  });
  it("list targets", async function () {
    const result = await provider.listTargets();
    assert(result);
  });
  it("plan", async function () {
    // The infrastructure

    const gc = GruCloud(infra);
    const plan = await gc.plan();
    console.log(JSON.stringify(plan, null, 4));
    //assert.equal(plan.destroy.length, 0);
    //assert.equal(plan.newOrUpdate.length, 1);
  });
});
