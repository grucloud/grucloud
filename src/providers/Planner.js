const assert = require("assert");
const logger = require("../logger")({ prefix: "Planner" });
const { tos } = require("../tos");
const {
  filter,
  map,
  pipe,
  tap,
  any,
  switchCase,
  transform,
  flatMap,
  tryCatch,
  eq,
  get,
  omit,
} = require("rubico");

const {
  isEmpty,
  isFunction,
  pluck,
  find,
  forEach,
  isString,
  uniq,
} = require("rubico/x");
const { logError, convertError } = require("./Common");

const STATES = {
  WAITING: "WAITING",
  RUNNING: "RUNNING",
  ERROR: "ERROR",
  DONE: "DONE",
};

exports.mapToGraph = pipe([
  (mapResource) =>
    map((resource) => ({
      ...resource.toJSON(),
      dependsOn: transform(
        flatMap(
          switchCase([
            isString,
            () => [],
            (resource) => resource.name,
            (resource) => [resource.toJSON()],
            transform(
              map((dep) => dep.toJSON()),
              () => []
            ),
          ])
        ),
        () => []
      )(resource.dependencies),
    }))([...mapResource.values()]),
  tap((graph) => {
    logger.debug(`mapToGraph: result ${tos(graph)}`);
  }),
]);

const dependsOnTypeReverse = (dependsOnType) =>
  map((spec) => ({
    providerName: spec.providerName,
    type: spec.type,
    dependsOn: pipe([
      filter(({ dependsOn = [] }) => dependsOn.includes(spec.type)),
      map(({ providerName, type }) => `${providerName}::${type}`),
    ])(dependsOnType),
  }))(dependsOnType);

const findDependsOnType = ({ provider, type, plans, dependsOnType }) =>
  pipe([
    find((x) => x.providerName === provider && x.type === type),
    tap((x) => {
      assert(x);
    }),
    ({ dependsOn = [] }) => dependsOn,
    flatMap((dependOn) =>
      pipe([
        filter(
          ({ resource }) =>
            `${resource.provider}::${resource.type}` === dependOn
        ),
        pluck("resource"),
      ])(plans)
    ),
    tap((dependsOn) => {
      logger.debug(
        `findDependsOnType: result ${tos({ provider, type, dependsOn })}`
      );
    }),
  ])(dependsOnTypeReverse(dependsOnType));

const dependsOnInstanceReverse = (dependsOnInstance) =>
  map(({ uri, type, provider }) => ({
    uri,
    providerName: provider,
    type,
    dependsOn: pipe([
      tap((xxx) => {
        logger.debug(`dependsOnInstanceReverse:  ${tos(xxx)}`);
      }),
      map((resource) =>
        pipe([
          get("dependsOn"),
          find(eq(get("uri"), uri)),
          switchCase([isEmpty, () => undefined, () => resource]),
        ])(resource)
      ),
      tap((xxx) => {
        logger.debug(`dependsOnInstanceReverse:  ${tos(xxx)}`);
      }),
      filter((x) => x),
      tap((xxx) => {
        logger.debug(`dependsOnInstanceReverse:  ${tos(xxx)}`);
      }),
    ])(dependsOnInstance),
  }))(dependsOnInstance);

const findDependsOnInstance = ({ uri, plans, dependsOnInstance }) =>
  pipe([
    tap(() => {
      logger.debug(`findDependsOnInstance: ${tos({ uri, dependsOnInstance })}`);
      assert(uri);
    }),
    dependsOnInstanceReverse,
    tap((xxx) => {
      logger.debug(`findDependsOnInstance: reversed ${tos(xxx)}`);
    }),
    find(eq(get("uri"), uri)),
    tap((x) => {
      //assert(x);
    }),
    get("dependsOn"),
    pluck("uri"),
    flatMap((uri) =>
      pipe([filter(eq(get("resource.uri"), uri)), pluck("resource")])(plans)
    ),
    tap((dependsOn) => {
      logger.debug(`findDependsOnInstance: result ${tos({ uri, dependsOn })}`);
    }),
  ])(dependsOnInstance);

