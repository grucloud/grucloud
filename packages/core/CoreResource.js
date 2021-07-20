const assert = require("assert");

const {
  pipe,
  tap,
  map,
  filter,
  tryCatch,
  switchCase,
  get,
  assign,
  any,
  reduce,
  eq,
  not,
  and,
  or,
  transform,
  pick,
} = require("rubico");

const {
  isEmpty,
  isString,
  isFunction,
  isObject,
  callProp,
  pluck,
  forEach,
  find,
  defaultsDeep,
  isDeepEqual,
  size,
  identity,
} = require("rubico/x");

const logger = require("./logger")({ prefix: "CoreResources" });
const { tos } = require("./tos");
const { retryCall } = require("./Retry");
const { convertError } = require("./Common");
const { displayType } = require("./ProviderCommon");

const decorateLive =
  ({ client, lives, config }) =>
  (live) =>
    pipe([
      () => ({
        name: client.findName({ live, lives }),
        meta: client.findMeta(live),
        id: client.findId({ live, lives }),
        providerName: client.spec.providerName,
        type: client.spec.type,
        group: client.spec.group,
        live,
        isDefault: client.isDefault({ live, lives }),
        managedByOther: client.managedByOther({ live, lives }),
      }),
      assign({
        uri: ({ name, id, meta }) =>
          client.resourceKey({
            live,
            providerName: client.spec.providerName,
            type: client.spec.type,
            group: client.spec.group,
            name,
            meta,
            id,
          }),
        displayName: ({ name, meta }) => client.displayName({ name, meta }),
        cannotBeDeleted: ({ name }) =>
          client.cannotBeDeleted({
            live,
            name,
            resources: client.getResourcesByType({ type: client.spec.type }),
            resource: client.getResourceFromLive({ client, live, lives }),
            config,
          }),
      }),
    ])();

const decorateLives = ({ client, lives, config }) =>
  pipe([
    tap((params) => {
      //assert(lives, "decorateLives mssing lives");
    }),
    get("items"), // remove
    filter(not(get("error"))),
    map(decorateLive({ client, lives, config })),
    callProp("sort", (a, b) => a.name.localeCompare(b.name)),
  ]);

const createClient = ({
  spec,
  providerName,
  config,
  getResourcesByType,
  getResourceFromLive,
}) =>
  pipe([
    () => spec.Client({ providerName, spec, config }),
    tap((client) => {
      assert(getResourcesByType);
      assert(getResourceFromLive);
      assert(providerName);
      assert(client.spec);
      assert(client.findName);
      assert(client.getList);
    }),

    defaultsDeep({
      getResourcesByType,
      getResourceFromLive,
      resourceKey: pipe([
        tap((resource) => {
          assert(resource.providerName);
          assert(resource.type);
          assert(
            resource.name || resource.id,
            `no name or id in resource ${tos(resource)}`
          );
        }),
        ({ providerName, type, group, name, id }) =>
          `${providerName}::${displayType({ group, type })}::${
            name || (isString(id) ? id : JSON.stringify(id))
          }`,
      ]),
      displayName: pipe([
        tap((xxx) => {
          assert(true);
        }),
        get("name"),
      ]),
      displayNameResource: pipe([
        tap((xxx) => {
          assert(true);
        }),
        get("name"),
      ]),
      findMeta: () => undefined,
      findDependencies: () => [],
      findNamespace: () => "",
      findNamespaceFromTarget: get("namespace"),
      cannotBeDeleted: () => false,
      isDefault: () => false,
      managedByOther: () => false,
      configDefault: () => ({}),
      isInstanceUp: not(isEmpty),
      providerName,
    }),
    assign({
      getLives: (client) =>
        pipe([
          tryCatch(
            ({ lives }) =>
              pipe([
                tap((params) => {
                  assert(true);
                }),
                () =>
                  client.getList({
                    lives,
                    deep: true,
                    resources: getResourcesByType({ type: client.spec.type }),
                  }),
                decorateLives({
                  client,
                  lives,
                  config,
                }),
                tap((resources) => {
                  logger.debug(
                    `getLives ${client.spec.type} #resources ${size(resources)}`
                  );
                }),
                (resources) => ({ resources }),
              ])(),
            pipe([
              pick(["message", "code", "stack", "config", "response"]),
              tap((error) => {
                logger.error(`list error ${tos(error)}`);
              }),
              (error) => ({ error }),
            ])
          ),
        ]),
    }),
  ])();

exports.createClient = createClient;

