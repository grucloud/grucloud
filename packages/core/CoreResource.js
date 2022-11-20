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
  fork,
  set,
} = require("rubico");

const {
  first,
  append,
  isEmpty,
  isString,
  isFunction,
  callProp,
  pluck,
  forEach,
  find,

  isDeepEqual,
  size,
  identity,
  unless,
  when,
  values,
} = require("rubico/x");
const generator = require("generate-password");
const { mergeWith } = require("lodash/fp");
const util = require("util");
const { memoize } = require("lodash");

const logger = require("./logger")({ prefix: "CoreResources" });
const { tos } = require("./tos");
const { retryCall } = require("./Retry");
const { convertError } = require("./Common");
const { decorateLive } = require("./Client");
const { deepDefaults } = require("./deepDefault");

exports.ResourceMaker = ({
  name: resourceName,
  namespace = "",
  meta,
  dependencies = () => ({}),
  readOnly,
  isDefault,
  spec,
  filterLives = switchCase([
    () => readOnly,
    () => spec.findResource,
    () => isDefault,
    () => spec.findDefault,
    () => undefined,
  ])(),
  properties = () => ({}),
  attributes = () => ({}),
  provider,
  programOptions,
}) => {
  assert(programOptions);
  assert(spec);
  const { type, group, groupType } = spec;
  assert(groupType);

  assert(provider);
  const config = provider.getConfig();

  const getId = ({ group, type, name, path = "id", suffix = "" }) =>
    pipe([
      tap(() => {
        assert(group);
        assert(type);
        assert(name);
        assert(path);
      }),
      () =>
        provider.lives.getByName({
          name,
          group,
          type,
          //TODO
          //providerName: config.providerName,
        }),
      tap((params) => {
        assert(true);
      }),
      get(
        path,
        `<< ${path} of ${group}::${type}::${name} not available yet >>`
      ),
      append(suffix),
      tap((params) => {
        assert(true);
      }),
    ])();

  const resourceNameToString = (resourceName) =>
    switchCase([
      () => isFunction(resourceName),
      pipe([() => resourceName({ config: provider.getConfig() })]),
      () => resourceName,
    ])();

  const getResourceName = memoize(
    pipe([
      tap((params) => {
        assert(true);
      }),
      //
      switchCase([
        () => spec.inferName,
        pipe([
          tap((params) => {
            assert(
              spec.inferName,
              `resource ${spec.type} without name must implement 'inferName'`
            );
          }),
          () => resourceName,
          resourceNameToString,
          (resourceNameString) => ({
            resourceName: resourceNameString,
            properties: properties({
              config,
              getId,
              generatePassword: generator.generate,
            }),
            dependenciesSpec: dependencies({ config }),
            dependencies: getDependencies(),
          }),
          spec.inferName,
          tap((name) => {
            assert(name, `empty inferName for ${spec.groupType}`);
          }),
        ]),
        () => isFunction(resourceName),
        () => resourceName({ config: provider.getConfig() }),
        () => isString(resourceName),
        () => resourceName,
        (resourceName) => {
          throw Error(
            `resource name ${JSON.stringify(
              resourceName
            )} is neither empty, nor a string, nor a function`
          );
        },
      ]),
      tap((name) => {
        assert(name, `resource name is empty for ${groupType}`);
      }),
    ])
  );

  logger.debug(
    `ResourceMaker: ${JSON.stringify({
      type,
      group,
      //resourceName: getResourceName(),
      namespace,
      meta,
      programOptions,
    })}`
  );

  const getDependencies = pipe([
    () => dependencies,
    tap((params) => {
      assert(true);
    }),
    unless(isFunction, (dependencies) => () => ({ ...dependencies })),
    (dep) => () => dep({ config, resources: provider.resources() }),
    (dep) => () => spec.transformDependencies({ provider })(dep()),
    (dep) => () =>
      mapDependenciesNameToResource(
        dep({ config, resources: provider.resources() })
      ),
  ]);

  const getClient = () => provider.getClient(spec);

  const getLive = ({ deep = true, options = {}, resolvedDependencies } = {}) =>
    pipe([
      tap((params) => {
        //assert(resolvedDependencies);
      }),
      tap(() => {
        logger.info(`getLive ${toString()}, deep: ${deep}`);
      }),
      getResourceName,
      (name) =>
        getClient().getByName({
          provider,
          name,
          namespace,
          meta,
          dependencies: getDependencies(),
          resolvedDependencies,
          properties,
          resolveConfig,
          deep,
          resources: provider.getResourcesByType(spec),
          lives: provider.lives,
          config: provider.config,
          isDefault,
        }),
      unless(
        or([isEmpty, () => isEmpty(provider.lives)]),
        tap(
          pipe([
            decorateLive({
              client: getClient(),
              lives: provider.lives,
              config,
              options,
            }),
            tap((resource) => {
              provider.lives.addResource({
                groupType,
                resource,
              });
            }),
          ])
        )
      ),
      tap((live) => {
        logger.info(`getLive ${toString()} hasLive: ${!!live}`);
        //logger.debug(`getLive ${toString()} live: ${tos(live)}`);
      }),
    ])();

  const findLive = ({}) =>
    pipe([
      getResourceName,
      tap((params) => {
        assert(true);
      }),
      (name) =>
        provider.lives.getByName({
          name,
          providerName: provider.name,
          type,
          group,
        }),
      tap((xxx) => {
        assert(true);
      }),
      get("live"),
      tap.if(isEmpty, (live) => {
        logger.debug(
          `findLive no live for ${JSON.stringify({
            type,
            group,
            resourceName: getResourceName(),
          })}`
        );
      }),
    ])();

  const planUpdate = ({ resource, target, live, targetResources }) =>
    pipe([
      tap(() => {
        // logger.debug(
        //   `planUpdate resource: ${tos(resource.toJSON())}, target: ${tos(
        //     target
        //   )}, live: ${tos(live)}`
        // );
        assert(Array.isArray(targetResources));
        assert(spec.compare, `no compare for ${spec.groupType}`);
        assert(Array.isArray(spec.omitProperties));
        assert(Array.isArray(spec.omitPropertiesExtra));
      }),
      () =>
        spec.compare({
          ...spec,
          target,
          live,
          dependencies: resource.dependencies(),
          lives: provider.lives,
          config,
          programOptions,
          targetResources,
        }),
      tap((diff) => {
        assert(diff);
        //logger.debug(`planUpdate diff ${tos(diff)}`);
      }),
      (diff) =>
        pipe([
          () => diff,
          switchCase([
            get("hasDiff"),
            () =>
              pipe([
                () => [
                  {
                    action: "UPDATE",
                    resource: resource.toJSON(),
                    target: resource.spec.displayResource()(target),
                    live: resource.spec.displayResource()(live),
                    id: getClient().findId({
                      lives: provider.lives,
                      config: provider.getConfig(),
                    })(live),
                    diff,
                    providerName: resource.toJSON().providerName,
                  },
                ],
                tap((updateItem) => {
                  //logger.debug(`updateItem ${tos(updateItem)}`);
                }),
              ])(),
            () => {
              logger.info(`planUpdate diff no update`);
            },
          ]),
        ])(),
    ])();

  const getDependencyList = () =>
    pipe([
      tap(() => {
        logger.info(`getDependencyList ${type} `);
      }),
      getDependencies(),
      filter(and([not(isString), not(isEmpty)])),
      transform(map(identity), () => []),
      //TODO filter(not(isEmpty))
      tap((result) => {
        logger.info(`getDependencyList ${type} `);
      }),
      tap(
        forEach((dep) => {
          assert(dep, `dep ${type}`);
          assert(dep.type, "dep.type");
        })
      ),
    ])();

  const dependencyNameToResource = ({ key: depKey, value }) =>
    pipe([
      tap(() => {
        assert(depKey);
        assert(value);
      }),
      () => spec.dependencies,
      tap((dependencies) => {
        //assert(dependencies, "missing dependency");
      }),
      map.entries(([key, value]) => [
        key,
        // TODO rubico eq
        when(
          () => key === depKey,
          () => value
        )(),
      ]),
      filter(not(isEmpty)),
      values,
      first,
      switchCase([
        isEmpty,
        () => {
          throw Error(
            `Cannot find the dependency ${depKey}, ${value}, groupType: ${spec.groupType} `
          );
        },
        pipe([
          assign({ name: () => value }),
          provider.getResource,
          tap.if(isEmpty, () => {
            logger.info(`no resource`);
            // logger.info(
            //   `no resource for ${uri}, available resources:\n${[
            //     ...mapGloblalNameToResource.keys(),
            //   ].join("\n")} )}`
            // );
          }),
        ]),
      ]),
    ])();

  const mapDependenciesNameToResource = pipe([
    tap((params) => {
      assert(true);
    }),
    map.entries(([key, value]) => [
      key,
      pipe([
        () => value,
        switchCase([
          isString,
          pipe([() => ({ key, value }), dependencyNameToResource]),
          Array.isArray,
          pipe([
            map(
              pipe([
                when(isString, (name) =>
                  dependencyNameToResource({ key, value: name })
                ),
              ])
            ),
          ]),
          identity,
        ]),
      ])(),
    ]),
    filter(not(isEmpty)),
    tap((params) => {
      assert(true);
    }),
  ]);

  const resolveDependencies = ({
    dependencies,
    dependenciesMustBeUp = false,
  }) =>
    pipe([
      tap(() => {
        assert(isFunction(dependencies));
      }),
      dependencies,
      //TODO
      filter(or([not(isEmpty) /*, not(isString)*/])),
      tap((params) => {
        assert(true);
      }),
      map(
        switchCase([
          isEmpty,
          () => {
            logger.error(`${toString()} has undefined dependencies`);
          },
          isString,
          identity,
          // Recursive
          not(get("getLive")),
          tryCatch(
            (dependency) =>
              resolveDependencies({
                dependencies: () => dependency,
                dependenciesMustBeUp,
              }),
            (error, dependency) => {
              logger.error(
                `resolveDependencies: ${toString()}, dep ${dependency.toString()}, error: ${tos(
                  error
                )}`
              );
              return {
                error: convertError({ error }),
              };
            }
          ),
          (dependency) =>
            tryCatch(
              pipe([
                tap(() => {
                  logger.debug(
                    `resolveDependencies ${toString()}, dep ${dependency.toString()}`
                  );
                }),
                () => dependency,
                switchCase([
                  // TODO readOnly : spec.findResource, useDefault: spec.findDefault
                  () => dependency.filterLives,
                  () => dependency.resolveConfig({ deep: true }),
                  pipe([() => dependency.findLive({})]),
                ]),
                tap.if(
                  switchCase([
                    (live) =>
                      dependenciesMustBeUp && !dependency.isUp({ live }),
                    () => true,
                    () => false,
                  ]),
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
                  }),
                  live,
                }),
              ]),
              (error) => {
                logger.error(`resolveDependencies: ${tos(error)}`);
                return {
                  item: { resource: dependency.toString() },
                  error: convertError({ error }),
                };
              }
            )(),
        ])
      ),
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
            () => results,
            pluck("error"),
            reduce((acc, value) => [...acc, value.message], []),
            callProp("join", "\n"),
            tap((message) => {
              logger.debug(
                `resolveDependencies ${toString()}, error message: ${message}`
              );
            }),
          ])(),
          errorClass: "Dependency",
          results,
        };
      }),
      tap((result) => {
        // logger.debug(
        //   `resolveDependencies for ${toString()}, result: ${tos(result)}`
        // );
      }),
    ])();

  const customizerMergeArray = (objValue, srcValue) =>
    when(
      () => Array.isArray(objValue),
      () => srcValue
    )();

  const resolveConfig = ({ live, resolvedDependencies, deep = false } = {}) =>
    pipe([
      tap(() => {
        logger.debug(
          `resolveConfig ${toString()}, ${JSON.stringify({
            deep,
            hasLive: !!live,
          })}`
        );
        if (!live) {
          assert(true);
        }
        assert(getClient().configDefault);
      }),
      switchCase([
        () => !deep,
        () => ({}),
        () => !isEmpty(resolvedDependencies),
        () => resolvedDependencies,
        () =>
          resolveDependencies({
            resourceName: getResourceName(),
            dependencies: getDependencies(),
          }),
      ]),
      (resolvedDependencies) =>
        switchCase([
          () => filterLives,
          pipe([
            () =>
              provider.lives.getByType({
                type,
                group,
                providerName: provider.name,
              }),
            tap((resources) => {
              logger.debug(
                `resolveConfig ${type} #resources ${size(resources)}`
              );
            }),
            (resources) =>
              filterLives({
                name: getResourceName(),
                dependencies: resolvedDependencies,
                resources,
                configProvider: provider.config,
                live,
                lives: provider.lives,
              }),
            get("live"),
            tap((live) => {
              logger.debug(
                `resolveConfig filterLives ${getResourceName()}: ${tos(live)}`
              );
            }),
          ]),
          pipe([
            () =>
              properties({
                config: provider.getConfig(),
                dependencies: resolvedDependencies,
                getId,
                generatePassword: generator.generate,
              }),
            (properties = {}) =>
              getClient().configDefault({
                name: getResourceName(),
                resourceName: resourceNameToString(resourceName),
                meta,
                namespace,
                properties: pipe([
                  () => properties,
                  mergeWith(customizerMergeArray, spec.propertiesDefault),
                  tap((params) => {
                    assert(true);
                  }),
                  deepDefaults(spec.propertiesDefaultArray),
                  tap((params) => {
                    assert(true);
                  }),
                ])(),
                dependencies: resolvedDependencies,
                spec,
                live,
                lives: provider.lives,
                programOptions,
                config,
              }),
            tap((result) => {
              // logger.debug(
              //   `resolveConfig configDefault ${resourceName}: ${tos(result)}`
              // );
            }),
          ]),
        ])(),
    ])();

  const create = ({ payload, resolvedDependencies }) =>
    pipe([
      tap(() => {
        logger.info(`create ${tos({ resourceName: getResourceName(), type })}`);
        //logger.debug(`create ${tos({ payload })}`);
        assert(payload);
        assert(resolvedDependencies);
      }),
      //TODO
      /*tap.if(
        () => getLive({ deep: false }),
        () => {
          throw Error(`Resource ${toString()} already exists`);
        }
      ),*/
      tap((params) => {
        assert(true);
      }),
      () => getDependencies(),
      (dependencies) =>
        getClient().create({
          meta,
          name: getResourceName(),
          payload,
          namespace,
          dependencies,
          attributes,
          resolvedDependencies,
          lives: provider.lives,
          programOptions,
        }),
      () =>
        retryCall({
          name: `getLive ${toString()}`,
          fn: async () => getLive({ deep: true, resolvedDependencies }),
          config: { retryCount: 10, retryDelay: 5e3 },
          isExpectedResult: not(isEmpty),
        }),
      tap((live) => {
        if (!live) {
          assert(false, `no live after create ${getResourceName()}`);
        }
        logger.info(`created: ${toString()}`);
        //logger.debug(`created: live: ${tos(live)}`);
      }),
    ])();

  const updateTags = ({ diff, live }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      tap.if(
        () => diff.hasTagsDiff,
        pipe([
          getClient,
          tap((client) => {
            assert(
              client.tagResource,
              `missing client.tagResource ${client.spec.groupType}`
            );
            assert(
              client.untagResource,
              `missing client.untagResource ${client.spec.groupType}`
            );
          }),
          (client) =>
            pipe([
              () => live,
              client.findId({
                lives: provider.lives,
                config: provider.getConfig(),
              }),
              (id) =>
                pipe([
                  //Tag
                  () => diff,
                  get("tags.targetTags"),
                  client.tagResource({ live: diff.liveIn, id }),
                  //Untag
                  () => diff,
                  get("tags.removedKeys"),
                  unless(
                    isEmpty,
                    pipe([client.untagResource({ live: diff.liveIn, id })])
                  ),
                ])(),
            ])(),
        ])
      ),
    ]);

  const update = ({ payload, diff, live, resolvedDependencies }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => getLive({ resolvedDependencies }),
      tap.if(isEmpty, () => {
        throw Error(`Resource ${toString()} does not exist`);
      }),
      tap.if(
        () => diff.hasDataDiff,
        pipe([
          getClient,
          tap((client) => {
            assert(
              client.update,
              `client ${client.spec.groupType} has no update function`
            );
          }),
          (client) =>
            retryCall({
              name: `update ${toString()}`,
              fn: tryCatch(
                pipe([
                  () => ({
                    name: getResourceName(),
                    payload,
                    dependencies: getDependencies(),
                    resolvedDependencies,
                    diff,
                    live,
                    lives: provider.lives,
                    //TODO do we need that id ?
                    id: client.findId({
                      lives: provider.lives,
                      config: provider.getConfig(),
                    })(live),
                    programOptions,
                    compare: spec.compare,
                  }),
                  client.update,
                ]),
                (error) => {
                  logger.error(
                    `error updating: ${toString()}, error: ${util.inspect(
                      error
                    )}`
                  );
                  throw error;
                }
              ),
              shouldRetryOnException: client.shouldRetryOnException,
              config: provider.config,
            }),
          tap((params) => {
            logger.info(`updated: ${toString()}`);
          }),
        ])
      ),
      updateTags({ diff, live }),
    ])();

  const planUpsert = ({ resource, lives, targetResources }) =>
    pipe([
      tap((params) => {
        logger.info(`planUpsert resource: ${resource.toString()}`);
        assert(lives);
        assert(targetResources);
      }),
      () => resource,
      switchCase([
        or([get("readOnly"), get("isDefault")]),
        pipe([
          () => resource.resolveConfig({ deep: true }),
          tap((params) => {
            assert(true);
          }),
          switchCase([
            isEmpty,
            () => [
              {
                action: "WAIT_CREATION",
                resource: resource.toJSON(),
                providerName: resource.toJSON().providerName,
              },
            ],
            () => [],
          ]),
          tap((params) => {
            assert(true);
          }),
        ]),
        // readOnly false
        pipe([
          () => ({}),
          assign({
            live: () => resource.findLive({}),
          }),
          assign({
            target: pipe([
              ({ live }) => resource.resolveConfig({ live, deep: true }),
            ]),
          }),
          tap((params) => {
            assert(true);
          }),
          switchCase([
            pipe([get("live"), isEmpty]),
            ({ target, live }) => [
              {
                action: "CREATE",
                resource: resource.toJSON(),
                target: resource.spec.displayResource()(target),
                live: resource.spec.displayResource()(live),
                providerName: resource.toJSON().providerName,
              },
            ],
            ({ live, target }) =>
              planUpdate({ live, target, resource, targetResources }),
          ]),
        ]),
      ]),
    ])();

  const waitForResourceUp = ({ lives }) =>
    pipe([
      tap(() => {
        assert(filterLives);
      }),
      getClient,
      (client) =>
        retryCall({
          name: `waitForResourceUp ${toString()}`,
          fn: tryCatch(
            pipe([
              fork({
                resources: pipe([
                  () => ({ lives }),
                  client.getLives,
                  get("resources"),
                  tap((resources) => {
                    logger.debug(
                      `waitForResourceUp: ${toString()}, #resources: ${size(
                        resources
                      )}`
                    );
                  }),
                ]),
                resolveDependencies: () =>
                  resolveDependencies({
                    resourceName: getResourceName(),
                    dependencies: getDependencies(),
                  }),
              }),
              ({ resources, resolveDependencies }) =>
                filterLives({
                  name: getResourceName(),
                  resources,
                  lives,
                  dependencies: resolveDependencies,
                }),
              tap((params) => {
                logger.debug(
                  `waitForResourceUp: ${toString()}, filterLives: ${tos(
                    params
                  )}`
                );
              }),
            ]),
            (error) => {
              logger.error(
                `error waitForResourceUp: ${toString()}, error: ${tos(error)}`
              );
              throw error;
            }
          ),
          isExpectedResult: not(isEmpty),
          config: client.retryConfigs.isUp,
        }),
      tap((params) => {
        logger.info(`waitForResourceUp: ${toString()}, done`);
      }),
    ])();

  const toString = () =>
    spec.resourceKey({
      providerName: provider.name,
      type,
      group,
      name: getResourceName(),
      meta,
      dependencies: getDependencies(),
      properties,
    });

  const toJSON = pipe([
    () => ({
      providerName: provider.name,
      groupType,
      type,
      group,
      namespace: getClient().findNamespaceFromTarget({ namespace, properties }),
      name: getResourceName(),
      meta,
      readOnly,
      displayName: getClient().displayNameResource({
        name: getResourceName(),
        meta,
        properties,
        dependencies: getDependencies(),
      }),
      uri: toString(),
    }),
    tap((json) => {
      assert(json);
    }),
  ]);

  return {
    type,
    group,
    groupType: `${group}::${type}`,
    provider,
    get name() {
      return getResourceName();
    },
    namespace,
    meta,
    readOnly,
    isDefault,
    dependencies: getDependencies(),
    spec,
    getClient,
    toJSON,
    toString,
    attributes,
    properties,
    resolveConfig,
    create,
    update,
    planUpsert,
    waitForResourceUp,
    filterLives,
    getLive,
    findLive,
    getDependencyList,
    resolveDependencies: ({ dependenciesMustBeUp }) =>
      resolveDependencies({
        resourceName,
        dependencies: getDependencies(),
        dependenciesMustBeUp,
      }),
    isUp: ({ live }) =>
      pipe([
        tap(() => {
          assert(getClient().isInstanceUp);
        }),
        () => getClient().isInstanceUp(live),
        tap((isUp) => {
          logger.debug(
            `isUp ${type}/${getResourceName()}: ${!!isUp}, hasLive: ${!!live}`
          );
        }),
      ])(),
  };
};
