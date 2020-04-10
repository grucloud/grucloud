const GoogleClient = require("../GoogleClient");
const type = "address";

//compute.googleapis.com/compute/v1/projects/{project}/regions/{region}/addresses/{resourceId}

module.exports = ({ name, provider }, config) => {
  //console.log("Google Address ", config);
  const { project, region } = config;
  const client = GoogleClient({
    config,
    url: `/projects/${project}/regions/${region}/addresses/`,
  });

  const plan = async (resource) => {
    try {
      const { address } = await client.get(resource.name);
      // Is the same machine type?
      const sameMachineType = (config, metadata) =>
        metadata.machineType.endsWith(config.machineType);

      // Is it running ?
      const sameStatus = (config, metadata) => metadata.status === "RUNNING";

      const isSame = (config, metadata) =>
        sameMachineType(config, metadata) && sameStatus(config, metadata);
      if (!isSame(resource.config, metadata)) {
        return [
          {
            action: "RECREATE",
            resource,
            metadata,
          },
        ];
      }

      return [];
    } catch (ex) {
      console.log(`resource ${resource.name} not found `);
      return [
        {
          action: "CREATE",
          resource,
        },
      ];
    }
  };

  return {
    name,
    type,
    provider,
    client,
    plan,
  };
};