exports.ResourceMaker = ({
  name: resourceName,
  namespace = "",
  meta,
  dependencies = () => ({}),
  filterLives,
  readOnly,
  properties = () => ({}),
  attributes = () => ({}),
  spec,
  provider,
  config,
}) => {
  const { type, group } = spec;
  assert(resourceName, `missing 'name' property for type: ${type}`);
  logger.debug(
    `ResourceMaker: ${tos({ type, resourceName, namespace, meta })}`
  );

  const getDependencies = pipe([
    () => dependencies,
    switchCase([
      isObject,
      (dependencies) => () => ({ ...dependencies }),
      identity,
    ]),
  ]);

  const client = createClient({
    providerName: provider.name,
    getResourcesByType: provider.getResourcesByType,
    getResourceFromLive: provider.getResourceFromLive,
    spec,
    config,
  });
  const usedBySet = new Set();

  const getLive = async ({ deep = true, lives } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getLive ${toString()}, deep: ${deep}`);
      }),
      () =>
        client.getByName({
          provider,
          name: resourceName,
          namespace,
          meta,
          dependencies: getDependencies(),
          properties,
          resolveConfig,
          deep,
          resources: provider.getResourcesByType({ type }),
          properties,
          lives,
        }),
      tap((live) => {
        logger.info(`getLive ${toString()} hasLive: ${!!live}`);
        logger.debug(`getLive ${toString()} live: ${tos(live)}`);
      }),
    ])();

  const findLive = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
      }),
      () => lives.getByType({ providerName: provider.name, type, group }),
      tap((xxx) => {
        assert(true);
      }),
      switchCase([
        not(isEmpty),
        pipe([
          tap((xxx) => {
            logger.debug(`findLive`);
          }),
          (resources) =>
            pipe([
              () => resources,
              find(({ live }) =>
                pipe([
                  () =>
                    provider.clientByType({ type }).findName({ live, lives }),
                  tap((liveName) => {
                    logger.debug(
                      `findLive ${type} ${JSON.stringify({
                        resourceName,
                        liveName,
                      })}`
                    );
                  }),
                  (liveName) => isDeepEqual(resourceName, liveName),
                ])()
              ),
            ])(),
        ]),
        () => {
          logger.debug(`findLive cannot find type ${type}`);
        },
      ]),
      get("live"),
      tap((live) => {
        logger.debug(
          `findLive ${tos({ type, resourceName, hasLive: !!live })}`
        );
      }),
    ])();

  const planUpdate = async ({ resource, target, live, lives }) => {
    return pipe([
      tap(() => {
        logger.debug(
          `planUpdate resource: ${tos(resource.toJSON())}, target: ${tos(
            target
          )}, live: ${tos(live)}`
        );
      }),
      () =>
        spec.compare({
          usedBySet,
          target,
          live,
          dependencies: resource.dependencies(),
          lives,
          config,
        }),
      tap((diff) => {
        logger.debug(`planUpdate diff ${tos(diff)}`);
      }),
      (diff) =>
        pipe([
          () => diff,
          get("liveDiff"),
          switchCase([
            or([
              pipe([get("needUpdate")]),
              pipe([get("added"), not(isEmpty)]),
              pipe([get("updated"), not(isEmpty)]),
              pipe([get("deleted"), not(isEmpty)]),
            ]),
            () =>
              pipe([
                () => [
                  {
                    action: "UPDATE",
                    resource: resource.toJSON(),
                    target,
                    live,
                    id: client.findId({ live }),
                    diff,
                    providerName: resource.toJSON().providerName,
                  },
                ],
                tap((updateItem) => {
                  logger.debug(`updateItem ${tos(updateItem)}`);
                }),
              ])(),
            () => {
              logger.info(`planUpdate diff no update`);
            },
          ]),
        ])(),
    ])();
  };
  const getDependencyList = () =>
    pipe([
      getDependencies,
      (deps) => deps(),
      filter(and([not(isString), not(isEmpty)])),
      transform(
        map((dep) => dep),
        () => []
      ),
      tap((result) => {
        logger.info(`getDependencyList `);
      }),
      tap(
        forEach((dep) => {
          assert(dep, "dep");
          assert(dep.type, "dep.type");
        })
      ),
    ])();

  const resolveDependencies = ({
    lives,
    dependencies,
    dependenciesMustBeUp = false,
  }) =>
    pipe([
      tap(() => {
        assert(isFunction(dependencies));
        logger.info(
          `resolveDependencies for ${toString()}: ${Object.keys(
            dependencies()
          )}, mustBeUp: ${dependenciesMustBeUp}`
        );
      }),
      () => dependencies(),
      map(async (dependency) => {
        if (!dependency) {
          logger.error(`${toString()} has undefined dependencies`);
          return;
        }
        if (isString(dependency)) {
          return dependency;
        }

        //TODO isArray
        if (!dependency.getLive) {
          return tryCatch(
            () =>
              resolveDependencies({
                lives,
                dependencies: dependency,
                dependenciesMustBeUp,
              }),
            (error) => {
              logger.error(
                `resolveDependencies: ${toString()}, dep ${dependency.toString()}, error: ${tos(
                  error
                )}`
              );
              return {
                error: convertError({ error }),
              };
            }
          )();
        }
        return tryCatch(
          (dependency) =>
            pipe([
              tap((live) => {
                logger.debug(
                  `resolveDependencies ${toString()}, dep ${dependency.toString()}, has live: ${isEmpty(
                    lives
                  )}`
                );
              }),
              switchCase([
                () => dependency.filterLives,
                () => dependency.resolveConfig({ lives }),
                switchCase([
                  () => isEmpty(lives),
                  () => dependency.getLive({ deep: true }),
                  () => dependency.findLive({ lives }),
                ]),
              ]),
              tap.if(
                (live) => {
                  if (dependenciesMustBeUp) {
                    if (!dependency.isUp({ live })) {
                      return true;
                    }
                    return false;
                  }
                },
                () => {
                  throw {
                    message: `${toString()} dependency ${dependency.toString()} is not up`,
                  };
                }
              ),
              async (live) => ({
                resource: dependency,
                config: await dependency.resolveConfig({
                  deep: true,
                  live,
                  lives,
                }),
                live,
              }),
            ])(),
          (error, dependency) => {
            logger.error(`resolveDependencies: ${tos(error)}`);
            return {
              item: { resource: dependency.toString() },
              error: convertError({ error }),
            };
          }
        )(dependency);
      }),
      tap((result) => {
        /*logger.debug(
          `resolveDependencies for ${()}, result: ${tos(result)}`
        );*/
      }),
      tap.if(any(get("error")), (resolvedDependencies) => {
        logger.error(
          `resolveDependencies ${toString()} error in resolveDependencies`
        );
        const results = filter(get("error"))(resolvedDependencies);

        throw {
          message: pipe([
            pluck("error"),
            reduce((acc, value) => [...acc, value.message], []),
            (messages) => messages.join("\n"),
            tap((message) => {
              logger.debug(
                `resolveDependencies ${toString()}, error message: ${message}`
              );
            }),
          ])(results),
          errorClass: "Dependency",
          results,
        };
      }),
      tap((result) => {
        logger.debug(
          `resolveDependencies for ${toString()}, result: ${tos(result)}`
        );
      }),
    ])();

  const resolveConfig = async ({
    live,
    lives,
    resolvedDependencies,
    deep = false,
  } = {}) =>
    pipe([
      tap(() => {
        logger.debug(
          `resolveConfig ${toString()}, ${tos({
            deep,
            hasLive: !!live, //TODO
          })}`
        );
        if (!live) {
          assert(true);
        }
        assert(client.configDefault);
        assert(spec.propertiesDefault);
      }),
      switchCase([
        () => !deep,
        () => ({}),
        () => !isEmpty(resolvedDependencies),
        () => resolvedDependencies,
        () =>
          resolveDependencies({
            resourceName,
            dependencies: getDependencies(),
            lives,
          }),
      ]),
      (resolvedDependencies) =>
        switchCase([
          () => filterLives,
          pipe([
            tap(() => {
              assert(lives);
            }),
            () => lives.getByType({ type, group, providerName: provider.name }),
            tap((resources) => {
              logger.debug(
                `resolveConfig ${type} #resources ${size(resources)}`
              );
            }),
            (resources) =>
              filterLives({
                dependencies: resolvedDependencies,
                resources,
                configProvider: provider.config,
                live,
                lives,
              }),
            get("live"),
            tap((live) => {
              logger.debug(
                `resolveConfig filterLives ${resourceName}: ${tos(live)}`
              );
            }),
          ]),
          pipe([
            () => properties({ dependencies: resolvedDependencies }),
            (properties) =>
              client.configDefault({
                name: resourceName,
                meta,
                namespace,
                properties: defaultsDeep(spec.propertiesDefault)(properties),
                dependencies: resolvedDependencies,
                live,
                lives,
              }),
            tap((result) => {
              logger.debug(
                `resolveConfig configDefault ${resourceName}: ${tos(result)}`
              );
            }),
          ]),
        ])(),
    ])();

  const create = async ({ payload, resolvedDependencies, lives }) =>
    pipe([
      tap(() => {
        logger.info(`create ${tos({ resourceName, type })}`);
        logger.debug(`create ${tos({ payload })}`);
        assert(payload);
        assert(resolvedDependencies);
        assert(lives);
      }),
      //TODO
      /*tap.if(
        () => getLive({ deep: false }),
        () => {
          throw Error(`Resource ${toString()} already exists`);
        }
      ),*/
      () =>
        client.create({
          meta,
          name: resourceName,
          payload,
          namespace,
          dependencies: getDependencies(),
          attributes,
          resolvedDependencies,
        }),
      () => getLive({ deep: true, lives }),
      tap((live) => {
        logger.info(`created: ${toString()}`);
        logger.debug(`created: live: ${tos(live)}`);
      }),
    ])();

  const update = async ({
    payload,
    diff,
    live,
    lives,
    resolvedDependencies,
  }) => {
    logger.info(`update ${tos({ resourceName, type, payload })}`);
    if (!(await getLive())) {
      throw Error(`Resource ${toString()} does not exist`);
    }

    // Update now
    const instance = await retryCall({
      name: `update ${toString()}`,
      fn: () =>
        client.update({
          name: resourceName,
          payload,
          dependencies: getDependencies(),
          resolvedDependencies,
          diff,
          live,
          lives,
          id: client.findId({ live }),
        }),
      shouldRetryOnException: client.shouldRetryOnException,
      config: provider.config,
    });

    logger.info(`updated: ${toString()}`);
    return instance;
  };

  const planUpsert = async ({ resource, lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`planUpsert resource: ${resource.toString()}`);
      }),
      assign({
        live: () => resource.findLive({ lives }),
      }),
      tap(({ live }) => {}),
      assign({
        target: pipe([
          ({ live }) => resource.resolveConfig({ live, lives, deep: true }),
        ]),
      }),
      tap(({ live, target }) => {
        logger.info(`planUpsert resource: ${resource.toString()}`);
      }),
      switchCase([
        pipe([get("live"), isEmpty]),
        ({ target, live }) => [
          {
            action: "CREATE",
            resource: resource.toJSON(),
            target,
            live,
            providerName: resource.toJSON().providerName,
          },
        ],
        ({ live, target }) => planUpdate({ live, target, resource, lives }),
      ]),
    ])({});

  const toString = () =>
    client.resourceKey({
      providerName: provider.name,
      type,
      group,
      name: resourceName,
      meta,
      dependencies: getDependencies(),
      properties,
    });

  const toJSON = pipe([
    () => ({
      providerName: provider.name,
      type,
      group,
      namespace: client.findNamespaceFromTarget({ namespace, properties }),
      name: resourceName,
      meta,
      displayName: client.displayNameResource({
        name: resourceName,
        meta,
        properties,
        dependencies,
      }),
      uri: toString(),
    }),
    tap((json) => {
      assert(json);
    }),
  ]);

  const addUsedBy = (usedBy) => {
    usedBySet.add(usedBy);
  };

  const resourceMaker = {
    type,
    group,
    provider,
    name: resourceName,
    namespace,
    meta,
    readOnly,
    dependencies: getDependencies(),
    addUsedBy,
    usedBy: () => usedBySet,
    spec,
    client,
    toJSON,
    toString,
    attributes,
    properties,
    resolveConfig,
    create,
    update,
    planUpsert,
    filterLives,
    getLive: filterLives ? resolveConfig : getLive,
    findLive,
    getDependencyList,
    resolveDependencies: ({ lives, dependenciesMustBeUp }) =>
      resolveDependencies({
        resourceName,
        dependencies: getDependencies(),
        lives,
        dependenciesMustBeUp,
      }),
    isUp: ({ live }) =>
      pipe([
        tap(() => {
          assert(client.isInstanceUp);
        }),
        () => client.isInstanceUp(live),
        tap((isUp) => {
          logger.debug(`isUp ${type}/${resourceName}: ${!!isUp}`);
        }),
      ])(),
  };

  pipe([
    () => getDependencies(),
    forEach((dependency) => {
      if (isString(dependency)) {
        return;
      }
      if (!dependency) {
        logger.error(`undefined dependency for ${type}/${resourceName}`);
        return;
      }
      //TODO is Array ?
      //TODO make it recursive
      if (!dependency.addUsedBy) {
        forEach((item) => {
          if (item.addUsedBy) {
            item.addUsedBy(resourceMaker);
          }
        })(dependency);
      } else {
        dependency.addUsedBy(resourceMaker);
      }
    }),
  ])();

  return resourceMaker;
};
