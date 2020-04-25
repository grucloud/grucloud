const assert = require("assert");

exports.testProviderLifeCycle = async ({ provider }) => {
  await provider.listLives();
  const plan = await provider.plan();

  await provider.deployPlan(plan);
  {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 0);
  }

  //TODO destroy
};
