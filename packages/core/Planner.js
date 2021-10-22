const assert = require("assert");
const logger = require("./logger")({ prefix: "Planner" });
const { tos } = require("./tos");
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
  and,
  not,
  pick,
} = require("rubico");

const {
  first,
  size,
  isEmpty,
  isFunction,
  pluck,
  identity,
  find,
  callProp,
  isString,
  uniq,
  isDeepEqual,
  includes,
} = require("rubico/x");
const { logError, convertError } = require("./Common");
const { displayType } = require("./ProviderCommon");
const STATES = {
  WAITING: "WAITING",
  RUNNING: "RUNNING",
  ERROR: "ERROR",
  DONE: "DONE",
};

exports.mapToGraph = (mapResource) =>
  pipe([
    () => [...mapResource.values()],
    map((resource) => ({
      ...resource.toJSON(),
      dependsOn: pipe([
        tap(() => {
          assert(isFunction(resource.dependencies));
        }),
        () => resource.dependencies(),
        transform(
          flatMap(
            switchCase([
              isString,
              () => [],
              isEmpty,
              () => [],
              (resource) => {
                if (!resource.toJSON) {
                  assert(
                    !resource.toJSON,
                    `Dependency is not a resource ${tos(resource)}`
                  );
                }
                return resource.name;
              },
              (resource) => [resource.toJSON()],
              transform(
                map((dep) => dep.toJSON()),
                () => []
              ),
            ])
          ),
          () => []
        ),
      ])(),
    })),
    tap((graph) => {
      logger.debug(`mapToGraph: result ${tos(graph)}`);
    }),
  ])();

const parseFullType = (fullType) =>
  pipe([
    () => fullType,
    callProp("split", "::"),
    switchCase([
      eq(size, 1), //
      (aType) => [undefined, first(aType)],
      identity,
    ]),
  ])();

const dependsOnTypeForward = (dependsOnType) =>
  pipe([
    tap((xxx) => {
      assert(true);
    }),
    () => dependsOnType,
    map((spec) => ({
      providerName: spec.providerName,
      type: spec.type,
      group: spec.group,
      dependsOn: pipe([
        () => spec.dependsOn,
        map(
          pipe([
            (fullType) => parseFullType(fullType),
            ([group, type]) => ({
              type,
              group,
              providerName: spec.providerName,
            }),
          ])
        ),
      ])(),
    })),
    tap((xxx) => {
      assert(true);
    }),
  ])();

const dependsOnTypeReverse = (dependsOnType) =>
  pipe([
    () => dependsOnType,
    map((spec) => ({
      providerName: spec.providerName,
      type: spec.type,
      group: spec.group,
      dependsOn: pipe([
        () => dependsOnType,
        filter(pipe([get("dependsOn", []), includes(displayType(spec))])),
        map(pick(["providerName", "type", "group"])),
      ])(),
    })),
    tap((xxx) => {
      assert(true);
    }),
  ])();

const findDependsOnType = ({
  providerName,
  group,
  type,
  plans,
  dependsOnType,
}) =>
  pipe([
    tap(() => {
      assert(providerName);
      assert(type);
      assert(Array.isArray(plans));
      assert(Array.isArray(dependsOnType));
    }),
    () => dependsOnType,
    find(
      and([
        eq(get("providerName"), providerName),
        eq(get("group"), group),
        eq(get("type"), type),
      ])
    ),
    tap((x) => {
      assert(x);
    }),
    get("dependsOn", []),
    flatMap((dependOn) =>
      pipe([
        () => plans,
        tap((x) => {
          assert(dependOn.providerName);
          assert(dependOn.type);
        }),
        filter(
          pipe([
            get("resource"),
            pick(["providerName", "type", "group"]),
            (resource) => isDeepEqual(resource, dependOn),
          ])
        ),
        pluck("resource"),
      ])()
    ),
    tap((dependsOn) => {
      logger.debug(`findDependsOnType ${JSON.stringify({ type, dependsOn })}`);
    }),
  ])();

const dependsOnInstanceReverse = (dependsOnInstance) =>
  pipe([
    () => dependsOnInstance,
    map(({ uri, type, group, providerName }) => ({
      uri,
      providerName,
      group,
      type,
      dependsOn: pipe([
        () => dependsOnInstance,
        filter(pipe([get("dependsOn"), find(eq(get("uri"), uri))])),
      ])(),
    })),
  ])();

const findDependsOnInstance = ({ uri, plans, dependsOnInstance }) =>
  pipe([
    tap(() => {
      assert(uri);
      assert(Array.isArray(plans));
      assert(dependsOnInstance);
    }),
    () => dependsOnInstance,
    tap((xxx) => {
      assert(xxx);
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
      logger.debug(
        `findDependsOnInstance: ${JSON.stringify({ uri, dependsOn })}`
      );
    }),
  ])();

