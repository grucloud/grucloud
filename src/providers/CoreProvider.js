module.exports = CoreProvider = ({ name, type, engineResources, hooks }) => {
  const list = async () => {
    const lists = await Promise.all(
      engineResources.map(async (resource) => ({
        resource,
        data: await resource.list(),
      }))
    );
    return lists;
  };

  const planFindDestroy = async (resources = []) => {
    const plans = (
      await Promise.all(
        engineResources.map(async (engine) => {
          const hotResources = await engine.list();
          const resourceNames = resources.map((resource) => resource.name);
          const hotResourcesToDestroy = hotResources.filter(
            (hotResource) => !resourceNames.includes(hotResource.name)
          );

          if (hotResourcesToDestroy.length > 0) {
            return {
              provider: name,
              engine,
              data: hotResourcesToDestroy,
            };
          }
          return;
        })
      )
    ).filter((x) => x);
    return plans;
  };

  if (hooks && hooks.init) {
    hooks.init();
  }

  return {
    name: () => name,
    type: () => type || name,
    hooks,
    planFindDestroy,
    list,
    engineByType: (type) => {
      const resourceEngine = engineResources.find((r) => r.type === type);
      if (!resourceEngine) {
        throw new Error(`Cannot find engine type: ${type}`);
      }
      return resourceEngine;
    },
  };
};
