const assert = require("assert");
const GoogleProvider = require("../GoogleProvider");
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
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }

    provider = await GoogleProvider({
      name: "google",
      config,
    });

    serviceAccount = await provider.makeServiceAccount({
      name: serviceAccountName,
      properties: () => ({
        serviceAccount: {
          displayName: serviceAccountDisplayName,
        },
      }),
    });

    const { success } = await provider.destroyAll();
    assert(success, "destroyAll failed");
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
    const lives = await provider.listLives({ types: "ServiceAccounts" });
    //assert(lives[0].resources.length >= 1);
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it("serviceAccount apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const serviceAccountLive = await serviceAccount.getLive();

    await testPlanDestroy({ provider });
  });
});
