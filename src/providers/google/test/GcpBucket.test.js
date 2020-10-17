const assert = require("assert");
const chance = require("chance")();
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GcpBucket", async function () {
  const bucketName = `mybucket-test-${chance.guid()}`;
  let config;
  let provider;
  let bucket;
  let file;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = await GoogleProvider({
      name: "google",
      config: config.google,
    });
    bucket = await provider.makeBucket({
      name: bucketName,
      properties: () => ({ storageClass: "STANDARD" }),
    });

    file = await provider.makeObject({
      name: `myfile`,
      dependencies: { bucket: bucket },
      properties: () => ({
        path: "/",
        content: "ciao",
      }),
    });

    const { error } = await provider.destroyAll();
    assert(!error);
  });
  after(async () => {
    //await provider?.destroyAll();
  });
  it("bucket config", async function () {
    const config = await bucket.resolveConfig();
    assert(config);
    assert.equal(config.name, bucketName);
  });
  it("lives", async function () {
    const { results: lives } = await provider.listLives();
    //console.log("lives ip", lives);
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 2);
  });
  it.only("gcp bucket apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const { error, results } = await provider.destroyAll();
    assert(!error);
    assert.equal(results.length, 2);
    //  await testPlanDestroy({ provider, type: "Bucket" });
  });
});
