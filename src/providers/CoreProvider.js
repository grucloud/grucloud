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

  const planFindDestroy = async (resources) =>
    (await doCommandOverEngines("planFindDestroy", resources)).map((data) => ({
      action: "DESTROY",
      data: data,
    }));

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
