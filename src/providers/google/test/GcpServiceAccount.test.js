const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GcpServiceAccount", async function () {
  const serviceAccountName = "sa-test";
  const serviceAccountDisplayName = "Sa Display Name";
  let config;
  let provider;
  let serviceAccount;

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

    serviceAccount = await provider.makeServiceAccount({
      name: serviceAccountName,
      properties: () => ({
        serviceAccount: {
          displayName: serviceAccountDisplayName,
        },
      }),
    });

    const { error } = await provider.destroyAll();
    assert(!error, "destroyAll failed");
  });
  after(async () => {
    //await provider?.destroyAll();
  });
  it("serviceAccount config", async function () {
    const config = await serviceAccount.resolveConfig();
    assert(config);
    assert.equal(config.accountId, serviceAccountName);
    assert.equal(
      config.serviceAccount.description,
      provider.config().managedByDescription
    );
    assert.equal(config.serviceAccount.displayName, serviceAccountDisplayName);
  });
  it("lives", async function () {
    const { results: lives } = await provider.listLives({
      types: "ServiceAccounts",
    });
    //assert(lives[0].resources.length >= 1);
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 1);
  });
  it("serviceAccount apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const serviceAccountLive = await serviceAccount.getLive();

    const providerEmpty = await GoogleProvider({
      name: "google",
      config: config.google,
    });
    {
      const { error, results } = await providerEmpty.destroyAll();
      assert(!error, "destroyAll failed");
      assert.equal(results.length, 0);
    }
    {
      const { error, results } = await provider.destroyAll();
      assert(!error, "destroyAll failed");
      assert.equal(results.length, 1);
    }
  });
});
