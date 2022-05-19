const assert = require("assert");
const logger = require("./logger")({ prefix: "Lister" });
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
  fork,
} = require("rubico");

const {
  identity,
  isEmpty,
  isFunction,
  forEach,
  includes,
  find,
  size,
} = require("rubico/x");
const { logError } = require("./Common");

const STATES = {
  WAITING: "WAITING",
  RUNNING: "RUNNING",
  ERROR: "ERROR",
  DONE: "DONE",
};

exports.Lister =
  ({ onStateChange, name }) =>
  (inputs) => {
    assert(Array.isArray(inputs));
    assert(isFunction(onStateChange));
    const resultMap = new Map();

    logger.debug(`Lister: ${name}, #inputs ${size(inputs)}`);

    const runItem =
      ({ onEnd, inputsFiltered }) =>
      ({ meta, key, isUp = () => true, executor }) =>
        pipe([
          tap(() => {
            assert(onEnd);
            assert(key);
            assert(executor);
            assert(inputsFiltered);
            logger.debug(`runItem key: ${key}`);
          }),
          tryCatch(
            pipe([
              tap(() =>
                onStateChange({ key, meta, nextState: STATES.RUNNING })
              ),
              () => ({ results: [...resultMap.values()] }),
              executor,
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
          onEnd({ inputsFiltered, key, isUp }),
        ])();

    const onEnd =
      ({ inputsFiltered, key, isUp, meta }) =>
      (result) =>
        pipe([
          tap(() => {
            assert(inputsFiltered);
          }),
          () => inputsFiltered,
          //Exclude the current resource
          filter(not(eq(get("key"), key))),
          // Find resources that depends on the one that just ended
          tap((params) => {
            assert(true);
          }),
          filter(pipe([get("dependsOn"), includes(key)])),
          tap((results) => {
            logger.debug(`Lister onEnd ${key}, #${size(results)}`);
          }),
          switchCase([
            isUp,
            map.pool(10, (entry) =>
              pipe([
                () => entry,
                get("dependsOn"),
                // Remove from the dependsOn array the one that just ended
                filter(not(includes(key))),
                tap((updatedDependsOn) => {
                  logger.debug(
                    `Lister onEnd ${entry.key}, new updatedDependsOn: ${updatedDependsOn}`
                  );
                  entry.dependsOn = updatedDependsOn;
                }),
                tap.if(isEmpty, () =>
                  runItem({ inputsFiltered, onEnd })(entry)
                ),
              ])()
            ),
            map((entry) =>
              pipe([
                () => entry,
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
              ])()
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
          dependsOn: pipe([
            get("dependsOn"),
            filter((dependsOn) =>
              pipe([() => inputs, find(eq(get("key"), dependsOn))])()
            ),
          ]),
        })
      ),
      (inputsFiltered) =>
        pipe([
          () => inputsFiltered,
          //TODO we could have items in dependsOn as long as they are not on the plan
          filter(pipe([get("dependsOn"), isEmpty])),
          tap((params) => {
            logger.debug(`Lister run: start ${size(params)}/${inputs.length}`);
          }),
          tap.if(isEmpty, () => {
            //assert(false, `all resources has dependsOn, plan: ${tos({ inputs })}`);
          }),
          forEach(runItem({ onEnd, inputsFiltered })),
          () => inputs,
          map(({ key }) => resultMap.get(key)),
          fork({ error: any(get("error")), results: identity }),
          tap(({ error, results }) => {
            logger.info(`Lister ${error && "error"}`);
            error.stack && logger.error(error.stack);
          }),
        ])(),
    ])();
  };
