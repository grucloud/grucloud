const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const cliCommands = require("@grucloud/core/cli/cliCommands");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("GcpServiceAccount", async function () {
  const types = ["ServiceAccount"];
  const serviceAccountName = "sa-test";
  const serviceAccountDisplayName = "Sa Display Name";
  let config;
  let provider;
  let serviceAccount;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }

    provider = GoogleProvider({
      name: "google",
      config: () => ({
        projectId: "grucloud-test",
      }),
    });

    serviceAccount = provider.makeServiceAccount({
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
      provider.config.managedByDescription
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
      config: () => ({
        projectId: "grucloud-test",
      }),
    });
    {
      const result = await cliCommands.planDestroy({
        infra: { provider: providerEmpty },
        commandOptions: { force: true, types },
      });
      assert(!result.error, "destroyAll failed");
    }
    {
      const result = await cliCommands.planDestroy({
        infra: { provider },
        commandOptions: { force: true, types, all: false },
      });
      assert(!result.error, "destroyAll failed");
    }
  });
});