const DependencyTree = ({ plans, dependsOnType, dependsOnInstance, down }) => {
  assert(Array.isArray(plans));
  assert(Array.isArray(dependsOnType));
  assert(Array.isArray(dependsOnInstance));
  return switchCase([
    () => down,
    // DOWN
    () =>
      pipe([
        () => plans,
        pluck("resource"),
        map(({ name, providerName, type, group, uri }) => ({
          name,
          uri,
          dependsOn: uniq([
            ...findDependsOnType({
              group,
              providerName,
              type,
              plans,
              dependsOnType: dependsOnTypeReverse(dependsOnType),
            }),
            // ...findDependsOnInstance({
            //   uri,
            //   plans,
            //   dependsOnInstance: dependsOnInstanceReverse(dependsOnInstance),
            // }),
          ]),
        })),
        tap((graph) => {
          logger.info(`DependencyTree down: ${tos(graph)}`);
        }),
      ])(),
    // UP
    () =>
      pipe([
        () => plans,
        pluck("resource"),
        map(({ name, providerName, group, type, uri }) => ({
          name,
          uri,
          dependsOn: uniq([
            ...findDependsOnType({
              providerName,
              group,
              type,
              plans,
              dependsOnType: dependsOnTypeForward(dependsOnType),
            }),

            ...findDependsOnInstance({
              uri,
              plans,
              dependsOnInstance,
            }),
          ]),
        })),
        tap((graph) => {
          logger.info(`DependencyTree up: ${tos(graph)}`);
        }),
      ])(),
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

  logger.debug(`Planner #plans: ${plans.length} ${tos({ plans })} `);

  const dependencyTree = DependencyTree({
    plans,
    dependsOnType,
    dependsOnInstance,
    down,
  });

  const statusMap = new Map();
  const statusValues = () => [...statusMap.values()];

  const itemToKey = (item) => {
    assert(item, "item");
    assert(item.resource, "item.resource");
    assert(item.resource.uri, "item.resource.uri");
    return `${item.resource.uri}::${item.resource.id}`;
  };

  const findDependsOn = (item, dependencyTree) =>
    pipe([
      () => dependencyTree,
      tap(() => {
        assert(item.resource.uri);
      }),
      find(eq(get("uri"), item.resource.uri)),
      get("dependsOn", []),
    ])();

  plans.map((item) => {
    const key = itemToKey(item);
    assert(!statusMap.has(key), `Planner: duplicated key: ${key}`);

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
        //assert(output, "no output");
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
        //logger.debug(`onEnd  ${tos(values)}`);
      }),
      map((entry) =>
        tryCatch(
          pipe([
            tap((values) => {
              //logger.debug(`onEnd  ${tos(values)}`);
            }),
            // Remove from the dependsOn array the one that just ended
            filter(({ uri }) => uri !== item.resource.uri),
            tap((dependsOn) => {
              entry.dependsOn = dependsOn;
            }),
            tap((dependsOn) => {
              logger.debug(
                `onEnd ${entry.item.resource.name} #dependsOn: ${size(
                  dependsOn
                )}`
              );
            }),
            switchCase([
              isEmpty,
              tryCatch(
                () => runItem(entry, onEnd),
                (error) => {
                  logger.error(`Planner onEnd  ${tos({ error, entry })}`);
                  error.stack && logger.error(`Planner onEnd  ${error.stack}`);
                  return { error, entry };
                }
              ),
              () => {},
            ]),
            tap((xxx) => {
              //logger.debug(`onEnd  ${tos(xxx)}`);
            }),
          ]),
          (error) => {
            logger.error(`Planner onEnd  ${tos({ error, entry })}`);
            error.stack && logger.error(`Planner onEnd  ${error.stack}`);
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

    const isDependsOnInPlan = pipe([
      get("dependsOn"),
      find((dependOn) =>
        pipe([() => plans, find(eq(get("resource.uri"), dependOn.uri))])()
      ),
    ]);

    await pipe([
      () => statusValues(),
      (statuses) =>
        pipe([
          tap((x) => {
            logger.debug(`Planner run #resource ${x.length}`);
          }),
          filter(not(isDependsOnInPlan)),
          tap((x) => {
            logger.debug(
              `Planner run: start ${x.length} resource(s) in parallel`
            );
            assert(
              x.length > 0,
              `all resources has dependsOn, plan: ${tos({ statuses })}`
            );
          }),
          map(
            tryCatch(
              (entry) => runItem(entry, onEnd),
              (error, entry) => {
                logger.error(`Planner error ${tos(error)}`);
                return { error, entry };
              }
            )
          ),
        ])(statuses),
    ])();

    const error = any((entry) => entry.state === STATES.ERROR)(statusValues());

    const results = statusValues();
    //logger.debug(`Planner ${error && "error"}, result: ${tos(results)}`);

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
