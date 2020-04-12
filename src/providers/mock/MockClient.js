const _ = require("lodash");

module.exports = MockClient = ({ name, initState }) => {
  const resourceMap = new Map(initState);
  //console.log("init ", name, [...resourceMap.values()]);
  const list = async () => {
    //console.log("list", name, [...resourceMap.values()]);
    return { data: { items: [...resourceMap.values()] } };
  };

  const create = async (name, options) => {
    const resource = { name, ...options };
    resourceMap.set(name, resource);
    return resource;
  };

  const get = async (name, options) => {
    return resourceMap.get(name);
  };

  const destroy = async (name) => {
    resourceMap.delete(name);
  };

  const destroyAll = async () => {
    const all = await list();
    resourceMap.clear();
    return all;
  };

  return {
    get,
    list,
    create,
    destroy,
    destroyAll,
    reset: () => resourceMap.clear(),
  };
};
