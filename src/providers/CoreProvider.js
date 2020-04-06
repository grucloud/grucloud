module.exports = CoreProvider = ({ name, type, engineResources, hooks }) => {
  const doCommandOverEngines = async (command, options) =>
    await Promise.all(
      engineResources.map(
        async (engineResource) => await engineResource.engine[command](options)
      )
    );

  const list = async () => {
    const lists = await Promise.all(
      engineResources.map(async (resource) => ({
        resource,
        data: await resource.engine.list(),
      }))
    );
    return lists;
  };

  const planFindDestroy = async (resources) => {
    console.log("planFindDestroy ", resources);
    const plans = (
      await Promise.all(
        engineResources.map(async ({ engine }) => {
          const hotResources = await engine.list();
          const resourcesName = resources.map((resource) => resource.name);
          const hasName = (names, nameToFind) =>
            names.some((name) => name === nameToFind);

          const plans = hotResources.filter(
            (hotResource) => !hasName(resourcesName, hotResource.name)
          );
          return plans;
        })
      )
    ).map((data) => ({
      action: "DESTROY",
      data: data,
    }));
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
    resource: (name) => {
      return engineResources.find((r) => r.name === name).engine;
    },
  };
};
