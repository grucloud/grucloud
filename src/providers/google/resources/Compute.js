const Compute = require("@google-cloud/compute");

module.exports = ({ config }) => {
  //console.log("Google Compute ", config);
  const compute = new Compute();

  const list = async (options) => {
    console.log("google compute list");
    const [vmList] = await compute.getVMs(options);
    //console.log(JSON.stringify(vms, 4, null));
    console.log("vmList", vmList);
    return vmList;
  };
  const create = async (name, options) => {
    console.log("google create", name, options);
    const zone = compute.zone(config.zone);
    const [vm, operation] = await zone.createVM(name, options);
    console.log(vm);
    await operation.promise();
    console.log("google create vm created!");
    return vm;
  };

  const get = async (name, options) => {
    const zone = compute.zone(config.zone);
    const vm = zone.vm(name);
    const [instance] = await vm.get(options);
    console.log("google compute, get", name, instance);
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

  const planFindDestroy = async (hotResource) => {
    console.log("planFindDestroy ", resource, hotResource);
  };

  const plan = async (resource) => {
    console.log("plan ", resource);

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
    get,
    list,
    create,
    destroy,
    plan,
  };
};
