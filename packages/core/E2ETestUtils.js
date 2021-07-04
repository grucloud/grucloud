const assert = require("assert");
const { switchCase, and } = require("rubico");
const { isEmpty } = require("rubico/x");
const logger = require("./logger")({ prefix: "TestUtils" });
const { tos } = require("./tos");
const cliCommands = require("./cli/cliCommands");

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
  const { results: livesAll } = provider.listLives();
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
  //TODO
  const { results: liveByName } = provider.listLives({
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
  const { results: live } = provider.listLives({
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
  const { results: liveByType } = provider.listLives({
    options: { types: [type] },
  });
  assert.equal(liveByType.length, 1, tos(liveByType));
  assert.equal(liveByType[0].type, type);
};

const testDestroyByName = async ({ provider, lives }) => {
  const { name } = lives.results[0].resources[0];
  assert(name);
  //TODO
  const plans = provider.planFindDestroy({
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
  const plans = provider.planFindDestroy({
    lives,
    options: {
      id,
    },
  });
  assert.equal(plans.length, 1);
  assert.equal(plans[0].resource.id, id);
};

const testDestroyByType = async ({ provider, lives }) => {
  const { type } = lives.results[0];
  const plans = provider.planFindDestroy({
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
  const infra = { provider };

  if (full) {
    const lives = provider.listLives({
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
    const result = await cliCommands.planDestroy({
      infra,
      commandOptions: { force: true, types },
    });
    assert(!result.error);
  }
  {
    const result = await cliCommands.planQuery({
      infra,
      commandOptions: {},
    });
    assert(!result.error);
    // assert(!isPlanEmpty(plan), "plan must not be empty after destroyAll");
  }
  {
    const result = await cliCommands.list({
      infra,
      commandOptions: { our: true, types },
    });
    assert(!result.error);
    //TODO check no live
  }

  logger.debug(`testPlanDestroy ${provider.name} DONE`);
};

exports.testPlanDestroy = testPlanDestroy;

exports.testPlanDeploy = async ({
  provider,
  types = [],
  full = false,
  destroy = true,
}) => {
  const infra = { provider };
  if (destroy) {
    const result = await cliCommands.planDestroy({
      infra,
      commandOptions: { force: true, types },
    });
    assert(!result.error);
  }
  {
    const result = await cliCommands.list({
      infra,
      commandOptions: { our: true, types },
    });
    assert(!result.error);
    //TODO check no live
  }
  {
    const result = await cliCommands.planQuery({
      infra,
      commandOptions: {},
    });
    assert(!result.error);
    // assert(!isPlanEmpty(plan), "plan must not be empty after destroyAll");
  }
  const resultApply = await cliCommands.planApply({
    infra,
    commandOptions: { force: true },
  });

  assert(!resultApply.error);
  // assert(!isPlanEmpty(plan), "plan must not be empty after destroyAll");
  {
    const result = await cliCommands.list({
      infra,
      commandOptions: { our: true, types },
    });
    assert(!result.error);
    //TODO check no live
  }
  {
    const result = await cliCommands.planQuery({
      infra,
      commandOptions: { force: true },
    });
    assert(!result.error);
    /*assert(
      isPlanEmpty(plan),
      `plan must be empty after a deploy: ${tos(plan)}`
    );*/
  }

  if (full) {
    await testList({ provider });
    {
      const targets = provider.listTargets();
      // must be our minion
    }
  }
  return resultApply;
};
