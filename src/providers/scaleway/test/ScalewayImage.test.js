const assert = require("assert");
const ScalewayProvider = require("../ScalewayProvider");
const config = require("../config");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("ScalewayImage", async function () {
  let provider;
  let image;

  before(async () => {
    provider = await ScalewayProvider({ name: "scaleway", config });
    await provider.destroyAll();
    image = provider.makeImage({
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
  });

  after(async () => {
    await provider.destroyAll();
  });
  it("targetResources size ", async function () {
    assert.equal(provider.getTargetResources().length, 1);
  });
  it("config live ", async function () {
    const config = await image.resolveConfig();
    assert(config);
  });
  it("live ", async function () {
    const instance = await image.getLive();
    // Image is a readonly resource,
    assert(!instance);
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 0);
  });
  it.skip("deploy plan", async function () {
    await testPlanDeploy({ provider });
    //await testPlanDestroy({ provider });
  });
});
