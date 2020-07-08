const assert = require("assert");
const logger = require("../logger")({ prefix: "CoreClient" });
const { tos } = require("../tos");
const { isEmpty, isArray, isFunction } = require("lodash/fp");
const { filter, map, pipe, tap, any, switchCase } = require("rubico");
const { logError } = require("./Common");

const STATES = {
  WAITING: "WAITING",
  RUNNING: "RUNNING",
  ERROR: "ERROR",
  DONE: "DONE",
};

const DependencyTree = ({ plans, specs, down }) => {
  if (down) {
    const result = map((spec) => ({
      type: spec.type,
      dependsOn: pipe([
        filter(({ dependsOn = [] }) => dependsOn.includes(spec.type)),
        map(({ type }) => type),
        filter((type) => plans.find((plan) => plan.resource.type === type)),
      ])(specs),
    }))(specs);
    return result;
  } else {
    return map((spec) => ({
      type: spec.type,
      dependsOn: spec.dependsOn?.filter((dependOn) =>
        plans.find((plan) => plan.resource.type === dependOn)
      ),
    }))(specs);
  }
};

exports.Planner = ({ plans, specs, executor, down = false, onStateChange }) => {
  assert(isArray(plans));
  assert(isArray(specs));
  assert(isFunction(executor));
  assert(isFunction(onStateChange));
  const dependencyTree = DependencyTree({ plans, specs, down });
  logger.debug(
    `Planner #plans: ${plans.length} ${tos({ plans, dependencyTree })} `
  );

  const statusMap = new Map();
  const itemName = (item) => item.resource.name;

  const findSpecByType = (type, specs) => {
    assert(type, "no type");
    const spec = specs.find((spec) => spec.type === type);
    assert(spec, `cannot find spec type for ${type}`);
    return spec;
  };

  const findDependsOn = (item, dependencyTree) =>
    findSpecByType(item.resource.type, dependencyTree).dependsOn;

  plans.map((item) => {
    const name = itemName(item);
    if (statusMap.has(name)) {
      throw {
        code: 422,
        message: `Planner: duplicated name: ${name}, plans: ${tos(plans)}`,
      };
    }
    statusMap.set(name, {
      item,
      dependsOn: findDependsOn(item, dependencyTree),
      state: STATES.WAITING,
    });
  });

  const runItem = async (entry, onEnd) => {
    logger.debug(`runItem begin ${tos(itemName(entry.item))}`);
    assert(entry.item, "no entry.item");
    try {
      if (entry.state !== STATES.WAITING) {
        logger.debug(`runItem already running ${tos(itemName(entry.item))}`);
        return;
      }
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
      entry.error = error;
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
    logger.debug(`runItem end ${tos(itemName(entry.item))}`);
  };
  // TODO add function mapToArrayOfValues = (map) => [...map.values()]

  const onEnd = async (item) => {
    logger.debug(`onEnd begin ${tos(itemName(item))}`);
    await pipe([
      //Exclude the current resource
      filter((x) => x.item.resource.name !== item.resource.name),
      // Find resources that depends on the one that just ended
      filter(({ dependsOn = [] }) => dependsOn.includes(item.resource.type)),
      map(
        pipe([
          async (entry) => {
            await pipe([
              // Remove from the dependsOn array the one that just ended
              filter((x) => x !== item.resource.type),
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
    logger.debug(`onEnd end ${tos(itemName(item))}`);
  };

  const run = async () => {
    logger.debug(`Planner run`);
    if (isEmpty(plans)) {
      logger.debug(`Planner run: empty plan `);
      return { success: true, results: [] };
    }

    const resourceTypes = plans.map((plan) => plan.resource.type);
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

    const success = !any((entry) => entry.state === STATES.ERROR)([
      ...statusMap.values(),
    ]);

    //TODO use pick ?
    const results = [...statusMap.values()];
    logger.debug(`Planner success: ${success}, result: ${tos(results)}`);

    return {
      success,
      results,
    };
  };
  return {
    run,
  };
};