const DependencyTree = ({ plans, dependsOnType, dependsOnInstance, down }) => {
  assert(Array.isArray(plans));
  assert(Array.isArray(dependsOnType));
  assert(Array.isArray(dependsOnInstance));
  return switchCase([
    () => down,
    () =>
      pipe([
        pluck("resource"),
        map(({ name, provider, type, uri }) => ({
          name,
          uri,
          dependsOn: uniq([
            ...findDependsOnType({
              provider,
              type,
              plans,
              dependsOnType,
            }),
            ...findDependsOnInstance({
              uri,
              plans,
              dependsOnInstance,
            }),
          ]),
        })),
        tap((graph) => {
          logger.info(`DependencyTree down: ${tos(graph)}`);
        }),
      ])(plans),
    () =>
      pipe([
        forEach((spec) => {
          assert(spec.uri);
        }),
        map((spec) => ({
          name: spec.name,
          type: spec.type,
          uri: spec.uri,
          dependsOn: pipe([
            forEach((dependOn) => {
              assert(dependOn.uri);
            }),
            filter((dependOn) =>
              plans.find(({ resource }) => resource.uri === dependOn.uri)
            ),
          ])(spec.dependsOn),
        })),
        tap((graph) => {
          logger.info(`DependencyTree up: ${tos(graph)}`);
        }),
      ])(dependsOnInstance),
  ])();
};

