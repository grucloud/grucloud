const assert = require("assert");
const _ = require("lodash");
const Promise = require("bluebird");
const logger = require("../logger")({ prefix: "CoreProvider" });
const toString = (x) => JSON.stringify(x, null, 4);
const checkEnvironment = require("../Utils").checkEnvironment;
const { fromTagName } = require("./TagName");
const { SpecDefault } = require("./SpecDefault");
const { retryExpectOk } = require("./Retry");
const { PlanReorder } = require("./PlanReorder");

const configProviderDefault = {
  tag: "ManagedByGru",
  managedByKey: "ManagedBy",
  managedByValue: "GruCloud",
  managedByDescription: "Managed By GruCloud",
};

const destroyByClient = async ({ client, name, data }) => {
  assert(client);
  assert(name);
  assert(data);
  logger.info(`destroyClient: ${toString({ type: client.spec.type, name })}`);
  logger.debug(`destroyClient: ${toString({ data })}`);
  const id = client.toId(data);
  assert(id);

  try {
    await client.destroy({ id, name });
  } catch (error) {
    logger.error(`destroyClient: ${toString({ error })}`);
    throw error;
  }

  await retryExpectOk({
    name: `destroy ${name}`,
    fn: () => client.isDown({ id, name }),
    isOk: (result) => result,
  });
};

