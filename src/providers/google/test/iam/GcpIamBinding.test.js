const assert = require("assert");
const { GoogleProvider } = require("../../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");
const { pipe, tap, map, get, filter } = require("rubico");
const { find, isDeepEqual } = require("rubico/x");
const chance = require("chance")();

describe("GcpIamBinding", async function () {
  let config;
  let provider;
  let iamBindingServiceAccount;
  let serviceAccount;
  const roleEditor = "roles/editor";

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

    const { error } = await provider.destroyAll();
    assert(!error, "destroyAll failed");
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("iamBinding config", async function () {
    const iamBindingLive = await iamBindingServiceAccount.getLive();
    const config = await iamBindingServiceAccount.resolveConfig({
      live: iamBindingLive,
    });
  });
  it("lives", async function () {
    const { results: lives } = await provider.listLives({
      types: "IamBinding",
    });
    assert(lives[0].resources.length >= 1);
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 2);
    const planCreate = plan.resultCreate.plans[1];
    assert.equal(planCreate.action, "CREATE");
    assert.equal(planCreate.config.role, roleEditor);
  });
  it("iamBinding apply and destroy", async function () {
    const { error, resultCreate } = await provider.planQueryAndApply();
    assert(!error, "should not have failed");
    const live = await iamBindingServiceAccount.getLive();
    assert(live.members);
    assert(live.role);
    {
      const provider = await GoogleProvider({
        name: "google",
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
      const plan = await provider.planQuery();
      assert.equal(plan.resultDestroy.plans.length, 1);
      assert.equal(plan.resultCreate.plans.length, 2);
      const planCreate = plan.resultCreate.plans[1];
      assert.equal(planCreate.action, "UPDATE");
    }
  });

  it("iamBindingEmail", async function () {
    const provider = await GoogleProvider({
      name: "google",
      config: config.google,
    });
    const email = "user:joe@gmail.com";
    const iamBindingEmail = await provider.makeIamBinding({
      name: roleEditor,
      properties: ({}) => ({ members: [email] }),
    });

    const { error, resultCreate } = await provider.planQueryAndApply();
    assert(error, "should have failed");
    assert.equal(resultCreate.results[0].error.Status, 400);
    assert.equal(
      resultCreate.results[0].error.Output.error.status,
      "INVALID_ARGUMENT"
    );
  });
});
