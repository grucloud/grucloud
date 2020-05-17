const assert = require("assert");
const _ = require("lodash");
const Promise = require("bluebird");
const logger = require("../logger")({ prefix: "CoreProvider" });
const toString = (x) => JSON.stringify(x, null, 4);
const checkEnvironment = require("../Utils").checkEnvironment;
const { fromTagName } = require("./TagName");
const { SpecDefault } = require("./SpecDefault");
const { retryExpectOk } = require("./Retry");

const ResourceMaker = ({
  name: resourceName,
  type,
  dependencies,
  transformConfig,
  properties,
  spec,
  provider,
}) => {
  logger.debug(
    `ResourceMaker: ${toString({ type, resourceName, properties })}`
  );
  const client = spec.Client({ spec, config: provider.config });
  let parent;
  const getLive = async () => {
    logger.info(`getLive ${resourceName}/${type}`);
    return await client.getByName({ name: resourceName });
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
  const configStatic = () => {
    const result = spec.configDefault({
      name: resourceName,
      properties: _.defaultsDeep(properties, spec.propertiesDefault),
    });
    logger.info(
      `configStatic ${spec.type}/${resourceName}: ${toString(result)}`
    );
    return result;
  };
  const config = async () => {
    logger.info(`config ${spec.type}/${resourceName}`);
    const {
      data: { items },
    } = await client.list();
    logger.info(`config ${spec.type}/${resourceName}`);
    const configLive = await spec.configLive({ dependencies });
    logger.info(`configLive ${toString(configLive)}`);
    const config = _.defaultsDeep(configLive, configStatic());
    const finalConfig = transformConfig
      ? await transformConfig({
          dependencies,
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

    await retryExpectOk({
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
      if (!spec.isOurMinion({ resource: live, tag: provider.config.tag })) {
        throw Error(`Resource ${type}/${resourceName} is not tagged correctly`);
      }
    }
  };

  const destroy = async () => {
    logger.info(`destroy ${type}/${resourceName}`);
    const live = await getLive();
    logger.info(`destroy type: ${type} item: ${toString(live)}`);
    if (live) {
      const id = spec.toId(live);
      if (id) {
        await client.destroy({ id, name: resourceName });
      } else {
        throw Error(`Cannot find id in ${toString(live)}`);
      }
    } else {
      logger.error(`Cannot find ${type}/${resourceName} to destroy`);
    }
  };
  const planUpsert = async ({ resource }) => {
    logger.info(`planUpsert resource: ${toString(resource.serialized())}`);
    const live = await resource.getLive();
    logger.info(`planUpsert live: ${toString(live)}`);
    const plan = live
      ? planUpdate({ live, resource })
      : [
          {
            action: "CREATE",
            resource: resource.serialized(),
            // TODO configStatic ? config: await resource.config(),
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
    config,
    configStatic,
    create,
    planUpsert,
    getLive,
    destroy,
    addParent,
  };
  _.map(dependencies, (dependency) => {
    dependency.addParent(resourceMaker);
  });
  return resourceMaker;
};

const createResourceMakers = ({ specs, config, provider }) =>
  specs.reduce((acc, spec) => {
    acc[`make${spec.type}`] = ({
      name,
      dependencies,
      properties,
      transformConfig,
    }) => {
      const resource = ResourceMaker({
        type: spec.type,
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

const configProviderDefault = {
  tag: "-gru",
};

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

  const clients = specs.map((spec) => spec.Client({ spec, config }));

  const clientByType = (type) => {
    assert(type);
    const spec = specs.find((spec) => spec.type === type);
    if (!spec) {
      throw new Error(`type ${type} not found`);
    }
    return spec.Client({ spec, config });
  };
  // API
  //  Flatter that
  const listLives = async ({ all = false } = {}) => {
    const lists = (
      await Promise.all(
        clients
          .filter((client) => all || client.spec.methods.create)
          .map(async (client) => ({
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
        //config: await resource.config(),
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
    logger.debug(`planFindDestroy BEGIN resources: ${resourceNames()}`);

    const plans = (
      await Promise.all(
        clients
          .filter((client) => client.spec.methods.del)
          .map(async (client) => {
            const { data } = await client.list();
            assert(data);
            logger.debug(
              `planFindDestroy type: ${client.type}, items: ${toString(
                data.items
              )}`
            );

            return data.items
              .filter((hotResource) => {
                logger.debug(`planFindDestroy live: ${toString(hotResource)}`);

                if (
                  !client.spec.isOurMinion({
                    resource: hotResource,
                    tag: config.tag,
                  })
                ) {
                  logger.info(
                    `planFindDestroy: !minion ${toString(hotResource)}`
                  );
                  return false;
                }
                const name = client.spec.findName(hotResource);
                if (!name) {
                  throw Error(`no name in resource: ${toString(hotResource)}`);
                }
                if (all) {
                  logger.debug(`planFindDestroy ${client.type}/${name}, all`);
                  return true;
                }

                logger.debug(`planFindDestroy ${client.type}/${name}`);

                return !resourceNames().includes(fromTagName(name, config.tag));
              })

              .map((live) => ({
                resource: {
                  provider: providerName,
                  type: client.spec.type,
                  name: client.spec.findName(live),
                },
                action: "DESTROY",
                data: live,
              }));
          })
      )
    )
      .flat()
      .filter((x) => x);

    logger.debug(`planFindDestroy END, plans ${toString(plans)}`);
    return plans;
  };
  const upsertResources = async (newOrUpdate = []) => {
    logger.debug(`upsertResources ${toString(newOrUpdate)}`);
    for (const action of newOrUpdate) {
      const engine = resourceByName(action.resource.name);
      if (!engine) {
        throw Error(`Cannot find resource ${toString(action.resource.name)}`);
      }
      const payload = await engine.config();

      await engine.create({
        payload,
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
  const destroyById = async ({ type, data, name }) => {
    logger.debug(`destroyById: ${toString({ type, name })}`);
    const client = clientByType(type);
    if (!client) {
      throw new Error(`Cannot find endpoint type ${type}}`);
    }
    const id = client.spec.toId(data);
    await client.destroy({ id, name });
  };

  const destroyPlannedResources = async (planDestroy) => {
    logger.debug(`destroyPlannedResources ${toString(planDestroy)}`);
    await Promise.all(
      planDestroy.map(async (planItem) => {
        await destroyById({
          type: planItem.resource.type,
          data: planItem.data,
          name: planItem.resource.name,
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
  const isPlanEmpty = (plan) => {
    if (plan.newOrUpdate.length > 0) {
      return false;
    }
    if (plan.destroy.length > 0) {
      return false;
    }
    return true;
  };

  //TODO
  const destroyResource = async (resource) => {
    logger.debug(`destroyResource ${resource.serialized()}`);
    await resource.destroy();
    await Promise.all(
      _.map(resource.dependencies, async (dep) => {
        await destroyResource(dep);
      })
    );
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
