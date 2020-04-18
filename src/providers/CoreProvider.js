const _ = require("lodash");
const logger = require("logger")({ prefix: "CoreProvider" });
const compare = require("../Utils").compare;

const toString = (x) => JSON.stringify(x, null, 4);

const checkEnvironment = require("../Utils").checkEnvironment;
//TODO move this
const toTagName = (name, tag) => `${name}${tag}`;
const fromTagName = (name, tag) => name && name.replace(tag, "");
const hasTag = (name, tag) => name && name.includes(tag);

const specDefault = {
  preConfig: (x) => undefined,
  postConfig: ({ config }) => config,
  preCreate: ({ name, options }) => ({ name, ...options }),
  findName: (item) => {
    if (item.name) {
      return item.name;
    } else {
      throw Error(`cannot find name`);
    }
  },
  getByName: ({ name, items = [], config }) => {
    logger.debug(`getByName: ${name}, items: ${toString(items)}`);
    const item = items.find(
      (item) => item.name === toTagName(name, config.tag)
    );
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
  namePrefix: "",
};

const ResourceMaker = ({
  name,
  type,
  dependencies,
  client,
  userConfig,
  api,
  provider,
  config,
}) => {
  logger.debug(`ResourceMaker: name: ${name}, type: ${type}`);

  const getByName = async ({ name: resourceName }) => {
    logger.info(`getByName ${resourceName}`);
    const {
      data: { items },
    } = await client.list();
    const instance = api.getByName({ name: resourceName, items, config });
    logger.info(
      `getByName ${name}, result: ${JSON.stringify(instance, null, 4)}`
    );
    return instance;
  };

  const planUpdate = async ({ resource, live }) => {
    logger.info(
      `planUpdate resource: ${toString(
        resource.serialized()
      )}, live: ${toString(live)}`
    );
    const target = await resource.config();
    logger.info(`planUpdate config: ${toString(target)}`);
    if (_.isEmpty(target)) return;
    const diff = compare(target, live);
    if (diff.length === 0) {
      return [
        { action: "UPDATE", resource: resource.serialized(), target, live },
      ];
    }
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
    planUpsert: async ({ resource }) => {
      logger.info(`planUpsert resource: ${toString(resource.serialized())}`);
      const live = await resource.getByName({ name });
      logger.info(`planUpsert live: ${toString(live)}`);
      const plan = live
        ? planUpdate({ live, resource })
        : [{ action: "CREATE", resource: resource.serialized() }];
      logger.debug(`planUpsert ${JSON.stringify(plan, null, 4)}`);
      return plan;
    },

    //get: async () => await client.get(name),
    create: async ({ name, options }) => {
      logger.info(`create ${name}, type: ${type}, ${toString(options)}`);
      const payload = api.preCreate({
        name: toTagName(name, config.tag),
        options,
      });
      logger.info(`create final ${name} ${toString(payload)}`);
      return await client.create({ name, payload });
    },
    getByName,
    destroy: async () => {
      logger.info(`destroy type: ${type}, name: ${name}`);
      const item = await getByName({ name });
      logger.info(`destroy type: ${type} item: ${toString(item)}`);
      if (item) {
        const id = api.toId(item);
        if (id) {
          await client.destroy(id);
        } else {
          throw Error(`Cannot find id in ${toString(item)}`);
        }
      } else {
        logger.error(`Cannot find type: ${type}, name: ${name} to destroy`);
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
        config,
      });
      provider.targetResourcesAdd(resource);
      return resource;
    };
    return acc;
  }, {});

const configProviderDefault = {
  tag: "-gru",
};

module.exports = CoreProvider = ({
  name: providerName,
  type,
  envs = [],
  Client,
  apis,
  hooks,
  config,
}) => {
  logger.debug(
    `CoreProvider name: ${providerName}, type ${type}, config: ${toString(
      config
    )}`
  );
  config = _.defaults(config, configProviderDefault);

  // Target Resources
  const targetResources = new Map();
  const targetResourcesAdd = (resource) =>
    targetResources.set(resource.name, resource);

  const getTargetResources = () => [...targetResources.values()];
  const resourceNames = () => [...targetResources.keys()];

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
          ...resource.serialized(),
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

  const plan = async () => ({
    newOrUpdate: await planUpsert(),
    destroy: await planFindDestroy(),
  });

  const deployPlan = async (plan) => {
    await upsertResources(plan.newOrUpdate);
    await destroyPlannedResources(plan.destroy);
  };

  /**
   * Find live resources to create or update based on the target resources
   */
  const planUpsert = async () => {
    logger.debug(`planUpsert: #resources ${getTargetResources().length}`);
    const plans = (
      await Promise.all(
        getTargetResources()
          .filter((resource) => resource.api.methods.create)
          .map(async (resource) => {
            const plan = await resource.planUpsert({ resource });
            if (plan) {
              return {
                resource: resource.serialized(),
                plan,
              };
            }
          })
      )
    ).filter((x) => x);
    logger.debug(`planUpsert: plans": ${JSON.stringify(plans, null, 4)}`);
    return plans;
  };

  const planFindDestroy = async () => {
    const resourceNames = getTargetResources().map((resource) => resource.name);
    logger.debug(`planFindDestroy resourceNames: ${resourceNames}`);

    const plans = (
      await Promise.all(
        clients
          .filter((client) => client.options.methods.del)
          .map(async (client) => {
            const { data } = await client.list();

            logger.debug(`planFindDestroy type: ${client.type}`);

            //TODO delete more than one ?
            const hotResourcesToDestroy = data.items.filter((hotResource) => {
              const name = client.options.findName(hotResource);
              if (!name || !hasTag(name, config.tag)) {
                return;
              }
              // TODO change client.options in client.spec
              return !resourceNames.includes(fromTagName(name, config.tag));
            });
            if (hotResourcesToDestroy.length > 0) {
              return {
                provider: providerName,
                type: client.options.name,
                data: hotResourcesToDestroy[0],
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
  //TODO refactor
  const destroyByName = async ({ name }) => {
    logger.debug(`destroyByName: ${name}`);
    //Change name in type
    const resource = resourceByName(name);
    if (resource) {
      await resource.destroy();
    } else {
      throw new Error(
        `Cannot find resource name ${name}, available ${resourceNames()}`
      );
    }
  };
  const destroyById = async ({ type, id }) => {
    logger.debug(`destroyById: ${toString({ type, id })}`);
    //Change name in type
    const client = clientByType(type);
    if (client) {
      await client.destroy(id);
    } else {
      throw new Error(`Cannot find endpoint type ${type}}`);
    }
  };

  const destroyPlannedResources = async (planDestroy) => {
    logger.debug(
      `destroyPlannedResources ${JSON.stringify(planDestroy, null, 4)}`
    );
    await Promise.all(
      planDestroy.map(async (planItem) => {
        await destroyById({
          type: planItem.type,
          id: planItem.data.id,
        });
      })
    );
  };

  const destroyAll = async () => {
    logger.debug(`destroyAll `);
    //TODO Promise all settled
    await Promise.all(
      getTargetResources().map(async (resource) => ({
        resource,
        data: await resource.destroy(),
      }))
    );
  };
  checkEnvironment(envs);
  if (hooks && hooks.init) {
    hooks.init();
  }

  const provider = {
    config,
    name: () => providerName,
    type: () => type || providerName,
    hooks,
    destroyAll,
    destroyByName,
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
