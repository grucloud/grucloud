require("dotenv").config();

const GruCloud = (infra) => {
  const doCommand = async (command, options) =>
    Promise.all(
      infra.providers.map(async (provider) => await provider[command](options))
    );

  const connect = async () => await doCommand("connect");
  const list = async () => (await doCommand("list")).flat();
  const planFindDestroy = async (resources) =>
    (await doCommand("planFindDestroy", resources)).flat();

  /**
   * Find live resources to create or update based on the target resources
   * @function
   * @param {array} resources - The target resources
   */
  const planFindNewOrUpdate = async (resources = []) => {
    const plans = await Promise.all(
      resources.map(async (resource) => {
        const provider = resource.provider;
        const engine = provider.engineByType(resource.type);
        const plan = await engine.plan(resource);
        return {
          resource,
          plan,
        };
      })
    );
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

  return {
    connect,
    list,
    plan,
  };
};

module.exports = GruCloud;
