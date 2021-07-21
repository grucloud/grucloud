const assert = require("assert");
const { ScalewayProvider } = require("../ScalewayProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("ScalewayImage", async function () {
  let config;

  let provider;
  let image;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = ScalewayProvider({
      name: "scaleway",
      config: () => ({}),
    });

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
  });

  after(async () => {});
  it("targetResources size ", async function () {
    assert.equal(provider.getTargetResources().length, 1);
  });
  it("live ", async function () {
    const instance = await image.getLive();
    // Image is a readonly resource,
    assert(!instance);
  });
  it.skip("apply and destroy", async function () {
    await testPlanDeploy({ provider });
    //await testPlanDestroy({ provider });
  });
});
