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
} = require("rubico");

const { isEmpty, isFunction } = require("rubico/x");
const { logError, convertError } = require("./Common");

const STATES = {
  WAITING: "WAITING",
  RUNNING: "RUNNING",
  ERROR: "ERROR",
  DONE: "DONE",
};

exports.mapToGraph = pipe([
  tap((mapResource) => {
    //logger.debug(`mapToGraph: ${mapResource}`);
  }),
  (mapResource) =>
    map((resource) => {
      const dependsOn = transform(
        flatMap((resource) =>
          resource.name
            ? [resource.name]
            : transform(
                map((dep) => dep.name),
                () => []
              )(resource)
        ),
        () => []
      )(resource.dependencies);
      return {
        name: resource.name,
        dependsOn,
      };
    })([...mapResource.values()]),
  tap((graph) => {
    logger.debug(`mapToGraph: result ${tos(graph)}`);
  }),
]);

const DependencyTree = ({ plans, specs, down }) => {
  assert(Array.isArray(plans));
  assert(Array.isArray(specs));
  if (down) {
    const result = map((spec) => ({
      name: spec.name,
      dependsOn: pipe([
        filter(({ dependsOn = [] }) => dependsOn.includes(spec.name)),
        map(({ name }) => name),
        filter((name) => plans.find((plan) => plan.resource.name === name)), //TODO do we need that ?
      ])(specs),
    }))(specs);
    return result;
  } else {
    return map((spec) => ({
      name: spec.name,
      dependsOn: spec.dependsOn?.filter((dependOn) =>
        plans.find((plan) => plan.resource.name === dependOn)
      ),
    }))(specs);
  }
};

exports.Planner = ({ plans, specs, executor, down = false, onStateChange }) => {
  assert(Array.isArray(plans));
  assert(Array.isArray(specs));
  assert(isFunction(executor));
  assert(isFunction(onStateChange));
  const dependencyTree = DependencyTree({ plans, specs, down });
  logger.debug(
    `Planner #plans: ${plans.length} ${tos({ plans, dependencyTree })} `
  );

  const statusMap = new Map();
  const itemToKey = (item) => item.resource.name || item.resource.id;

  const findDependsOn = (item, dependencyTree) => {
    if (!item.resource.name) {
      logger.error(`resource has no name, item ${tos(item)}`);
      return [];
    }
    const spec = dependencyTree.find(
      (spec) => spec.name === item.resource.name
    );
    return spec ? spec.dependsOn : [];
  };

  plans.map((item) => {
    const key = itemToKey(item);
    // TODO use id instead of name as name can be undefined when resources are not tagged correctly
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
      ["CREATE", "DESTROY"].includes(entry.item.action);
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
      logError("runItem", error);
      onStateChange({
        resource: entry.item.resource,
        previousState: entry.state,
        nextState: STATES.ERROR,
        error,
      });
      entry.state = STATES.ERROR;
    }

    await onEnd(entry.item);
    logger.debug(`runItem end ${tos(itemToKey(entry.item))}`);
  };
  // TODO add function mapToArrayOfValues = (map) => [...map.values()]

  const onEnd = async (item) => {
    logger.debug(`onEnd begin ${tos(itemToKey(item))}`);
    await pipe([
      //Exclude the current resource
      filter((x) => x.item.resource.name !== item.resource.name),
      // Find resources that depends on the one that just ended
      filter(({ dependsOn = [] }) => dependsOn.includes(item.resource.name)),
      map(
        pipe([
          async (entry) => {
            await pipe([
              // Remove from the dependsOn array the one that just ended
              filter((x) => x !== item.resource.name),
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
                async () => {
                  await runItem(entry, onEnd);
                },
                () => {},
              ]),
            ])(entry.dependsOn);
          },
        ])
      ),
    ])([...statusMap.values()]);
    logger.debug(`onEnd end ${tos(itemToKey(item))}`);
  };

  const run = async () => {
    logger.debug(`Planner run`);
    if (isEmpty(plans)) {
      logger.debug(`Planner run: empty plan `);
      return { error: false, results: [] };
    }

    const resourceTypes = plans.map((plan) => plan.resource.name);
    logger.debug(`Planner resourceTypes ${resourceTypes}`);

    const isDependsOnInPlan = (dependsOn = []) =>
      dependsOn.find((dependOn) => resourceTypes.includes(dependOn));

    await pipe([
      tap((x) => {
        logger.debug(`Planner run #resource ${x.length}`);
      }),
      filter(({ dependsOn }) => !isDependsOnInPlan(dependsOn)),
      tap((x) => {
        logger.debug(`Planner run: start ${x.length} resource(s) in parallel`);
        assert(
          x.length > 0,
          `all resources has dependsOn, plan: ${tos(plans)}`
        );
      }),
      map(
        pipe([
          async (entry) => {
            await runItem(entry, onEnd);
          },
        ])
      ),
    ])([...statusMap.values()]);

    const error = any((entry) => entry.state === STATES.ERROR)([
      ...statusMap.values(),
    ]);

    //TODO use pick ?
    const results = [...statusMap.values()];
    logger.debug(`Planner ${error && "error"}, result: ${tos(results)}`);

    return {
      error,
      results,
    };
  };
  return {
    run,
  };
};
