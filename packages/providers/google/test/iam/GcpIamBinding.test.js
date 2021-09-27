const assert = require("assert");
const { GoogleProvider } = require("../../GoogleProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const chance = require("chance")();
const { Cli } = require("@grucloud/core/cli/cliCommands");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("GcpIamBinding", async function () {
  let cli;
  let config;
  let provider;
  let iamBindingServiceAccount;
  let serviceAccount;
  const types = ["Binding"];
  const roleEditor = "roles/editor";

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }

    provider = GoogleProvider({
      config: () => ({
        projectId: "grucloud-test",
      }),
    });

    const saName = `sa-${chance.guid().slice(0, 15)}`;
    serviceAccount = provider.iam.makeServiceAccount({
      name: saName,
      properties: () => ({
        accountId: saName,
      }),
    });
    iamBindingServiceAccount = provider.iam.makeBinding({
      name: roleEditor,
      dependencies: { serviceAccounts: [serviceAccount] },
      properties: ({}) => ({}),
    });

    await provider.start();
  });
  after(async () => {});
  it("iamBinding apply and destroy", async function () {
    {
      const cli = await Cli({
        createStack: () => ({ provider }),
      });

      const resultApply = await cli.planApply({
        commandOptions: { force: true },
      });

      const live = await iamBindingServiceAccount.getLive();
      assert(live.members);
      assert(live.role);
    }
    {
      const provider = GoogleProvider({
        config: () => ({
          projectId: "grucloud-test",
        }),
      });
      const cli = await Cli({
        createStack: () => ({ provider }),
      });

      const saName = `sa-${chance.guid().slice(0, 15)}`;
      const serviceAccount = provider.iam.makeServiceAccount({
        name: saName,
        properties: () => ({
          accountId: saName,
        }),
      });
      const iamBindingServiceAccount = provider.iam.makeBinding({
        name: roleEditor,
        dependencies: { serviceAccounts: [serviceAccount] },
        properties: ({}) => ({}),
      });

      {
        const { error, resultQuery } = await cli.planQuery({
          commandOptions: { force: true },
        });
        assert(!error, "planQuery failed");
        const plan = resultQuery.results[0];
        assert.equal(plan.resultDestroy.length, 0);
        assert.equal(plan.resultCreate.length, 2);
        const planCreate = plan.resultCreate[0];
        assert.equal(planCreate.action, "UPDATE");
      }
    }

    await testPlanDestroy({ provider, types });
  });

  it("iamBindingEmail", async function () {
    const provider = GoogleProvider({
      config: () => ({
        projectId: "grucloud-test",
      }),
    });
    const cli = await Cli({
      createStack: () => ({ provider }),
    });
    const email = "user:joe@gmail.com";
    const iamBindingEmail = provider.iam.makeBinding({
      name: roleEditor,
      properties: ({}) => ({ members: [email] }),
    });

    try {
      {
        const result = await cli.planApply({
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
