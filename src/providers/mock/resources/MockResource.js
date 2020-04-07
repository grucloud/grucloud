const _ = require("lodash");

const type = "mock";

const configDefault = {
  compute: {
    machines: [],
  },
};

module.exports = ({ name, provider }, config) => {
  config = _.defaults(config, configDefault);

  const list = async (options) => {
    return config.compute.machines;
  };

  const create = async (name, options) => {
    return options;
  };

  const get = async (name, options) => {
    return {};
  };

  const destroy = async (name) => {};

  const plan = async (resource) => {
    const { metadata } = await get(resource.name);

    return [
      {
        action: "RECREATE",
        resource,
        metadata,
      },
    ];
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
