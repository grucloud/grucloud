const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("AwsCertificate", async function () {
  let config;
  let provider;
  let certificate;
  const certificateName = "aws.grucloud.com";

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });

    await provider.start();

    const { error } = await provider.destroyAll();
    assert(!error, "destroyAll failed");

    certificate = await provider.makeCertificate({
      name: certificateName,
      properties: () => ({}),
    });
  });
  after(async () => {
    //await provider?.destroyAll();
  });
  it("certificate resolveConfig", async function () {
    assert.equal(certificate.name, certificateName);
    const config = await certificate.resolveConfig();
    assert.equal(config.Name, certificateName);
  });
  it("certificate plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 1);
  });
  it("certificate listLives all", async function () {
    const { results: lives } = await provider.listLives({
      types: ["Certificate"],
    });
    assert(lives);
  });

  it("certificate apply plan", async function () {
    await testPlanDeploy({ provider, types: ["Certificate"] });

    const certificateLive = await certificate.getLive();
    assert(certificateLive);

    await testPlanDestroy({ provider });
  });
});
