const _ = require("lodash");

const type = "mock";

const configDefault = {
  initialState: [],
  createOption: {
    machineType: "f1-micro",
  },
};

const resourceMap = new Map();

module.exports = ({ name = "MockResource", provider }, config) => {
  config = _.defaults(config, configDefault);

  const list = async () => {
    return [...resourceMap.values()];
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

  const plan = async (resource) => {
    console.log("plan resource", resource);
    const liveResource = await get(resource.name);

    if (!liveResource) {
      console.log("Cannot find live resource", resource);
      return [
        {
          action: "CREATE",
          name: resource.name,
          config: resource.config.createOption,
        },
      ];
    } else {
      console.log("plan TODO ", resource);
      if (false) {
        return [
          {
            action: "RECREATE",
          },
        ];
      }
    }
  };

  return {
    name,
    config,
    type,
    provider,
    get,
    list,
    create,
    destroy,
    destroyAll,
    plan,
  };
};
