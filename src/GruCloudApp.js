require("dotenv").config();
const logger = require("logger")({ prefix: "App" });

const GruCloud = (infra) => {
  const doCommand = async (command, ...options) =>
    Promise.all(
      infra.providers.map(
        async (provider) => await provider[command](...options)
      )
    );
  const providerByName = (name) =>
    infra.providers.find((provider) => provider.name() === name);

  //TODO
  const resourceByType = (type) =>
    infra.resources.find((resource) => resource.type === type);

  const getResourceEngine = ({ providerName, resourceType }) => {
    const provider = providerByName(providerName);
    if (!provider) {
      throw Error(`Cannot find provider ${providerName}`);
    }
    //TODO engineByType
    return provider.clientByType(resourceType);
  };

  const planFindDestroy = async (resources) =>
    (await doCommand("planFindDestroy", resources)).flat();

  /**
   * Find live resources to create or update based on the target resources
   * @function
   * @param {array} resources - The target resources
   */
  const planFindNewOrUpdate = async (resources = []) => {
    logger.debug(`planFindNewOrUpdate: #resources ${resources.length}`);
    const plans = (
      await Promise.all(
        resources
          .filter((resource) => resource.api.methods.create)
          .map(async (resource) => {
            const plan = await resource.planFindNewOrUpdate({ resource });
            if (plan) {
              return {
                resource: resource.serialized(),
                plan,
              };
            }
          })
      )
    ).filter((x) => x);
    logger.debug(
      `planFindNewOrUpdate: plans": ${JSON.stringify(plans, null, 4)}`
    );
    return plans;
  };

  const plan = async () => {
    logger.debug(`plan `);
    const { resources } = infra;
    const [destroy, newOrUpdate] = await Promise.all([
      await planFindDestroy(resources),
      await planFindNewOrUpdate(resources),
    ]);
    logger.debug(`plan destroy ${JSON.stringify(destroy, null, 4)}`);
    logger.debug(`plan newOrUpdate ${JSON.stringify(newOrUpdate, null, 4)}`);

    return { destroy, newOrUpdate };
  };

  const deployPlan = async (plan, option = {}) => {
    logger.debug(`deployPlan ${JSON.stringify(plan, null, 4)}`);
    await upsertResources(plan.newOrUpdate);
    await destroyResources(plan.destroy);
  };
  const upsertResources = async (newOrUpdate) => {
    logger.debug(`upsertResources ${JSON.stringify(newOrUpdate, null, 4)}`);
    await Promise.all(
      newOrUpdate.map(async (planItem) => {
        const engine = resourceByType(planItem.resource.type);
        await Promise.all(
          planItem.plan.map(async ({ resource }) => {
            await engine.create({
              name: resource.name,
              options: await engine.config(),
            });
          })
        );
      })
    );
  };
  const destroyResources = async (planDestroy) => {
    //TODO
    logger.debug(`destroyResources ${JSON.stringify(planDestroy, null, 4)}`);
    await Promise.all(
      planDestroy.map(async (planItem) => {
        await Promise.all(
          planItem.data.map(async (resource) => {
            const client = getResourceEngine({
              providerName: planItem.provider,
              resourceType: planItem.resource.type,
            });
            await client.destroy(resource.name);
          })
        );
      })
    );
  };
  return {
    destroy: async (options) =>
      await doCommand("destroy", infra.resources, options),
    listTargets: async () => (await doCommand("listTargets")).flat(),
    listLives: async () => (await doCommand("listLives")).flat(),
    plan,
    deployPlan,
  };
};

module.exports = GruCloud;
