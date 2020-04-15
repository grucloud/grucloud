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

  const resourceFind = ({ provider, name }) =>
    providerByName(provider).resourceByName(name);

  const getResourceEngine = ({ providerName, resourceType }) => {
    const provider = providerByName(providerName);
    if (!provider) {
      throw Error(`Cannot find provider ${providerName}`);
    }
    return provider.clientByType(resourceType);
  };

  const deployPlan = async (plans, option = {}) => {
    logger.debug(`deployPlan ${JSON.stringify(plans, null, 4)}`);
    await Promise.all(
      plans.map(async (plan) => {
        await upsertResources(plan.newOrUpdate);
        await destroyResources(plan.destroy);
      })
    );
  };

  const upsertResources = async (newOrUpdate = []) => {
    logger.debug(`upsertResources ${JSON.stringify(newOrUpdate, null, 4)}`);
    await Promise.all(
      newOrUpdate.map(async (planItem) => {
        const engine = resourceFind(planItem.resource);
        if (!engine) {
          throw Error(
            `Cannot find resource ${JSON.stringify(planItem.resource, null, 4)}`
          );
        }
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
    destroy: async () => (await doCommand("destroy")).flat(),
    listTargets: async () => (await doCommand("listTargets")).flat(),
    listLives: async () => (await doCommand("listLives")).flat(),
    plan: async () => (await doCommand("plan")).flat(),
    deployPlan,
  };
};

module.exports = GruCloud;
