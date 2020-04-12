const _ = require("lodash");
const checkEnvironment = require("../Utils").checkEnvironment;
const returnUndefined = (x) => undefined;
const returnConfig = ({ config }) => config;

const specDefault = {
  preConfig: returnUndefined,
  postConfig: returnConfig,
  methods: {
    get: true,
    list: true,
    create: true,
    del: true,
  },
};

const ResourceMaker = ({
  type,
  name,
  dependencies,
  client,
  userConfig,
  api,
  provider,
}) => {
  return {
    type,
    provider,
    name,
    api,
    client,
    config: async () => {
      const preConfig = api.preConfig;
      const postConfig = api.postConfig;
      const items = await preConfig({ client });
      const config = await userConfig({ dependencies, items });
      return postConfig({ config, items, dependencies });
    },
  };
};

const createResourceMakers = ({ apis, config, provider, Client }) =>
  apis(config).reduce((acc, api) => {
    acc[`make${api.name}`] = (options, userConfig) => {
      const resource = ResourceMaker({
        type: api.name,
        ...options,
        userConfig,
        api: _.defaults(api, specDefault),
        provider,
        client: Client(api, config),
      });
      provider.targetResourcesAdd(resource);
      return resource;
    };
    return acc;
  }, {});

module.exports = CoreProvider = ({
  name,
  type,
  envs = [],
  Client,
  apis,
  hooks,
  config,
}) => {
  // Target Resources
  const targetResources = new Map();
  const targetResourcesAdd = (resource) =>
    targetResources.set(resource.name, resource);
  const getTargetResources = () => [...targetResources.values()];
  const getDeletableTargets = () =>
    [...targetResources.values()].filter(
      (resource) => resource.api.methods.del
    );

  const clients = apis(config).map((api) => Client(api, config));
  //TODO
  const clientsCanDelete = apis(config)
    .filter((api) => !api.methods || api.methods.del)
    .map((api) => Client(api, config));

  // API
  const listLives = async () => {
    const lists = (
      await Promise.all(
        clients.map(async (client) => ({
          client,
          data: (await client.list()).data,
        }))
      )
    ).filter((liveResources) => liveResources.data.items.length > 0);
    console.log("listLives", lists);
    return lists;
  };

  const listTargets = async (resources) => {
    const lists = (
      await Promise.all(
        getTargetResources().map(
          async (resource) => (await resource.client.list()).data
        )
      )
    )
      .filter((liveResources) => liveResources.items.length > 0)
      .map((data) => ({
        //TODO
        data,
      }));
    console.log("listTargets", lists);
    return lists;
  };

  const listConfig = async (resources) => {
    const lists = await Promise.all(
      getTargetResources().map(async (resource) => ({
        resource,
        config: await resource.config(),
      }))
    );
    //console.log("listConfig", lists);
    return lists;
  };

  const destroy = async (resources, options = {}) => {
    //console.log("destroy");
    if (options.all) {
      await Promise.all(
        clientsCanDelete.map(async (client) => ({
          client,
          data: await client.destroy(),
        }))
      );
    } else {
      await Promise.all(
        resources.map(async (resource) => ({
          resource,
          data: await resource.client.destroy(),
        }))
      );
    }
  };

  const planFindDestroy = async (resources = []) => {
    const resourceNames = resources.map((resource) => resource.name);
    const plans = (
      await Promise.all(
        getDeletableTargets().map(async (resource) => {
          console.log(resource);
          const { data } = await resource.client.list();
          const hotResources = data.items;
          const hotResourcesToDestroy = hotResources.filter(
            (hotResource) => !resourceNames.includes(hotResource.name)
          );

          if (hotResourcesToDestroy.length > 0) {
            return {
              provider: name,
              resource: resource,
              data: hotResourcesToDestroy,
            };
          }
          return;
        })
      )
    ).filter((x) => x);
    return plans;
  };

  checkEnvironment(envs);
  if (hooks && hooks.init) {
    hooks.init();
  }

  const provider = {
    config,
    name: () => name,
    type: () => type || name,
    hooks,
    destroy,
    planFindDestroy,
    listLives,
    listTargets,
    listConfig,
    targetResourcesAdd,
  };

  return {
    ...provider,
    ...createResourceMakers({ provider, config, Client, apis }),
  };
};
