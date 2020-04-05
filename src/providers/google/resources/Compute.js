const Compute = require("@google-cloud/compute");

module.exports = (config) => {
  console.log("Google Compute ", config);
  const compute = new Compute();

  const list = async () => {
    console.log("google compute list");
    const options = {
      maxResults: 10000,
    };
    const response = await compute.getVMs(options);
    //console.log(JSON.stringify(vms, 4, null));
    return response[0];
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
    return;
  };
  return {
    get,
    list,
    create,
    destroy,
  };
};
