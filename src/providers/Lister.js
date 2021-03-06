const assert = require("assert");
const logger = require("../logger")({ prefix: "Lister" });
const { tos } = require("../tos");
const {
  filter,
  map,
  pipe,
  tap,
  any,
  tryCatch,
  eq,
  get,
  not,
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

  const runItem = async ({ entry: { meta, key, executor }, onEnd }) =>
    pipe([
      tap(() => {
        assert(onEnd);
        assert(key);
        assert(executor);
      }),
      tryCatch(
        pipe([
          tap(() => onStateChange({ key, meta, nextState: STATES.RUNNING })),
          () => executor({ lives: [...resultMap.values()] }),
          tap(() => onStateChange({ key, meta, nextState: STATES.DONE })),
        ]),
        (error) => {
          logger.error(`runItem error with key: ${key}`);
          logError("runItem", error);
          onStateChange({ key, meta, nextState: STATES.ERROR, error });
          return { meta, key, error };
        }
      ),
      tap((result) => {
        resultMap.set(key, result);
      }),
      (result) => onEnd({ key, result }),
    ])();

  const onEnd = async ({ key, result }) =>
    pipe([
      () => inputs,
      //Exclude the current resource
      filter(not(eq(get("key"), key))),
      // Find resources that depends on the one that just ended
      filter(pipe([get("dependsOn"), includes(key)])),
      map((entry) =>
        pipe([
          get("dependsOn"),
          // Remove from the dependsOn array the one that just ended
          filter(not(includes(key))),
          tap((updatedDependsOn) => {
            entry.dependsOn = updatedDependsOn;
          }),
          tap.if(isEmpty, () => runItem({ entry, onEnd })),
        ])(entry)
      ),
    ])();

  const run = pipe([
    () => inputs,
    filter(pipe([get("dependsOn"), isEmpty])),
    tap((x) => {
      logger.debug(`Lister run: start ${x.length}/${inputs.length}`);
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

  return run();
};
