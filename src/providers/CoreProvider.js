const _ = require("lodash");
const logger = require("logger")({ prefix: "CoreProvider" });

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
  name,
  type,
  dependencies,
  client,
  userConfig,
  api,
  provider,
}) => {
  logger.debug(`ResourceMaker: name: ${name}, type: ${type}`);
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
    planFindNewOrUpdate: async ({ resource }) => {
      const instance = await client.get(name);
      logger.info(`planFindNewOrUpdate ${instance}`);
      if (instance) {
        return api.planUpdate({ resource });
      } else {
        return [{ action: "CREATE" }];
      }
    },
    get: async () => await client.get(name),
    create: async ({ name, config }) => {
      logger.info(`create ${name} ${JSON.stringify(config, null, 4)}`);
      return await client.create(config);
    },
  };
};

const createResourceMakers = ({ specs, config, provider, Client }) =>
  specs.reduce((acc, api) => {
    acc[`make${api.name}`] = (options, userConfig) => {
      const resource = ResourceMaker({
        type: api.name,
        ...options,
        userConfig,
        api: _.defaults(api, specDefault),
        provider,
        client: Client({ options: api, config }),
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
  logger.debug(`CoreProvider name: ${name}, type ${type}, config: ${config}`);

  // Target Resources
  const targetResources = new Map();
  const targetResourcesAdd = (resource) =>
    targetResources.set(resource.name, resource);
  const getTargetResources = () => [...targetResources.values()];
  const getDeletableTargets = () =>
    [...targetResources.values()].filter(
      (resource) => resource.api.methods.del
    );

  const specs = apis(config).map((spec) => _.defaults(spec, specDefault));

  const clients = specs.map((api) => Client({ options: api, config }));
  const clientsCanDelete = specs
    .filter((api) => api.methods.del)
    .map((api) => Client({ options: api, config }));

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
    logger.debug(`listLives ${JSON.stringify(lists, null, 4)}`);
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
    logger.debug(`listTargets ${JSON.stringify(lists, null, 4)}`);
    return lists;
  };

  const listConfig = async (resources) => {
    const lists = await Promise.all(
      getTargetResources().map(async (resource) => ({
        resource,
        config: await resource.config(),
      }))
    );
    logger.debug(`listConfig ${JSON.stringify(lists, null, 4)}`);
    return lists;
  };

  const destroy = async (resources, options = {}) => {
    logger.debug(
      `destroy resources: ${JSON.stringify(
        resources,
        null,
        4
      )}, options: ${JSON.stringify(options, null, 4)}`
    );

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
    logger.debug(
      `planFindDestroy resources: ${JSON.stringify(resources, null, 4)}`
    );

    const resourceNames = resources.map((resource) => resource.name);
    const plans = (
      await Promise.all(
        getDeletableTargets().map(async (resource) => {
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
    logger.debug(`planFindDestroy: plans": ${JSON.stringify(plans, null, 4)}`);
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
    ...createResourceMakers({ provider, config, Client, specs }),
  };
};