exports.Planner = ({
  plans,
  dependsOnType,
  dependsOnInstance,
  executor,
  down = false,
  onStateChange,
}) => {
  assert(Array.isArray(plans));
  assert(Array.isArray(dependsOnType));
  assert(Array.isArray(dependsOnInstance));
  assert(isFunction(executor));
  assert(isFunction(onStateChange));
  const dependencyTree = DependencyTree({
    plans,
    dependsOnType: map(({ providerName, type, dependsOn }) => ({
      providerName,
      type,
      dependsOn,
    }))(dependsOnType),
    dependsOnInstance,
    down,
  });
  logger.debug(
    `Planner #plans: ${plans.length} ${tos({ plans, dependencyTree })} `
  );

  const statusMap = new Map();
  const statusValues = () => [...statusMap.values()];

  const itemToKey = (item) => {
    assert(item, "item");
    assert(item.resource, "item.resource");
    assert(item.resource.uri, "item.resource.uri");
    return item.resource.uri;
  };

  const findDependsOn = (item, dependencyTree) =>
    pipe([
      tap(() => {
        assert(item.resource.uri);
      }),
      find(eq(get("uri"), item.resource.uri)),
      get("dependsOn", []),
    ])(dependencyTree);

  plans.map((item) => {
    const key = itemToKey(item);
    assert(
      !statusMap.has(key),
      `Planner: duplicated key: ${key}, plans: ${tos(plans)}`
    );

    statusMap.set(key, {
      item,
      dependsOn: findDependsOn(item, dependencyTree),
      state: STATES.WAITING,
    });
  });

  const runItem = async (entry, onEnd) => {
    assert(entry);
    assert(entry.item);
    logger.debug(`runItem begin ${tos(itemToKey(entry.item))}`);
    assert(entry.item, "no entry.item");
    try {
      assert.equal(
        entry.state,
        STATES.WAITING,
        `runItem already running ${tos(itemToKey(entry.item))}`
      );
      onStateChange({
        resource: entry.item.resource,
        previousState: entry.state,
        nextState: STATES.RUNNING,
      });
      entry.state = STATES.RUNNING;
      const result = await executor({ item: entry.item });
      //assert(result, "no result");
      //["CREATE", "DESTROY"].includes(entry.item.action);
      if (entry.item.action === "CREATE") {
        const { input, output } = result;
        assert(input, "no input");
        assert(output, "no output");
        entry.input = input;
        entry.output = output;
      }
      assert(entry.state !== STATES.ERROR, "entry.state !== STATES.ERROR");
      onStateChange({
        resource: entry.item.resource,
        previousState: entry.state,
        nextState: STATES.DONE,
      });
      entry.state = STATES.DONE;
    } catch (error) {
      entry.error = convertError({ error });
      logger.error(`runItem error with: ${tos(entry)}`);
      logError("runItem", error);
      onStateChange({
        resource: entry.item.resource,
        previousState: entry.state,
        nextState: STATES.ERROR,
        error: entry.error,
      });
      entry.state = STATES.ERROR;
    }
    await onEnd(entry.item);

    logger.debug(`runItem end ${tos(itemToKey(entry.item))}`);
  };
  const onEnd = async (item) => {
    await pipe([
      tap((values) => {
        logger.debug(`onEnd begin ${tos(itemToKey(item))}`);
      }),
      //Exclude the current resource
      filter((x) => x.item.resource.uri !== item.resource.uri),
      // Find resources that depends on the one that just ended
      filter(pipe([get("dependsOn"), find(eq(get("uri"), item.resource.uri))])),
      //filter(({ dependsOn = [] }) => dependsOn.includes(item.resource.name)),
      tap((values) => {
        logger.debug(`onEnd  ${tos(values)}`);
      }),
      map((entry) =>
        tryCatch(
          pipe([
            tap((values) => {
              logger.debug(`onEnd  ${tos(values)}`);
            }),
            // Remove from the dependsOn array the one that just ended
            filter(({ uri }) => uri !== item.resource.uri),
            tap((dependsOn) => {
              entry.dependsOn = dependsOn;
            }),
            tap((dependsOn) => {
              logger.debug(
                `onEnd  ${tos({ name: entry.item.resource.name, dependsOn })}`
              );
            }),
            switchCase([
              isEmpty,
              tryCatch(
                () => runItem(entry, onEnd),
                (error) => {
                  logger.error(`Planner onEnd  ${tos({ error, entry })}`);
                  return { error, entry };
                }
              ),
              () => {},
            ]),
            tap((xxx) => {
              logger.debug(`onEnd  ${tos(xxx)}`);
            }),
          ]),
          (error) => {
            logger.error(`Planner onEnd  ${tos({ error, entry })}`);
            return { error, entry };
          }
        )(entry.dependsOn)
      ),
      tap(() => {
        logger.debug(`onEnd end ${tos(itemToKey(item))}`);
      }),
    ])(statusValues());
  };

  const run = async () => {
    logger.debug(`Planner run`);
    if (isEmpty(plans)) {
      logger.debug(`Planner run: empty plan `);
      return { error: false, results: [], plans: [] };
    }

    const resourcesUri = plans.map((plan) => plan.resource.uri);
    logger.debug(`Planner resourcesUri ${resourcesUri}`);

    const isDependsOnInPlan = (dependsOn = []) =>
      dependsOn.find((dependOn) => resourcesUri.includes(dependOn.uri));

    await pipe([
      () => statusValues(),
      (statuses) =>
        pipe([
          tap((x) => {
            logger.debug(`Planner run #resource ${x.length}`);
          }),
          filter(({ dependsOn }) => !isDependsOnInPlan(dependsOn)),
          tap((x) => {
            logger.debug(
              `Planner run: start ${x.length} resource(s) in parallel`
            );
            assert(
              x.length > 0,
              `all resources has dependsOn, plan: ${tos({ statuses, plans })}`
            );
          }),
          map(
            tryCatch(
              (entry) => runItem(entry, onEnd),
              (error) => {
                logger.error(`Planner error ${tos(error)}`);
                return { error };
              }
            )
          ),
        ])(statuses),
    ])();

    const error = any((entry) => entry.state === STATES.ERROR)(statusValues());

    const results = statusValues();
    logger.debug(`Planner ${error && "error"}, result: ${tos(results)}`);

    return {
      error,
      results,
      plans,
    };
  };
  return {
    run,
  };
};
