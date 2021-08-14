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
} = require("rubico");

const {
  isEmpty,
  isString,
  isFunction,
  callProp,
  pluck,
  forEach,
  find,
  defaultsDeep,
  isDeepEqual,
  size,
  identity,
  unless,
} = require("rubico/x");

const logger = require("./logger")({ prefix: "CoreResources" });
const { tos } = require("./tos");
const { retryCall } = require("./Retry");
const { convertError } = require("./Common");
const { decorateLive } = require("./Client");
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
  programOptions,
}) => {
  const { type, group } = spec;
  assert(resourceName, `missing 'name' property for type: ${type}`);
  logger.debug(
    `ResourceMaker: ${JSON.stringify({
      type,
      group,
      resourceName,
      namespace,
      meta,
      programOptions,
    })}`
  );

  const getDependencies = pipe([
    () => dependencies,
    unless(isFunction, (dependencies) => () => ({ ...dependencies })),
    (dep) => () => dep({ resources: provider.resources() }),
  ]);

  const client = provider.clientByType()(spec);

  const getLive = ({ deep = true, options = {} } = {}) =>
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
          resources: provider.getResourcesByType(spec),
          properties,
          lives: provider.lives,
        }),
      unless(
        or([isEmpty, () => isEmpty(provider.lives)]),
        tap(
          pipe([
            decorateLive({ client, lives: provider.lives, config, options }),
            tap((resource) => {
              provider.lives.addResource({
                providerName: config.providerName,
                type,
                group,
                resource,
              });
            }),
          ])
        )
      ),
      tap((live) => {
        logger.info(`getLive ${toString()} hasLive: ${!!live}`);
        logger.debug(`getLive ${toString()} live: ${tos(live)}`);
      }),
    ])();

  const findLive = ({}) =>
    pipe([
      tap(() => {
        //assert(group);
      }),
      () =>
        provider.lives.getByType({ providerName: provider.name, type, group }),
      tap((xxx) => {
        assert(true);
      }),
      switchCase([
        not(isEmpty),
        pipe([
          (resources) =>
            pipe([
              () => resources,
              find(({ live }) =>
                pipe([
                  () => provider.clientByType()({ type, group }),
                  (client) => client.findName({ live, lives: provider.lives }),
                  tap((liveName) => {
                    logger.debug(
                      `findLive ${group}::${type} resourceName: ${resourceName} liveName: ${liveName}`
                    );
                  }),
                  (liveName) => isDeepEqual(resourceName, liveName),
                ])()
              ),
              // tap.if(isEmpty, () => {
              //   logger.info(
              //     `findLive ${type} resourceName: ${resourceName} not in resources: ${tos(
              //       resources
              //     )}`
              //   );
              // }),
            ])(),
        ]),
        () => {
          logger.debug(`findLive cannot find type ${type}`);
        },
      ]),
      get("live"),
      tap((live) => {
        logger.debug(
          `findLive ${JSON.stringify({ type, resourceName, hasLive: !!live })}`
        );
      }),
    ])();

  const planUpdate = ({ resource, target, live }) =>
    pipe([
      tap(() => {
        logger.debug(
          `planUpdate resource: ${tos(resource.toJSON())}, target: ${tos(
            target
          )}, live: ${tos(live)}`
        );
      }),
      () =>
        spec.compare({
          target,
          live,
          dependencies: resource.dependencies(),
          lives: provider.lives,
          config,
          programOptions,
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

  const getDependencyList = () =>
    pipe([
      tap((result) => {
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

  const resolveDependencies = ({
    dependencies,
    dependenciesMustBeUp = false,
  }) =>
    pipe([
      tap(() => {
        assert(isFunction(dependencies));
        // logger.info(
        //   `resolveDependencies for ${toString()}: ${Object.keys(
        //     dependencies()
        //   )}, mustBeUp: ${dependenciesMustBeUp}`
        // );
      }),
      () => dependencies(),
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
                  () => dependency.filterLives,
                  () => dependency.resolveConfig({}),
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
                dependencies: resolvedDependencies,
                resources,
                configProvider: provider.config,
                live,
                lives: provider.lives,
              }),
            get("live"),
            tap((live) => {
              logger.debug(
                `resolveConfig filterLives ${resourceName}: ${tos(live)}`
              );
            }),
          ]),
          pipe([
            () =>
              properties({
                config: provider.getConfig(),
                dependencies: resolvedDependencies,
              }),
            (properties) =>
              client.configDefault({
                name: resourceName,
                meta,
                namespace,
                properties: defaultsDeep(spec.propertiesDefault)(properties),
                dependencies: resolvedDependencies,
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
        logger.info(`create ${tos({ resourceName, type })}`);
        logger.debug(`create ${tos({ payload })}`);
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
      () =>
        client.create({
          meta,
          name: resourceName,
          payload,
          namespace,
          dependencies: getDependencies(),
          attributes,
          resolvedDependencies,
          lives: provider.lives,
          programOptions,
        }),
      () => getLive({ deep: true }),
      tap((live) => {
        //assert(live);
        if (!live) {
          assert(true, `no live after create ${resourceName}`);
        }
        logger.info(`created: ${toString()}`);
        logger.debug(`created: live: ${tos(live)}`);
      }),
    ])();

  const update = ({ payload, diff, live, resolvedDependencies }) =>
    pipe([
      () => getLive(),
      tap.if(isEmpty, () => {
        throw Error(`Resource ${toString()} does not exist`);
      }),
      () =>
        retryCall({
          name: `update ${toString()}`,
          fn: () =>
            client.update({
              name: resourceName,
              payload,
              dependencies: getDependencies(),
              resolvedDependencies,
              diff,
              live,
              lives: provider.lives,
              id: client.findId({ live }),
              programOptions,
            }),
          shouldRetryOnException: client.shouldRetryOnException,
          config: provider.config,
        }),
      tap((params) => {
        logger.info(`updated: ${toString()}`);
      }),
    ])();

  const planUpsert = ({ resource }) =>
    pipe([
      tap(() => {
        logger.info(`planUpsert resource: ${resource.toString()}`);
      }),
      assign({
        live: () => resource.findLive({}),
      }),
      assign({
        target: pipe([
          ({ live }) => resource.resolveConfig({ live, deep: true }),
        ]),
      }),
      tap(({ live, target }) => {
        assert(true);
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
        ({ live, target }) => planUpdate({ live, target, resource }),
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
      readOnly,
      displayName: client.displayNameResource({
        name: resourceName,
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
    provider,
    name: resourceName,
    namespace,
    meta,
    readOnly,
    dependencies: getDependencies(),
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
    resolveDependencies: ({ dependenciesMustBeUp }) =>
      resolveDependencies({
        resourceName,
        dependencies: getDependencies(),
        dependenciesMustBeUp,
      }),
    isUp: ({ live }) =>
      pipe([
        tap(() => {
          assert(client.isInstanceUp);
        }),
        () => client.isInstanceUp(live),
        tap((isUp) => {
          logger.debug(
            `isUp ${type}/${resourceName}: ${!!isUp}, hasLive: ${!!live}`
          );
        }),
      ])(),
  };
};
