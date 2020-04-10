const checkEnv = (env = []) =>
  env.forEach((env) => {
    console.log(env);
    if (!process.env[env]) {
      throw new Error(`Please set the environment variable ${env}`);
    }
  });

module.exports = CoreProvider = ({
  name,
  type,
  envs = [],
  engineResources,
  hooks,
  config,
}) => {
  const targetResources = new Map();
  const targetResourcesAdd = (resource) =>
    targetResources.set(resource.name, resource);

  const listLives = async () => {
    const lists = (
      await Promise.all(
        engineResources.map(async (resource) => ({
          resource,
          data: (await resource.client.list()).data,
        }))
      )
    ).filter((liveResources) => liveResources.data.items.length > 0);
    console.log("listLives", lists);
    return lists;
  };
  const listTargets = async (resources) => {
    const lists = (
      await Promise.all(
        [...targetResources.values()].map(
          async (resource) => (await resource.client.list()).data
        )
      )
    )
      .filter((liveResources) => liveResources.items.length > 0)
      .map((data) => ({
        //TODO
        data,
      }));
    console.log("listTargets", lists);
    return lists;
  };

  const destroy = async (resources, options = {}) => {
    //console.log("destroy");
    if (options.all) {
      await Promise.all(
        engineResources.map(async (resource) => ({
          resource,
          data: await resource.client.destroy(),
        }))
      );
    } else {
      await Promise.all(
        resources.map(async (resource) => ({
          resource,
          data: await resource.client.destroy(),
        }))
      );
    }
  };

  const planFindDestroy = async (resources = []) => {
    const plans = (
      await Promise.all(
        engineResources.map(async (engine) => {
          const { data } = await engine.client.list();
          const hotResources = data.items;
          const resourceNames = resources.map((resource) => resource.name);
          const hotResourcesToDestroy = hotResources.filter(
            (hotResource) => !resourceNames.includes(hotResource.name)
          );

          if (hotResourcesToDestroy.length > 0) {
            return {
              provider: name,

              resource: engine,
              data: hotResourcesToDestroy,
            };
          }
          return;
        })
      )
    ).filter((x) => x);
    return plans;
  };

  checkEnv(envs);
  if (hooks && hooks.init) {
    hooks.init();
  }

  return {
    config,
    name: () => name,
    type: () => type || name,
    hooks,
    destroy,
    planFindDestroy,
    listLives,
    listTargets,
    targetResourcesAdd,
    engineByType: (type) => {
      const resourceEngine = engineResources.find((r) => r.type === type);
      if (!resourceEngine) {
        throw new Error(`Cannot find engine type: ${type}`);
      }
      return resourceEngine;
    },
  };
};
