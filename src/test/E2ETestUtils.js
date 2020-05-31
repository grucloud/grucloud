const assert = require("assert");

exports.testProviderLifeCycle = async ({ provider }) => {
  await provider.listLives();
  await provider.listTargets();

  const plan = await provider.plan();

  await provider.deployPlan(plan);
  {
    const targets = await provider.listTargets();
    // must be our minion
  }
  {
    const plan = await provider.plan();
    assert(provider.isPlanEmpty(plan));
  }
  {
    const { success } = await provider.destroyAll();
    assert(success);
  }
  {
    const plan = await provider.plan();
    assert(!provider.isPlanEmpty(plan));
  }
};
