const assert = require("assert");
const { switchCase, and } = require("rubico");
const { isEmpty } = require("rubico/x");
const logger = require("../logger")({ prefix: "TestUtils" });
const { tos } = require("../tos");

const isPlanEmpty = switchCase([
  and([
    (plan) => isEmpty(plan.resultDestroy),
    (plan) => isEmpty(plan.resultCreate),
  ]),
  () => true,
  () => false,
]);

exports.isPlanEmpty = isPlanEmpty;

const testList = async ({ provider }) => {
  const { results: livesAll } = await provider.listLives();
  assert(!isEmpty(livesAll));

  await testListByName({ provider, livesAll });
  await testListById({ provider, livesAll });
  await testListByType({ provider, livesAll });
};

const testListByName = async ({ provider, livesAll }) => {
  //Filter By Name
  const { name } = livesAll[0].resources.filter(
    (resources) => resources.name
  )[0];
  assert(name);
  const { results: liveByName } = await provider.listLives({
    options: {
      name,
    },
  });
  assert(liveByName.length >= 1);
  assert.equal(liveByName[0].resources[0].name, name);
};

const testListById = async ({ provider, livesAll }) => {
  //Filter By Id
  const { id } = livesAll[0].resources[0];
  assert(id);
  const { results: live } = await provider.listLives({
    options: {
      id,
    },
  });
  assert(live.length >= 1);
  assert.equal(live[0].resources[0].id, id);
};

const testListByType = async ({ provider, livesAll }) => {
  //Filter By Type
  const { type } = livesAll[0];
  const { results: liveByType } = await provider.listLives({
    options: { types: [type] },
  });
  assert.equal(liveByType.length, 1, tos(liveByType));
  assert.equal(liveByType[0].type, type);
};
// TODO remove livesAll
const testDestroyByName = async ({ provider, lives }) => {
  const { name } = lives.results[0].resources[0];
  assert(name);
  const { plans } = await provider.planFindDestroy({
    lives,
    options: {
      name,
    },
  });
  assert.equal(plans.length, 1, tos(plans));
  assert.equal(plans[0].resource.name, name);
};

const testDestroyById = async ({ provider, lives }) => {
  const { id } = lives.results[0].resources[0];
  assert(id);
  const { error, plans } = await provider.planFindDestroy({
    lives,
    options: {
      id,
    },
  });
  assert(!error);
  assert.equal(plans.length, 1);
  assert.equal(plans[0].resource.id, id);
};

const testDestroyByType = async ({ provider, lives }) => {
  const { type } = lives.results[0];
  const { plans } = await provider.planFindDestroy({
    lives,
    options: {
      types: [type],
    },
  });
  assert(plans.length >= 1);
  assert.equal(plans[0].resource.type, type);
};

const testPlanDestroy = async ({ provider, types = [], full = false }) => {
  logger.debug(`testPlanDestroy ${provider.name}`);

  if (full) {
    const lives = await provider.listLives({
      options: {
        our: true,
        canBeDeleted: true,
        types,
      },
    });
    assert(!isEmpty(lives));
    await testDestroyByName({ provider, lives });
    await testDestroyById({ provider, lives });
    await testDestroyByType({ provider, lives });
  }
  {
    const { error } = await provider.destroyAll({
      options: { types },
    });
    assert(!error, "testPlanDestroy destroyAll failed");
  }
  {
    const plan = await provider.planQuery();
    assert(!isPlanEmpty(plan), "plan must no be empty after a destroy");
  }
  {
    const { results: lives } = await provider.listLives({
      options: {
        our: true,
        types,
      },
    });

    assert(isEmpty(lives), tos(lives));
    logger.debug(`testPlanDestroy ${provider.name} DONE`);
  }
};

exports.testPlanDestroy = testPlanDestroy;

exports.testPlanDeploy = async ({ provider, types = [], full = false }) => {
  await provider.start();
  {
    const result = await provider.destroyAll({ options: { types } });
    assert(!result.error, `testPlanDeploy destroyAll failed: ${tos(result)}`);
  }
  {
    const { results: lives } = await provider.listLives({
      options: { our: true, types },
    });

    assert(isEmpty(lives), `shoud be empty after destroy, lives:${tos(lives)}`);
  }
  {
    const plan = await provider.planQuery();
    assert(!plan.error, tos(plan));
    assert(!isPlanEmpty(plan), "plan must not be empty after destroyAll");
    const resultApply = await provider.planApply({ plan });
    const { error, resultCreate } = resultApply;
    assert(resultCreate);
    assert(!error, `planApply failed: ${tos(resultApply)}`);
  }
  {
    const { results: lives } = await provider.listLives({
      options: { our: true, types },
    });

    assert(!isEmpty(lives), `shoud not be empty after an apply`);
  }
  {
    const plan = await provider.planQuery();
    assert(!plan.error, tos(plan));
    assert(
      isPlanEmpty(plan),
      `plan must be empty after a deploy: ${tos(plan)}`
    );
  }
  if (full) {
    await testList({ provider });
    {
      const targets = await provider.listTargets();
      // must be our minion
    }
  }
};
