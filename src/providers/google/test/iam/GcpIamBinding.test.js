const assert = require("assert");
const { GoogleProvider } = require("../../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");
const chance = require("chance")();
const cliCommands = require("../../../../cli/cliCommands");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../../test/E2ETestUtils");

describe("GcpIamBinding", async function () {
  let config;
  let provider;
  let iamBindingServiceAccount;
  let serviceAccount;
  const types = ["IamBinding"];
  const roleEditor = "roles/editor";

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }

    provider = GoogleProvider({
      config: config.google,
    });

    await provider.start();

    const saName = `sa-${chance.guid().slice(0, 15)}`;
    serviceAccount = await provider.makeServiceAccount({
      name: saName,
      properties: () => ({
        accountId: saName,
      }),
    });
    iamBindingServiceAccount = await provider.makeIamBinding({
      name: roleEditor,
      dependencies: { serviceAccounts: [serviceAccount] },
      properties: ({}) => ({}),
    });
  });
  after(async () => {});
  it("iamBinding config", async function () {
    const iamBindingLive = await iamBindingServiceAccount.getLive();
    const config = await iamBindingServiceAccount.resolveConfig({
      live: iamBindingLive,
    });
  });
  it("iamBinding apply and destroy", async function () {
    const resultApply = await cliCommands.planApply({
      infra: { provider },
      commandOptions: { force: true },
    });

    const live = await iamBindingServiceAccount.getLive();
    assert(live.members);
    assert(live.role);
    {
      const provider = GoogleProvider({
        config: config.google,
      });

      const saName = `sa-${chance.guid().slice(0, 15)}`;
      const serviceAccount = await provider.makeServiceAccount({
        name: saName,
        properties: () => ({
          accountId: saName,
        }),
      });
      const iamBindingServiceAccount = await provider.makeIamBinding({
        name: roleEditor,
        dependencies: { serviceAccounts: [serviceAccount] },
        properties: ({}) => ({}),
      });

      {
        const { error, resultQuery } = await cliCommands.planQuery({
          infra: { provider },
          commandOptions: { force: true, types },
        });
        assert(!error, "planQuery failed");
        const plan = resultQuery.results[0];
        assert.equal(plan.resultDestroy.length, 0);
        assert.equal(plan.resultCreate.length, 2);
        const planCreate = plan.resultCreate[1];
        assert.equal(planCreate.action, "UPDATE");
      }
    }

    await testPlanDestroy({ provider, types });
  });

  it("iamBindingEmail", async function () {
    const provider = GoogleProvider({
      config: config.google,
    });

    const email = "user:joe@gmail.com";
    const iamBindingEmail = await provider.makeIamBinding({
      name: roleEditor,
      properties: ({}) => ({ members: [email] }),
    });

    try {
      {
        const result = await cliCommands.planApply({
          infra: { provider },
          commandOptions: { force: true },
        });
        assert("should not be here");
      }
    } catch (error) {
      const resultCreate = error.error.resultDeploy.results[0].resultCreate;
      assert.equal(resultCreate.results[0].error.Status, 400);
      assert.equal(
        resultCreate.results[0].error.Output.error.status,
        "INVALID_ARGUMENT"
      );
    }
  });
});
