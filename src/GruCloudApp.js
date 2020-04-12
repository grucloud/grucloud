require("dotenv").config();

const GruCloud = (infra) => {
  const doCommand = async (command, ...options) =>
    Promise.all(
      infra.providers.map(
        async (provider) => await provider[command](...options)
      )
    );
  const providerByName = (name) =>
    infra.providers.find((provider) => provider.name() === name);

  const resourceByName = (type) =>
    infra.resources.find((resource) => resource.type === type);

  const getResourceEngine = ({ providerName, resourceType }) => {
    const provider = providerByName(providerName);
    if (!provider) {
      throw Error(`Cannot find provider ${providerName}`);
    }
    return provider.engineByType(resourceType);
  };

  const planFindDestroy = async (resources) =>
    (await doCommand("planFindDestroy", resources)).flat();

  /**
   * Find live resources to create or update based on the target resources
   * @function
   * @param {array} resources - The target resources
   */
  const planFindNewOrUpdate = async (resources = []) => {
    console.log("resources", resources);
    const plans = (
      await Promise.all(
        resources
          .filter((resource) => resource.api.methods.create)
          .map(async (resource) => {
            const plan = []; // = await engine.plan(resource);
            if (plan) {
              return {
                //TODO
                //provider: provider.name(),
                resource: resource.type,
                plan,
              };
            }
          })
      )
    ).filter((x) => x);
    return plans;
  };

  const plan = async () => {
    const { resources } = infra;
    const [destroy, newOrUpdate] = await Promise.all([
      await planFindDestroy(resources),
      await planFindNewOrUpdate(resources),
    ]);
    return { destroy, newOrUpdate };
  };

  const deployPlan = async (plan, option = {}) => {
    //console.log("deployPlan", JSON.stringify(plan, null, 4));
    await upsertResources(plan.newOrUpdate);
    await destroyResources(plan.destroy);
  };
  const upsertResources = async (newOrUpdate) => {
    //console.log("upsertResources", JSON.stringify(newOrUpdate, null, 4));
    await Promise.all(
      newOrUpdate.map(async (planItem) => {
        //console.log("upsertResources planItem", planItem);
        const engine = resourceByName(planItem.resource);
        await Promise.all(
          planItem.plan.map(async (resource) => {
            //console.log("create resource", resource.name, resource.config);
            await engine.client.create(resource.name, resource.config);
          })
        );
      })
    );
  };
  const destroyResources = async (planDestroy) => {
    //console.log("destroyResources", JSON.stringify(planDestroy, null, 4));
    await Promise.all(
      planDestroy.map(async (planItem) => {
        //console.log("destroyResources planItem", planItem);
        await Promise.all(
          planItem.data.map(async (resource) => {
            //console.log("destroyResources resource", resource);
            //find engineconst
            const engine = getResourceEngine({
              providerName: planItem.provider,
              resourceType: planItem.resource.type,
            });
            await engine.destroy(resource.name);
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
