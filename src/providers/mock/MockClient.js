const _ = require("lodash");

const resourceMap = new Map();

module.exports = MockClient = () => {
  const list = async () => ({ data: { items: [...resourceMap.values()] } });

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
  };
};
