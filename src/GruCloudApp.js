require("dotenv").config();

const GruCloud = (infra) => {
  //console.log("GruCloud", utils.inspect(infra, null, 4));
  const providerMap = new Map(
    infra.providers.map((provider) => [
      provider.name,
      provider.engine(provider),
    ])
  );

  const providerEngines = [...providerMap.values()];

  const providerByName = (name) => {
    const provider = providerMap.get(name);
    if (!provider) {
      const availableProviders = `${infra.providers
        .map((provider) => provider.name)
        .join(", ")}`;
      throw new Error(
        `Cannot found provider: ${name}, available providers: ${availableProviders}`
      );
    }
    return provider;
  };

  const doCommand = async (command, options) =>
    Promise.all(
      providerEngines.map(async (provider) => await provider[command](options))
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
        const provider = providerByName(resource.provider);
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
