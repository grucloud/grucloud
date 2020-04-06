const ComputeResource = require("./resources/Compute");

module.exports = GoogleProvider = ({ name, infra, config }) => {
  //console.log("GoogleProvider", config);

  const init = () => {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
    }
  };
  init();

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
    //console.log("GoogleProvider", JSON.stringify(lists, null, 4));
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
