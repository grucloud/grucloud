const ComputeResource = require("./resources/Compute");

module.exports = MockProvider = ({ name, infra, config }) => {
  //console.log("MockProvider", config);

  const engineResources = [
    {
      name: "compute",
      engine: ComputeResource({ config }),
    },
  ];

  const doCommandOverEngines = async (command, options) =>
    await Promise.all(
      engineResources.map(
        async (engineResource) => await engineResource.engine[command](options)
      )
    );

  const planFindDestroy = async (resources) =>
    (await doCommandOverEngines("planFindDestroy", resources)).map((data) => ({
      action: "DESTROY",
      data: data,
    }));

  const list = async () => {
    const lists = await Promise.all(
      engineResources.map(async (resource) => ({
        resource,
        data: await resource.engine.list(),
      }))
    );
    //console.log("MockProvider", JSON.stringify(lists, null, 4));
    return lists;
  };

  return {
    name,
    list,
    resource: (name) => {
      return engineResources.find((r) => r.name === name).engine;
    },
    planFindDestroy,
  };
};