const ResourceMaker = ({
  name: resourceName,
  dependencies,
  transformConfig,
  properties,
  spec,
  provider,
}) => {
  const { type } = spec;
  logger.debug(
    `ResourceMaker: ${toString({ type, resourceName, properties })}`
  );

  const client = spec.Client({ spec });
  let parent;
  const getLive = async () => {
    logger.info(`getLive ${resourceName}/${type}`);
    const live = await client.getByName({ name: resourceName });
    logger.debug(`getLive result: ${toString({ resourceName, type, live })}`);
    return live;
  };

  const planUpdate = async ({ resource, live }) => {
    logger.info(
      `planUpdate resource: ${toString(
        resource.serialized()
      )}, live: ${toString(live)}`
    );
    const target = await resource.resolveConfig();
    logger.debug(`planUpdate target: ${toString(target)}`);

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

  const resolveDependenciesLive = async (dependencies) => {
    const dependenciesLive = await Promise.props(
      _.mapValues(dependencies, async (dependency) => {
        if (!dependency.getLive) {
          return resolveDependenciesLive(dependency);
        }
        const live = await dependency.getLive();
        //TODO use constant
        return live || "<<resolve later>>";
      })
    );
    logger.debug(`resolveDependenciesLive: ${toString({ dependenciesLive })}`);
    return dependenciesLive;
  };

  const resolveConfig = async () => {
    logger.info(`config ${type}/${resourceName}`);
    const {
      data: { items },
    } = await client.list();
    //logger.debug(`config ${toString({ type, resourceName, items })}`);

    const dependenciesLive = await resolveDependenciesLive(dependencies);

    const config = await client.configDefault({
      name: resourceName,
      properties: _.defaultsDeep(properties, spec.propertiesDefault),
      dependenciesLive,
    });
    //logger.info(`configDefault: ${toString(config)}`);
    const finalConfig = transformConfig
      ? await transformConfig({
          dependenciesLive,
          items,
          config,
          configProvider: provider.config,
        })
      : config;

    logger.info(`final config: ${toString(finalConfig)}`);
    assert(!_.isEmpty(finalConfig));
    return finalConfig;
  };
  const create = async ({ payload }) => {
    logger.info(`create ${toString({ resourceName, type, payload })}`);
    // Is the resource already created ?
    const live = await getLive();
    if (live) {
      throw Error(`Resource ${type}/${resourceName} already exists`);
    }
    // Create now
    await client.create({ name: resourceName, payload });
    assert(client.isUp);
    await retryExpectOk({
      name: `create ${resourceName}`,
      fn: () => client.isUp({ name: resourceName }),
      isOk: (result) => result,
    });
    // use Return value and avoid calling getLive again ?
    // Check if we tag correctly
    {
      const live = await getLive();
      if (!live) {
        throw Error(
          `Resource ${type}/${resourceName} not there after being created`
        );
      }
      if (!client.spec.isOurMinion({ resource: live })) {
        throw Error(`Resource ${type}/${resourceName} is not tagged correctly`);
      }
    }
  };

  const destroy = async () => {
    logger.info(`destroy ${type}/${resourceName}`);
    const live = await getLive();
    logger.debug(`destroy type: ${type} item: ${toString(live)}`);
    if (!live) {
      logger.error(`Cannot find ${type}/${resourceName} to destroy`);
      return;
    }
    await destroyByClient({ client, name: resourceName, live });
  };

  const planUpsert = async ({ resource }) => {
    logger.info(`planUpsert resource: ${toString(resource.serialized())}`);
    const live = await resource.getLive();
    logger.debug(`planUpsert live: ${toString(live)}`);
    const plan = live
      ? planUpdate({ live, resource })
      : [
          {
            action: "CREATE",
            resource: resource.serialized(),
            config: await resource.resolveConfig(),
          },
        ];
    logger.debug(`planUpsert plan: ${toString(plan)}`);
    return plan;
  };

  const serialized = () => ({
    name: resourceName,
    type,
    provider: provider.name(),
  });

  const addParent = (parentToSet) => {
    parent = parentToSet;
  };
  const resourceMaker = {
    type,
    provider,
    name: resourceName,
    dependencies,
    getParent: () => parent,
    spec,
    client,
    serialized,
    resolveConfig,
    create,
    planUpsert,
    getLive,
    destroy,
    addParent,
  };
  _.map(dependencies, (dependency) => {
    if (!dependency.addParent) {
      _.forEach(dependency, (item) => item.addParent(resourceMaker));
    } else {
      dependency.addParent(resourceMaker);
    }
  });
  return resourceMaker;
};

const createResourceMakers = ({ specs, config, provider }) =>
  specs.reduce((acc, spec) => {
    assert(spec.type);
    acc[`make${spec.type}`] = ({
      name,
      dependencies,
      properties,
      transformConfig,
    }) => {
      const resource = ResourceMaker({
        name,
        transformConfig,
        properties,
        dependencies,
        spec: _.defaults(spec, SpecDefault({ config: provider.config })),
        provider,
        config,
      });
      provider.targetResourcesAdd(resource);
      return resource;
    };
    return acc;
  }, {});

module.exports = CoreProvider = ({
  name: providerName,
  type,
  envs = [],
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
    _.defaults(spec, SpecDefault({ config }))
  );

  const clients = specs.map((spec) => spec.Client({ spec }));

  const clientByType = (type) => {
    assert(type);
    const spec = specs.find((spec) => spec.type === type);
    if (!spec) {
      throw new Error(`type ${type} not found`);
    }
    return spec.Client({ spec });
  };
  // API
  //  Flatter that
  const listLives = async ({ all = false, our = false, types = [] } = {}) => {
    logger.debug(`listLives ${toString({ all, our, types })}`);

    const lists = (
      await Promise.all(
        clients
          .filter((client) => all || client.spec.methods.create)
          .filter((client) => {
            if (!_.isEmpty(types)) {
              return types.includes(client.spec.type);
            } else {
              return true;
            }
          })

          .map(async (client) => {
            logger.debug(`listLives ${toString(client.spec.type)}`);
            const { data } = await client.list();
            logger.debug(`listLives data ${toString(data)}`);

            return {
              type: client.spec.type,
              items: data.items.filter((item) =>
                our ? client.spec.isOurMinion({ resource: item }) : true
              ),
            };
          })
      )
    ).filter((liveResources) => liveResources.items.length > 0);
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
        //config: await resource.config(),
      }))
    );
    logger.debug(`listConfig ${JSON.stringify(lists, null, 4)}`);
    return lists;
  };

  const plan = async () => {
    const plan = {
      providerName,
      newOrUpdate: await planUpsert(),
      destroy: await planFindDestroy(),
    };
    logger.info(`*******************************************************`);
    logger.info(`plan ${toString(plan)}`);
    logger.info(`*******************************************************`);
    return plan;
  };
  const deployPlan = async (plan) => {
    try {
      assert(plan);
      logger.info(`*******************************************************`);
      logger.info(`Deploy Plan ${toString(plan)}`);
      logger.info(`*******************************************************`);
      await upsertResources(plan.newOrUpdate);
      await destroyPlan(plan.destroy);
      logger.info(`*******************************************************`);
      logger.info(`Deploy Plan DONE`);
      logger.info(`*******************************************************`);
    } catch (error) {
      logger.error(`deployPlan ${toString(error)}`);
      throw error;
    }
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
    logger.debug(`planFindDestroy BEGIN resources: ${resourceNames()}`);

    const plans = (
      await Promise.all(
        clients
          .filter((client) => client.spec.methods.del)
          .map(async (client) => {
            const { spec } = client;
            const { type } = spec;
            const { data } = await client.list();
            assert(data);

            return data.items
              .filter((hotResource) => {
                //logger.debug(`planFindDestroy live: ${toString(hotResource)}`);

                if (
                  !spec.isOurMinion({
                    resource: hotResource,
                  })
                ) {
                  return false;
                }
                const name = client.findName(hotResource);
                if (!name) {
                  throw Error(`no name in resource: ${toString(hotResource)}`);
                }
                if (all) {
                  logger.debug(`planFindDestroy ${type}/${name}, all`);
                  return true;
                }

                logger.debug(`planFindDestroy ${type}/${name}`);

                return !resourceNames().includes(fromTagName(name, config.tag));
              })

              .map((live) => ({
                resource: {
                  provider: providerName,
                  type,
                  name: client.findName(live),
                },
                action: "DESTROY",
                data: live,
              }));
          })
      )
    )
      .flat()
      .filter((x) => x);

    //logger.debug(`planFindDestroy END, plans ${toString(plans)}`);
    const planOrdered = _.flatten(PlanReorder({ plans, specs })).reverse();
    logger.info(`planFindDestroy END, ordered plans ${toString(planOrdered)}`);
    return planOrdered;
  };
  const upsertResources = async (newOrUpdate = []) => {
    logger.debug(`upsertResources ${toString(newOrUpdate)}`);
    for (const action of newOrUpdate) {
      const engine = resourceByName(action.resource.name);
      if (!engine) {
        throw Error(`Cannot find resource ${toString(action.resource.name)}`);
      }
      const payload = await engine.resolveConfig();

      await engine.create({
        payload,
      });
    }
  };
  //TODO refactor, is it used, yes by the cli
  const destroyByName = async ({ name }) => {
    logger.debug(`destroyByName: ${name}`);
    const resource = resourceByName(name);
    if (!resource) {
      throw new Error(`Cannot find resource name ${name}}`);
    }
    await resource.destroy();
  };

  const destroyById = async ({ type, data, name }) => {
    logger.debug(`destroyById: ${toString({ type, name })}`);
    const client = clientByType(type);
    if (!client) {
      throw new Error(`Cannot find endpoint type ${type}}`);
    }
    await destroyByClient({ client, name, data });
  };

  const destroyPlan = async (planDestroy) => {
    logger.info(`destroyPlan ${toString(planDestroy)}`);

    const results = await planDestroy.reduce(async (previousPromise, item) => {
      const collection = await previousPromise;
      //logger.info(`destroyPlan collection ${toString(collection)}`);

      try {
        await destroyById({
          name: item.resource.name,
          type: item.resource.type,
          data: item.data,
        });
        collection.push({ item });
      } catch (error) {
        logger.error(`destroyPlan error ${toString(error)}`);
        collection.push({ item, error });
      }
      return collection;
    }, Promise.resolve([]));

    const success = results.every((result) => !result.error);
    logger.info(`destroyPlan DONE ${toString({ success, results })}`);
    return { success, results };
  };

  const destroyAll = async () => {
    logger.debug(`destroyAll `);
    //TODO try catch ?
    try {
      const planDestroy = await planFindDestroy({ all: true });
      return await destroyPlan(planDestroy);
    } catch (error) {
      logger.error(`destroyAll ${toString(error)}`);
      throw error;
    }
  };

  checkEnvironment(envs);
  if (hooks && hooks.init) {
    hooks.init();
  }
  const isPlanEmpty = (plan) => {
    if (plan.newOrUpdate.length > 0) {
      return false;
    }
    if (plan.destroy.length > 0) {
      return false;
    }
    return true;
  };

  const provider = {
    config,
    name: () => providerName,
    type: () => type || providerName,
    hooks,
    destroyAll,
    planFindDestroy,
    destroyByName,
    plan,
    deployPlan,
    listLives,
    listTargets,
    listConfig,
    targetResourcesAdd,
    clientByType,
    resourceByName,
    getTargetResources,
    isPlanEmpty,
  };

  return {
    ...provider,
    ...createResourceMakers({ provider, config, specs }),
  };
};
