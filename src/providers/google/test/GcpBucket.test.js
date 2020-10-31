const path = require("path");
const assert = require("assert");
const chance = require("chance")();
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GcpBucket", async function () {
  const types = ["Bucket", "Object"];
  const bucketName = `mybucket-test-${chance.guid()}`;
  const bucketNamePublic = `test.gcp.grucloud.com`;
  const objectName = `mypath/myfile`;
  let config;
  let provider;
  let bucket;
  let bucketPublic;

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
      properties: () => ({}),
    });

    bucketPublic = await provider.makeBucket({
      name: bucketNamePublic,
      properties: () => ({
        iam: {
          bindings: [
            {
              role: "roles/storage.objectViewer",
              members: ["allUsers"],
            },
          ],
        },
      }),
    });
    file = await provider.makeObject({
      name: objectName,
      dependencies: { bucket: bucket },
      properties: () => ({
        path: "/",
        source: path.join(
          process.cwd(),
          "examples/aws/s3/fixtures/testFile.txt"
        ),
      }),
    });

    const { error } = await provider.destroyAll();
    assert(!error);
  });
  after(async () => {
    await provider?.destroyAll();
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
    assert.equal(plan.resultCreate.plans.length, 3);
  });
  it("gcp bucket apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    const bucketLive = await bucket.getLive();

    const bucketPublicLive = await bucketPublic.getLive({ deep: true });
    assert(bucketPublicLive.iam);
    {
      const provider = await GoogleProvider({
        name: "google",
        config: config.google,
      });

      const bucket = await provider.makeBucket({
        name: bucketName,
        properties: () => ({}),
      });

      const file = await provider.makeObject({
        name: objectName,
        dependencies: { bucket: bucket },
        properties: () => ({
          path: "/",
          source: path.join(
            process.cwd(),
            "examples/aws/s3/fixtures/testFile2.txt"
          ),
        }),
      });
      const plan = await provider.planQuery();
      assert.equal(plan.resultCreate.plans.length, 1);
      assert.equal(plan.resultCreate.plans[0].action, "UPDATE");

      const { error } = await provider.planApply({ plan });
      assert(!error);
    }
    await testPlanDestroy({ provider, types });
  });
});
