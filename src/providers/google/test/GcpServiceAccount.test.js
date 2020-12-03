const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GcpServiceAccount", async function () {
  const types = ["ServiceAccount"];
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

    provider = GoogleProvider({
      name: "google",
      config: config.google,
    });
    await provider.start();

    serviceAccount = await provider.makeServiceAccount({
      name: serviceAccountName,
      properties: () => ({
        serviceAccount: {
          displayName: serviceAccountDisplayName,
        },
      }),
    });
  });
  after(async () => {});
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

  it("serviceAccount apply and destroy", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 1, destroy: 0 },
    });

    const serviceAccountLive = await serviceAccount.getLive();
    assert(serviceAccountLive);

    const providerEmpty = GoogleProvider({
      config: config.google,
    });
    {
      const { error, results } = await providerEmpty.destroyAll({
        all: false,
        types,
      });
      assert(!error, "destroyAll failed");
      assert.equal(results.length, 0);
    }
    {
      const { error, results } = await provider.destroyAll({
        all: false,
        types,
      });
      assert(!error, "destroyAll failed");
      assert.equal(results.length, 1);
    }
  });
});
