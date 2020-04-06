const _ = require("lodash");

const configDefault = {
  compute: {
    machines: [],
  },
};

module.exports = ({ config }) => {
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
  //TODO get this out
  const planFindDestroy = async (resources) => {
    const hotResources = await list();
    const resourcesName = resources.map((resource) => resource.name);
    const hasName = (names, nameToFind) =>
      names.some((name) => name === nameToFind);

    const plans = hotResources.filter(
      (hotResource) => !hasName(resourcesName, hotResource.name)
    );
    return plans;
  };

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
    get,
    list,
    create,
    destroy,
    planFindDestroy,
    plan,
  };
};
