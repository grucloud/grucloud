const _ = require("lodash");
const logger = require("logger")({ prefix: "CoreProvider" });
const compare = require("../Utils").compare;

const toString = (x) => JSON.stringify(x, null, 4);

const checkEnvironment = require("../Utils").checkEnvironment;

const specDefault = {
  preConfig: (x) => undefined,
  postConfig: ({ config }) => config,
  preCreate: (name, options) => ({ name, ...options }),
  getByName: ({ name, items = [] }) => {
    logger.debug(`getByName: ${name}, items: ${toString(items)}`);
    const item = items.find((item) => item.name === name);
    logger.debug(`getByName: ${name}, returns: ${toString(item)}`);
    return item;
  },
  toId: (item) => item.id,
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

  const getByName = async ({ name: resourceName }) => {
    logger.info(`getByName ${resourceName}`);
    const {
      data: { items },
    } = await client.list();
    const instance = api.getByName({ name: resourceName, items });
    logger.info(
      `getByName ${name}, result: ${JSON.stringify(instance, null, 4)}`
    );
    return instance;
  };

  return {
    type,
    provider,
    name,
    api,
    client,
    serialized: () => ({
      name,
      type,
      provider: provider.name(),
    }),
    config: async () => {
      const preConfig = api.preConfig;
      const postConfig = api.postConfig;
      const items = await preConfig({ client });
      const config = await userConfig({ dependencies, items });
      const finalConfig = postConfig({ config, items, dependencies });
      logger.info(
        `config ${api.name}: ${JSON.stringify(finalConfig, null, 4)}`
      );
      return finalConfig;
    },
    planFindNewOrUpdate: async ({ resource }) => {
      const instance = await resource.getByName({ name });
      logger.info(`planFindNewOrUpdate ${instance}`);
      const plan = instance
        ? resource.planUpdate({ instance, resource })
        : [{ action: "CREATE", resource: resource.serialized() }];
      logger.debug(`planFindNewOrUpdate ${JSON.stringify(plan, null, 4)}`);
      return plan;
    },
    planUpdate: async ({ resource, live }) => {
      logger.info(
        `planUpdate resource: ${toString(
          resource.serialized()
        )}, live: ${toString(live)}`
      );
      const target = await resource.config();
      logger.info(`planUpdate config: ${toString(target)}`);
      const diff = compare(target, live);
      if (diff.length === 0) {
        return [
          { action: "UPDATE", resource: resource.serialized(), target, live },
        ];
      }
    },
    //get: async () => await client.get(name),
    create: async ({ name, options }) => {
      logger.info(
        `create ${name}, type: ${type}, ${JSON.stringify(options, null, 4)}`
      );
      const payload = api.preCreate(name, options);
      logger.info(`create final ${name} ${JSON.stringify(payload, null, 4)}`);
      return await client.create({ name, payload });
    },
    getByName,
    destroy: async (name) => {
      logger.info(`destroy type: ${type}, name: ${name}`);
      const item = await getByName({ name });
      logger.info(`destroy type: ${type} item: ${toString(item)}`);
      //TODO function to transform item to id
      if (item) {
        await client.destroy(api.toId(item));
      } else {
        logger.info(`Cannot find type: ${type} name: ${name} to destroy`);
      }
    },
    destroyAll: async () => await client.destroyAll(),
  };
};
// TODO change api name in type
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
  logger.debug(
    `CoreProvider name: ${name}, type ${type}, config: ${toString(config)}`
  );
  // Target Resources
  const targetResources = new Map();

  const targetResourcesAdd = (resource) =>
    targetResources.set(resource.name, resource);

  const getTargetResources = () => [...targetResources.values()];

  const getDeletableTargets = () =>
    [...targetResources.values()].filter(
      (resource) => resource.api.methods.del
    );
  const resourceByName = (name) => targetResources.get(name);

  const specs = apis(config).map((spec) => _.defaults(spec, specDefault));

  const clients = specs.map((api) => Client({ options: api, config }));

  const clientByType = (type) => {
    //TODO change name in type
    const spec = specs.find((spec) => spec.name === type);
    if (!spec) {
      throw new Error(`type ${type} not found`);
    }
    return Client({ options: spec, config });
  };
  // API
  const listLives = async () => {
    const lists = (
      await Promise.all(
        clients.map(async (client) => ({
          type: client.options.name,
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
        getTargetResources().map(async (resource) => ({
          resource: resource.serialized(),
          data: await resource.getByName({ name: resource.name }),
        }))
      )
    ).filter((x) => x.data);
    logger.debug(`listTargets ${JSON.stringify(lists, null, 4)}`);
    return lists;
  };

  const listConfig = async () => {
    const lists = await Promise.all(
      getTargetResources().map(async (resource) => ({
        resource: resource.serialized(),
        config: await resource.config(),
      }))
    );
    logger.debug(`listConfig ${JSON.stringify(lists, null, 4)}`);
    return lists;
  };

  const destroy = async (options = {}) => {
    logger.debug(`destroy options: ${JSON.stringify(options, null, 4)}`);

    await Promise.all(
      getTargetResources().map(async (resource) => ({
        resource,
        data: await resource.destroy(),
      }))
    );
  };
  const plan = async () => ({
    newOrUpdate: await planFindNewOrUpdate(),
    destroy: await planFindDestroy(),
  });

  const deployPlan = async (plan) => {
    await upsertResources(plan.newOrUpdate);
    await destroyResources(plan.destroy);
  };

  /**
   * Find live resources to create or update based on the target resources
   */
  const planFindNewOrUpdate = async () => {
    logger.debug(
      `planFindNewOrUpdate: #resources ${getTargetResources().length}`
    );
    const plans = (
      await Promise.all(
        getTargetResources()
          .filter((resource) => resource.api.methods.create)
          .map(async (resource) => {
            const plan = await resource.planFindNewOrUpdate({ resource });
            if (plan) {
              return {
                resource: resource.serialized(),
                plan,
              };
            }
          })
      )
    ).filter((x) => x);
    logger.debug(
      `planFindNewOrUpdate: plans": ${JSON.stringify(plans, null, 4)}`
    );
    return plans;
  };

  const planFindDestroy = async () => {
    const resourceNames = getTargetResources().map((resource) => resource.name);
    logger.debug(`planFindDestroy , ${resourceNames}`);

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
              resource: resource.serialized(),
              data: hotResourcesToDestroy,
            };
          }
          return;
        })
      )
    ).filter((x) => x);
    logger.debug(`planFindDestroy: plans ${JSON.stringify(plans, null, 4)}`);
    return plans;
  };
  const upsertResources = async (newOrUpdate = []) => {
    logger.debug(`upsertResources ${JSON.stringify(newOrUpdate, null, 4)}`);
    await Promise.all(
      newOrUpdate.map(async (planItem) => {
        const engine = resourceByName(planItem.resource.name);
        if (!engine) {
          throw Error(
            `Cannot find resource ${JSON.stringify(planItem.resource, null, 4)}`
          );
        }
        await Promise.all(
          planItem.plan.map(async ({ resource }) => {
            await engine.create({
              name: resource.name,
              options: await engine.config(),
            });
          })
        );
      })
    );
  };
  const destroyResources = async (planDestroy) => {
    //TODO
    logger.debug(`destroyResources ${JSON.stringify(planDestroy, null, 4)}`);
    await Promise.all(
      planDestroy.map(async (planItem) => {
        const resource = resourceByName(planItem.resource.name);
        await resource.destroy();
      })
    );
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
    plan,
    deployPlan,
    listLives,
    listTargets,
    listConfig,
    targetResourcesAdd,
    clientByType,
    resourceByName,
  };

  return {
    ...provider,
    ...createResourceMakers({ provider, config, Client, specs }),
  };
};
