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

const testDestroyByName = async ({ provider, livesAll }) => {
  const { name } = livesAll[0].resources[0];
  assert(name);
  const plan = await provider.planFindDestroy({
    name,
  });
  assert.equal(plan.length, 1);
  assert.equal(plan[0].resource.name, name);
};

const testDestroyById = async ({ provider, livesAll }) => {
  const { id } = livesAll[0].resources[0];
  assert(id);
  const plan = await provider.planFindDestroy({
    id,
  });
  assert.equal(plan.length, 1);
  assert.equal(plan[0].resource.id, id);
};

const testDestroyByType = async ({ provider, livesAll }) => {
  const { type } = livesAll[0];
  const plan = await provider.planFindDestroy({
    types: [type],
  });
  assert.equal(plan.length, 1);
  assert.equal(plan[0].resource.type, type);
};

const testPlanDestroy = async ({ provider }) => {
  const livesAll = await provider.listLives({ our: true });
  assert(!isEmpty(livesAll));

  await testDestroyByName({ provider, livesAll });
  await testDestroyById({ provider, livesAll });
  await testDestroyByType({ provider, livesAll });

  {
    const { success } = await provider.destroyAll();
    assert(success);
  }
  {
    const plan = await provider.planQuery();
    assert(!provider.isPlanEmpty(plan));
  }
  const lives = await provider.listLives({
    our: true,
  });

  assert(isEmpty(lives));
};

exports.testPlanDestroy = testPlanDestroy;

exports.testPlanDeploy = async ({ provider }) => {
  await provider.listLives();
  await provider.listTargets();

  {
    const { success } = await provider.destroyAll();
    assert(success);
  }

  const plan = await provider.planQuery();
  assert(!provider.isPlanEmpty(plan));
  await provider.planApply(plan);

  await provider.listLives({ our: true });

  {
    const plan = await provider.planQuery();
    assert(provider.isPlanEmpty(plan));
  }

  await testList({ provider });
  {
    const targets = await provider.listTargets();
    // must be our minion
  }
};
