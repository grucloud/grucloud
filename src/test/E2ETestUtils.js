const assert = require("assert");
const { isEmpty } = require("ramda");

const testList = async ({ provider }) => {
  const livesAll = await provider.listLives();
  assert(!isEmpty(livesAll));

  await testListByName({ provider, livesAll });
  await testListById({ provider, livesAll });
  await testListByType({ provider, livesAll });
};

const testListByName = async ({ provider, livesAll }) => {
  //Filter By Name
  const { name } = livesAll[0].resources[0];
  assert(name);
  const liveByName = await provider.listLives({
    name,
  });
  assert.equal(liveByName.length, 1);
  assert.equal(liveByName[0].resources[0].name, name);
};

const testListById = async ({ provider, livesAll }) => {
  //Filter By Id
  const { id } = livesAll[0].resources[0];
  assert(id);
  const live = await provider.listLives({
    id,
  });
  assert.equal(live.length, 1);
  assert.equal(live[0].resources[0].id, id);
};

const testListByType = async ({ provider, livesAll }) => {
  //Filter By Type
  const { type } = livesAll[0];
  const liveByType = await provider.listLives({
    types: [type],
  });
  assert.equal(liveByType.length, 1);
  assert.equal(liveByType[0].type, type);
};

const testPlanDestroy = async ({ provider }) => {
  {
    const { success } = await provider.destroyAll();
    assert(success);
  }
  {
    const plan = await provider.plan();
    assert(!provider.isPlanEmpty(plan));
  }
  const lives = await provider.listLives({
    our: true,
  });

  assert(isEmpty(lives));
};

exports.testPlanDestroy = testPlanDestroy;

exports.testProviderLifeCycle = async ({ provider }) => {
  await provider.listLives();
  await provider.listTargets();

  await testPlanDestroy({ provider });

  const plan = await provider.plan();
  assert(!provider.isPlanEmpty(plan));
  await provider.deployPlan(plan);

  {
    const plan = await provider.plan();
    assert(provider.isPlanEmpty(plan));
  }

  await testList({ provider });
  {
    const targets = await provider.listTargets();
    // must be our minion
  }
};
