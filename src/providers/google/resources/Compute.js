const Compute = require("@google-cloud/compute");

const type = "compute";

module.exports = ({ name, provider }, config) => {
  //console.log("Google Compute ", config);
  const compute = new Compute();

  const list = async (options) => {
    const [vmList] = await compute.getVMs(options);
    return vmList;
  };
  const create = async (name, options) => {
    console.log("google create vm", name, options);
    const zone = compute.zone(config.zone);
    const [vm, operation] = await zone.createVM(name, options);
    await operation.promise();
    console.log("google create vm created", name, options);
    return vm;
  };

  const get = async (name, options) => {
    const zone = compute.zone(config.zone);
    const vm = zone.vm(name);
    const [instance] = await vm.get(options);
    return instance;
  };

  const destroy = async (name) => {
    console.log("google destroying", name);
    const zone = compute.zone(config.zone);
    const vm = zone.vm(name);
    const [operation] = await vm.delete();
    await operation.promise();
    console.log("google destroyed ", name);
  };

  const plan = async (resource) => {
    try {
      const { metadata } = await get(resource.name);
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
    get,
    list,
    create,
    destroy,
    plan,
  };
};
