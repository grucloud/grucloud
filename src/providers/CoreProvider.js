const _ = require("lodash");
const Promise = require("bluebird");
const logger = require("../logger")({ prefix: "CoreProvider" });
const compare = require("../Utils").compare;

const toString = (x) => JSON.stringify(x, null, 4);

const checkEnvironment = require("../Utils").checkEnvironment;

//TODO move this
const toTagName = (name, tag) => `${name}${tag}`;
const fromTagName = (name, tag) => name && name.replace(tag, "");
const hasTag = (name, tag) => name && name.includes(tag);

const fnSpecDefault = ({ config }) => ({
  compare: ({ target, live }) => {
    logger.debug(`compare default`);
    const diff = compare({
      target,
      targetKeys: Object.getOwnPropertyNames(target),
      live,
    });

    logger.debug(`compare ${toString(diff)}`);
    return diff;
  },

  postConfig: ({ config }) => config,
  configStatic: ({ config }) => config,
  configLive: ({ config }) => config,
  configDefault: ({ name, options }) => ({ name, ...options }),
  findName: (item) => {
    if (item.name) {
      return item.name;
    } else {
      throw Error(`cannot find name`);
    }
  },
  getByName: ({ name, items = [] }) => {
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
});

const ResourceMaker = ({
  name: resourceName,
  type,
  dependencies,
  client,
  fnUserConfig,
  spec,
  provider,
  config: configProvider,
}) => {
  logger.debug(`ResourceMaker: ${type}/${resourceName}`);

  const getLive = async () => {
    logger.info(`getLive ${resourceName}/${type}`);
    const {
      data: { items },
    } = await client.list();
    const instance = spec.getByName({
      name: resourceName,
      items,
    });
    logger.info(`getLive ${type}/${resourceName}, out: ${toString(instance)}`);
    return instance;
  };

  const planUpdate = async ({ resource, live }) => {
    logger.info(
      `planUpdate resource: ${toString(
        resource.serialized()
      )}, live: ${toString(live)}`
    );
    const target = await resource.config();
    logger.info(`planUpdate target: ${toString(target)}`);

    if (_.isEmpty(target)) {
      return;
    }
    const diff = spec.compare({ target, live });
    logger.info(`planUpdate diff ${toString(diff)}`);
    if (diff.length > 0) {
      return [
        { action: "UPDATE", resource: resource.serialized(), target, live },
      ];
    }
  };

  const config = async ({ live } = {}) => {
    logger.info(`config ${spec.type}/${resourceName}`);
    const {
      data: { items },
    } = await client.list();

    const userConfig = await fnUserConfig({ dependencies, items });

    const configWithDefault = spec.configDefault({
      name: toTagName(resourceName, configProvider.tag),
      options: userConfig,
    });

    logger.info(
      `config ${spec.type}/${resourceName}, with defaults: ${toString(
        configWithDefault
      )}`
    );

    let finalConfig;
    if (live) {
      // Fetch all live now
      //
      finalConfig = spec.configLive({
        config: configWithDefault,
        items,
        dependencies,
      });
    } else {
      finalConfig = await spec.configStatic({
        config: configWithDefault,
        items,
        dependencies,
      });
    }

    logger.info(
      `config ${spec.type}/${resourceName}, config: ${toString(finalConfig)}`
    );
    return finalConfig;
  };
  return {
    type,
    provider,
    name: resourceName,
    spec,
    client,
    serialized: () => ({
      name: resourceName,
      type,
      provider: provider.name(),
    }),
    config,
    planUpsert: async ({ resource }) => {
      logger.info(`planUpsert resource: ${toString(resource.serialized())}`);
      const live = await resource.getLive();
      logger.info(`planUpsert live: ${toString(live)}`);
      const plan = live
        ? planUpdate({ live, resource })
        : [
            {
              action: "CREATE",
              resource: resource.serialized(),
              config: await resource.config(),
            },
          ];
      logger.debug(`planUpsert plan: ${toString(plan)}`);
      return plan;
    },
    create: async ({ payload }) => {
      logger.info(`create ${toString({ resourceName, type, payload })}`);
      // Is the resource already created ?
      {
        const live = await getLive();
        if (live) {
          throw Error(`Resource ${type}/${resourceName} already exists`);
        }
      }
      // Create now
      await client.create({ name: resourceName, payload });
      // Is the resource created now ?
      // TODO retry ?
      await Promise.delay(1e3);
      {
        const live = await getLive();
        if (!live) {
          throw Error(
            `Resource ${type}/${resourceName} has been created but is not lived yet`
          );
        }
      }
    },
    getLive,
    destroy: async () => {
      logger.info(`destroy ${type}/${resourceName}`);
      const live = await getLive();
      logger.info(`destroy type: ${type} item: ${toString(live)}`);
      if (live) {
        const id = spec.toId(live);
        if (id) {
          await client.destroy(id);
        } else {
          throw Error(`Cannot find id in ${toString(live)}`);
        }
      } else {
        logger.error(`Cannot find ${type}/${resourceName} to destroy`);
      }
    },
  };
};
// TODO change spec name in type
const createResourceMakers = ({ specs, config, provider, Client }) =>
  specs.reduce((acc, spec) => {
    acc[`make${spec.type}`] = (options, fnUserConfig) => {
      const resource = ResourceMaker({
        type: spec.type,
        ...options,
        fnUserConfig,
        spec: _.defaults(spec, fnSpecDefault({ config: provider.config })),
        provider,
        client: Client({ spec, config }), //TODO option is spec
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
  fnSpecs,
  hooks,
  config,
}) => {
  config = _.defaults(config, configProviderDefault);
  logger.debug(
    `CoreProvider name: ${providerName}, type ${type}, config: ${toString(
      config
    )}`
  );
  // Target Resources
  const targetResources = new Map();
  const targetResourcesAdd = (resource) =>
    targetResources.set(resource.name, resource);

  const getTargetResources = () => [...targetResources.values()];
  const resourceNames = () => [...targetResources.keys()];

  const resourceByName = (name) => targetResources.get(name);

  const specs = fnSpecs(config).map((spec) =>
    _.defaults(spec, fnSpecDefault({ config }))
  );

  const clients = specs.map((spec) => Client({ spec, config }));

  const clientByType = (type) => {
    //TODO change name in type
    const spec = specs.find((spec) => spec.type === type);
    if (!spec) {
      throw new Error(`type ${type} not found`);
    }
    return Client({ spec, config });
  };
  // API
  //  Flatter that
  const listLives = async () => {
    const lists = (
      await Promise.all(
        clients.map(async (client) => ({
          type: client.spec.type,
          data: (await client.list()).data,
        }))
      )
    ).filter((liveResources) => liveResources.data.items.length > 0);
    logger.debug(`listLives ${toString(lists)}`);
    return lists;
  };

  const listTargets = async () => {
    const lists = (
      await Promise.all(
        getTargetResources().map(async (resource) => ({
          ...resource.serialized(),
          data: await resource.getLive(),
        }))
      )
    ).filter((x) => x.data);
    logger.debug(`listTargets ${toString(lists)}`);
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

  const plan = async () => {
    const plan = {
      newOrUpdate: await planUpsert(),
      destroy: await planFindDestroy(),
    };
    logger.info(`*******************************************************`);
    logger.info(`plan ${toString(plan)}`);
    logger.info(`*******************************************************`);
    return plan;
  };
  const deployPlan = async (plan) => {
    logger.info(`*******************************************************`);
    logger.info(`Deploy Plan ${toString(plan)}`);
    logger.info(`*******************************************************`);
    await upsertResources(plan.newOrUpdate);
    await destroyPlannedResources(plan.destroy);
    logger.info(`*******************************************************`);
    logger.info(`Deploy Plan DONE`);
    logger.info(`*******************************************************`);
  };

  /**
   * Find live resources to create or update based on the target resources
   */
  const planUpsert = async () => {
    logger.debug(`planUpsert: #resources ${getTargetResources().length}`);
    const plans = (
      await Promise.all(
        getTargetResources()
          .filter((resource) => resource.spec.methods.create)
          .map(async (resource) => {
            const actions = await resource.planUpsert({ resource });
            return actions;
          })
      )
    )
      .filter((x) => x)
      .flat();
    logger.debug(`planUpsert: plans": ${JSON.stringify(plans, null, 4)}`);
    return plans;
  };

  const planFindDestroy = async ({ all = false } = {}) => {
    logger.debug(`planFindDestroy resources: ${resourceNames()}`);

    const plans = (
      await Promise.all(
        clients
          .filter((client) => client.spec.methods.del)
          .map(async (client) => {
            const { data } = await client.list();

            logger.debug(
              `planFindDestroy type: ${client.type}, items: ${toString(
                data.items
              )}`
            );

            return data.items
              .filter((hotResource) => {
                const name = client.spec.findName(hotResource);
                logger.debug(`planFindDestroy name: ${name}`);

                if (!name || !hasTag(name, config.tag)) {
                  return;
                }
                return (
                  all ||
                  !resourceNames().includes(fromTagName(name, config.tag))
                );
              })
              .map((live) => ({
                provider: providerName,
                type: client.spec.type, // TODO change client.spec in client.spec
                data: live,
              }));
          })
      )
    )
      .flat()
      .filter((x) => x);

    logger.debug(`planFindDestroy: plans ${toString(plans)}`);
    return plans;
  };
  const upsertResources = async (newOrUpdate = []) => {
    logger.debug(`upsertResources ${toString(newOrUpdate)}`);
    for (const action of newOrUpdate) {
      const engine = resourceByName(action.resource.name);
      if (!engine) {
        throw Error(`Cannot find resource ${toString(action.resource.name)}`);
      }
      await engine.create({
        payload: await engine.config({ live: true }),
      });
    }
  };
  //TODO refactor, is it used?
  const destroyByName = async ({ name }) => {
    logger.debug(`destroyByName: ${name}`);
    const resource = resourceByName(name);
    if (!resource) {
      throw new Error(`Cannot find resource name ${name}}`);
    }
    await resource.destroy();
  };
  const destroyById = async ({ type, id }) => {
    logger.debug(`destroyById: ${toString({ type, id })}`);
    const client = clientByType(type);
    if (!client) {
      throw new Error(`Cannot find endpoint type ${type}}`);
    }
    await client.destroy(id);
  };

  const destroyPlannedResources = async (planDestroy) => {
    logger.debug(`destroyPlannedResources ${toString(planDestroy)}`);
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
    const planDestroy = await planFindDestroy({ all: true });
    await destroyPlannedResources(planDestroy);
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
    targetResources,
  };

  return {
    ...provider,
    ...createResourceMakers({ provider, config, Client, specs }),
  };
};
