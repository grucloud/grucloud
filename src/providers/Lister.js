const assert = require("assert");
const logger = require("../logger")({ prefix: "Lister" });
const { tos } = require("../tos");
const {
  filter,
  map,
  pipe,
  tap,
  any,
  switchCase,
  tryCatch,
  eq,
  get,
  not,
  assign,
} = require("rubico");

const { isEmpty, isFunction, forEach, includes } = require("rubico/x");
const { logError } = require("./Common");

const STATES = {
  WAITING: "WAITING",
  RUNNING: "RUNNING",
  ERROR: "ERROR",
  DONE: "DONE",
};

exports.Lister = ({ inputs, onStateChange }) => {
  assert(Array.isArray(inputs));
  assert(isFunction(onStateChange));
  const resultMap = new Map();
  const statusMap = new Map(
    map((input) => [input.type, { ...input, state: STATES.WAITING }])(inputs)
  );

  const statusValues = () => [...statusMap.values()];

  const runItem = async ({ entry: { type, providerName, executor }, onEnd }) =>
    pipe([
      tap(() => {
        assert(onEnd);
        assert(type);
        assert(executor);
        assert(providerName);

        logger.debug(`runItem begin ${type}`);
      }),
      tryCatch(
        pipe([
          tap(() =>
            onStateChange({
              type,
              previousState: STATES.WAITING,
              nextState: STATES.RUNNING,
            })
          ),
          () => executor({ lives: [...resultMap.values()] }),
          tap(() =>
            onStateChange({
              type,
              previousState: STATES.RUNNING,
              nextState: STATES.DONE,
            })
          ),
        ]),
        (error) => {
          logger.error(`runItem error with: ${type}`);
          logError("runItem", error);
          onStateChange({
            type,
            previousState: STATES.RUNNING,
            nextState: STATES.ERROR,
            error,
          });
          return { type, providerName, error };
        }
      ),
      tap((result) => {
        logger.debug(`runItem set result ${type}: ${tos(result)}`);
        //TODO providerName + type as key
        resultMap.set(type, result);
      }),
      () => onEnd({ type }),
      tap(() => {
        logger.debug(`runItem end ${type}`);
      }),
    ])();

  const onEnd = async ({ type }) =>
    pipe([
      () => statusValues(),
      tap((values) => {
        logger.debug(`onEnd begin ${type}`);
      }),
      //Exclude the current resource
      filter(not(eq(get("type"), type))),
      // Find resources that depends on the one that just ended
      filter(pipe([get("dependsOn"), includes(type)])),
      tap((values) => {
        logger.debug(`onEnd  ${tos(values)}`);
      }),
      map((entry) =>
        tryCatch(
          pipe([
            get("dependsOn"),
            tap((dependsOn) => {
              logger.debug(`onEnd ${type}, ${entry.type}: ${tos(dependsOn)}`);
            }),
            // Remove from the dependsOn array the one that just ended
            filter(not(includes(type))),
            tap((updatedDependsOn) => {
              entry.dependsOn = updatedDependsOn;
            }),
            tap((updatedDependsOn) => {
              logger.debug(
                `onEnd ${tos({ type: entry.type, updatedDependsOn })}`
              );
            }),
            switchCase([
              isEmpty,
              tryCatch(
                () => runItem({ entry, onEnd }),
                (error) => {
                  logger.error(`Lister onEnd  ${tos({ error, entry })}`);
                  return { error, entry };
                }
              ),
              (updatedDependsOn) => updatedDependsOn,
            ]),
            (updatedDependsOn) =>
              assign({ dependsOn: () => updatedDependsOn })(entry),
          ]),
          (error) => {
            logger.error(`Lister onEnd  ${tos({ error, entry })}`);
            return { error, ...entry };
          }
        )(entry)
      ),
      tap(() => {
        //logger.debug(`onEnd end ${tos(itemToKey(item))}`);
      }),
    ])();

  const run = pipe([
    tap(() => {
      logger.debug(`run`);
    }),
    () => statusValues(),
    tap((statuses) => {
      logger.debug(`Lister run #resource ${statuses.length}`);
    }),
    filter(pipe([get("dependsOn"), isEmpty])),
    tap((x) => {
      logger.debug(`Lister run: start ${x.length} resource(s) in parallel`);
    }),
    tap.if(isEmpty, () => {
      //assert(false, `all resources has dependsOn, plan: ${tos({ inputs })}`);
    }),
    forEach((entry) => runItem({ entry, onEnd })),
    () => [...resultMap.values()],
    (results) => ({ error: any(get("error"))(results), results }),
    tap(({ error, results }) => {
      logger.debug(`Lister ${error && "error"}, result: ${tos(results)}`);
    }),
  ]);

  return {
    run,
  };
};
