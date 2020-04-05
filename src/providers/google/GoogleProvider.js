const ComputeResource = require("./resources/Compute");
module.exports = GoogleProvider = (config) => {
  console.log("GoogleProvider", config);

  const init = () => {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
    }
  };
  init();

  const resources = [
    {
      name: "compute",
      engine: ComputeResource(config),
    },
  ];

  const connect = async () => {
    console.log("GoogleProvider connect");
  };

  const list = async () => {
    console.log("GoogleProvider list resources");
    const lists = await Promise.all(
      resources.map((resource) => resource.engine.list())
    );
    console.log("GoogleProvider", lists);
  };

  return {
    connect,
    list,
    resource: (name) => {
      return resources.find((r) => r.name === name).engine;
    },
  };
};
