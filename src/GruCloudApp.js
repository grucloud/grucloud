require("dotenv").config();

const GruCloud = (infra) => {
  //console.log("GruCloud", utils.inspect(infra, null, 4));

  const providerMap = new Map(
    infra.providers.map((provider) => [
      provider.name,
      provider.engine(provider),
    ])
  );

  const doCommand = async (command, options) =>
    Promise.all(
      [...providerMap.values()].map(async (provider) => {
        return await provider[command](options);
      })
    );

  const connect = async () => await doCommand("connect");
  const list = async () => (await doCommand("list")).flat();

  const planFindNewOrUpdate = async (resources) => {
    const plans = await Promise.all(
      resources.map(async (resource) => {
        const provider = providerMap.get(resource.provider);
        if (!provider) {
          const availableProviders = `${[...providerMap.values()]
            .map((provider) => provider.name)
            .join(", ")}`;
          throw new Error(
            `resource ${resource.name} has an invalid provider: ${resource.provider}, available providers: ${availableProviders}`
          );
        }
        const resourceEngine = provider.resource(resource.type);
        if (!resourceEngine) {
          throw new Error(
            `resource ${resource.name} has an invalid type: ${resource.type}`
          );
        }
        const plan = await resourceEngine.plan(resource);
        return {
          resource,
          plan,
        };
        // What we need to delete
      })
    );
    return plans;
  };

  const planFindDestroy = async (resources) =>
    (await doCommand("planFindDestroy", resources)).flat();

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
