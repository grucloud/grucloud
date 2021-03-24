const assert = require("assert");
const logger = require("./logger")({ prefix: "Lister" });
const { tos } = require("./tos");
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
  switchCase,
  assign,
} = require("rubico");

const { isEmpty, isFunction, forEach, includes, find } = require("rubico/x");
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

  const runItem = async ({
    entry: { meta, key, isUp = () => true, executor },
    onEnd,
    inputsFiltered,
  }) =>
    pipe([
      tap(() => {
        assert(onEnd);
        assert(key);
        assert(executor);
        assert(inputsFiltered);
      }),
      tryCatch(
        pipe([
          tap(() => onStateChange({ key, meta, nextState: STATES.RUNNING })),
          () => executor({ results: [...resultMap.values()] }),
          tap((result) =>
            onStateChange({ key, meta, result, nextState: STATES.DONE })
          ),
        ]),
        (error) => {
          logger.error(`runItem error with key: ${key}`);
          logError("runItem", error);
          onStateChange({ key, meta, nextState: STATES.ERROR, error });
          return { ...meta, key, error };
        }
      ),
      tap((result) => {
        resultMap.set(key, result);
      }),
      (result) => onEnd({ inputsFiltered, key, isUp, result }),
    ])();

  const onEnd = async ({ inputsFiltered, key, isUp, meta, result }) =>
    pipe([
      tap(() => {
        assert(inputsFiltered);
      }),
      () => inputsFiltered,
      //Exclude the current resource
      filter(not(eq(get("key"), key))),
      // Find resources that depends on the one that just ended
      filter(pipe([get("dependsOn"), includes(key)])),
      tap((results) => {
        logger.debug(`Lister onEnd ${key}, #${results.length}`);
      }),
      switchCase([
        () => isUp(),
        map((entry) =>
          pipe([
            get("dependsOn"),
            // Remove from the dependsOn array the one that just ended
            filter(not(includes(key))),
            tap((updatedDependsOn) => {
              logger.debug(
                `Lister onEnd ${entry.key}, new updatedDependsOn: ${updatedDependsOn}`
              );
              entry.dependsOn = updatedDependsOn;
            }),
            tap.if(isEmpty, () => runItem({ inputsFiltered, entry, onEnd })),
          ])(entry)
        ),
        map((entry) =>
          pipe([
            tap(() => {
              logger.debug(`Lister ${key} is not up`, entry);
              assert(entry.key);
            }),
            () =>
              resultMap.set(entry.key, {
                ...entry.meta,
                error: `Dependency ${key} is not up`,
                errorClass: "Dependency",
              }),
          ])(entry)
        ),
      ]),
      tap((result) => {
        logger.debug(`Lister onEnd ${key}`);
      }),
    ])();

  return pipe([
    () => inputs,
    map(
      assign({
        dependsOn: ({ dependsOn }) =>
          filter((dependsOn) => find(eq(get("key"), dependsOn))(inputs))(
            dependsOn
          ),
      })
    ),
    (inputsFiltered) =>
      pipe([
        tap((results) => {
          logger.debug(`Lister run: `);
        }),
        () => inputsFiltered,
        //TODO we could have items in dependsOn as long as they are not on the plan
        filter(pipe([get("dependsOn"), isEmpty])),
        tap((x) => {
          logger.debug(`Lister run: start ${x.length}/${inputs.length}`);
        }),
        tap.if(isEmpty, () => {
          //assert(false, `all resources has dependsOn, plan: ${tos({ inputs })}`);
        }),
        forEach((entry) => runItem({ entry, onEnd, inputsFiltered })),
        () => [...resultMap.values()],
        (results) => ({ error: any(get("error"))(results), results }),
        tap(({ error, results }) => {
          logger.info(`Lister ${error && "error"}`);
          //logger.debug(`Lister ${error && "error"}, result: ${tos(results)}`);
        }),
      ])(),
  ])();
};
