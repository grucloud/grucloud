require("dotenv").config();
const utils = require("util");

const GruCloud = (infra) => {
  //console.log("GruCloud", utils.inspect(infra, null, 4));

  const providerMap = new Map(
    infra.providers.map((provider) => [
      provider.name,
      provider.engine({ name: provider.name, infra, config: provider.config }),
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

  const planFindDestroy = async (resources) => {
    console.log("planFindDestroy resources ", resources);
    const hotResources = await list();
    console.log("planFindDestroy hotResources", hotResources);

    const resourcesName = resources.map((resource) => resource.name);
    const hasName = (names, nameToFind) =>
      names.some((name) => name === nameToFind);

    const plans = hotResources
      .map((hotResource) => {
        console.log("planFindDestroy", hotResource);

        const destroyResources = hotResource.liveItems.filter(
          (liveItem) => !hasName(resourcesName, liveItem.name)
        );
        console.log("destroyResources", destroyResources);
        return destroyResources;
      })
      .flat()
      .map((liveItems) => ({
        action: "DESTROY",
        liveItems,
      }));

    console.log(plans);
    return plans;
  };

  const planFindNewOrUpdate = async (resources) => {
    const plans = await Promise.all(
      resources.map(async (resource) => {
        console.log(resource);
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
        console.log(plan);
        return {
          resource,
          plan,
        };
        // What we need to delete
      })
    );
    return plans;
  };

  const plan = async () => {
    const { resources } = infra;
    console.log("plan", resources);
    const [destroy, newOrUpdate] = await Promise.all([
      await planFindDestroy(resources),
      await planFindNewOrUpdate(resources),
    ]);
    const plans = [...destroy, newOrUpdate];
    console.log(JSON.stringify(plans));
  };

  return {
    connect,
    list,
    plan,
  };
};

module.exports = GruCloud;
