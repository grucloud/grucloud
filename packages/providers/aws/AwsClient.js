const assert = require("assert");
const {
  pipe,
  tryCatch,
  tap,
  switchCase,
  get,
  map,
  not,
  and,
  flatMap,
  filter,
  any,
  or,
  eq,
} = require("rubico");
const {
  flatten,
  isFunction,
  defaultsDeep,
  size,
  includes,
  isObject,
  identity,
  isEmpty,
  first,
  when,
  unless,
} = require("rubico/x");
const util = require("util");

const logger = require("@grucloud/core/logger")({ prefix: "AwsClient" });
const { retryCall } = require("@grucloud/core/Retry");
const { assignTags } = require("./AwsCommon");

const shouldRetryOnExceptionCodesDefault =
  (shouldRetryOnExceptionCodes) =>
  ({ error }) =>
    pipe([
      tap(() => {
        assert(error.name);
        logger.error(
          `shouldRetryOnExceptionCodesDefault ${util.inspect(error)}`
        );
      }),
      () => shouldRetryOnExceptionCodes,
      includes(error.name),
    ])();

const shouldRetryOnExceptionMessagesDefault =
  (shouldRetryOnExceptionMessages) =>
  ({ error }) =>
    pipe([
      tap(() => {
        assert(error.message);
        logger.error(
          `shouldRetryOnExceptionMessagesDefault ${util.inspect(error)}`
        );
      }),
      () => shouldRetryOnExceptionMessages,
      any((message) => pipe([() => error.message, includes(message)])()),
    ])();

const shouldRetryOnExceptionDefault = ({
  shouldRetryOnExceptionCodes,
  shouldRetryOnExceptionMessages,
}) =>
  or([
    shouldRetryOnExceptionCodesDefault(shouldRetryOnExceptionCodes),
    shouldRetryOnExceptionMessagesDefault(shouldRetryOnExceptionMessages),
  ]);

exports.AwsClient =
  ({ spec: { type, group }, config }) =>
  (endpoint) => {
    assert(type);
    assert(group);
    assert(config);

    assert(endpoint);

    const getById =
      ({
        method,
        pickId = identity,
        extraParams = {},
        getField,
        decorate = () => identity,
        ignoreErrorCodes = [],
        ignoreErrorMessages = [],
      }) =>
      (params) =>
        pipe([
          tap(() => {
            assert(method);
            logger.debug(`getById ${type} ${JSON.stringify(params)}`);
          }),
          tryCatch(
            pipe([
              () => params,
              pickId,
              defaultsDeep(extraParams),
              tap((params) => {
                logger.info(`getById ${type} ${JSON.stringify(params)}`);
              }),
              endpoint()[method],
              tap((params) => {
                assert(true);
              }),
              when(() => getField, get(getField)),
              when(Array.isArray, first),
              unless(isEmpty, pipe([decorate(params), assignTags])),
            ]),
            switchCase([
              or([
                ({ message }) =>
                  pipe([
                    () => ignoreErrorMessages,
                    any((ignoreMessage) =>
                      pipe([() => message, includes(ignoreMessage)])()
                    ),
                  ])(),
                ({ name }) => pipe([() => ignoreErrorCodes, includes(name)])(),
              ]),
              () => undefined,
              (error) => {
                logger.error(`getById ${type} ${util.inspect(error)}`);
                throw error;
              },
            ])
          ),
          tap((result) => {
            logger.debug(
              `getById ${type}, ${JSON.stringify(
                params
              )} result: ${JSON.stringify(result, null, 4)}`
            );
          }),
        ])();

    const getList =
      ({
        method,
        getParam,
        transformList = identity,
        decorate = () => identity,
        filterResource = () => true,
        extraParam = {},
      }) =>
      ({ lives, params = {} } = {}) =>
        pipe([
          tap(() => {
            logger.info(`getList ${type}`);
            assert(method);
            assert(getParam);
            assert(isFunction(endpoint()[method]));
          }),
          () => params,
          defaultsDeep(extraParam),
          tap((params) => {
            logger.debug(`getList ${type}, params: ${JSON.stringify(params)}`);
          }),
          endpoint()[method],
          tap((params) => {
            assert(true);
          }),
          get(getParam, []),
          transformList,
          filter(filterResource),
          map(decorate({ lives })),
          tap((params) => {
            assert(true);
          }),
          map(assignTags),
          tap((items) => {
            assert(Array.isArray(items));
            logger.info(`getList ${type} #items ${size(items)}`);
          }),
          filter(not(isEmpty)),
        ])();

    const getListWithParent =
      ({
        parent: { type, group },
        pickKey,
        method,
        getParam,
        decorate = () => identity,
        config,
      }) =>
      ({ lives }) =>
        pipe([
          tap(() => {
            logger.debug(`getListWithParent ${type}`);
            assert(lives);
            assert(config);
          }),
          () =>
            lives.getByType({ providerName: config.providerName, type, group }),
          tap((parents) => {
            logger.info(`getListWithParent ${type} #parents: ${size(parents)}`);
          }),
          flatMap(({ live, name, managedByOther }) =>
            pipe([
              () => live,
              switchCase([
                () => !isEmpty(method),
                pipe([
                  pickKey,
                  tap((params) => {
                    assert(true);
                  }),
                  (param) => endpoint()[method](param),
                  tap((params) => {
                    assert(true);
                  }),
                  when(() => getParam, get(getParam)),
                  map(decorate({ name, parent: live, lives })),
                  tap((params) => {
                    assert(true);
                  }),
                  when(pipe([first, Array.isArray]), flatten),
                ]),
                pipe([decorate({ name, managedByOther, parent: live, lives })]),
              ]),
              tap((params) => {
                assert(true);
              }),
            ])()
          ),
          filter(not(isEmpty)),
          tap((items) => {
            logger.info(`getListWithParent ${type} #items ${size(items)}`);
          }),
        ])();

    const create =
      ({
        method,
        filterPayload = identity,
        config,
        configIsUp,
        pickCreated = () => identity,
        pickId,
        getById,
        isInstanceUp = not(isEmpty),
        shouldRetryOnExceptionCodes = [],
        shouldRetryOnExceptionMessages = [],
        shouldRetryOnException = () => false,
        isExpectedException = () => false,
        postCreate = () => identity,
      }) =>
      ({
        name,
        payload,
        programOptions,
        resolvedDependencies,
        dependencies,
        lives,
      }) =>
        pipe([
          tap(() => {
            logger.info(`create ${type}, ${name}`);
            assert(method);
            assert(pickCreated);
          }),
          () =>
            retryCall({
              name: `create ${type} ${name}`,
              fn: pipe([
                () => payload,
                filterPayload,
                tap((params) => {
                  assert(true);
                }),
                endpoint()[method],
                tap((params) => {
                  logger.debug(
                    `create ${name}, response: ${JSON.stringify(params)}`
                  );
                }),
              ]),
              config,
              isExpectedException,
              shouldRetryOnException: or([
                shouldRetryOnException,
                shouldRetryOnExceptionDefault({
                  shouldRetryOnExceptionCodes,
                  shouldRetryOnExceptionMessages,
                }),
              ]),
            }),
          tap((params) => {
            assert(true);
          }),
          (created) =>
            pipe([
              () => created,
              pickCreated({ pickId, payload, name, resolvedDependencies }),
              tap((params) => {
                assert(isObject(params));
                logger.debug(
                  `create isUpById: ${name}, ${JSON.stringify(params)}`
                );
              }),
              tap.if(
                () => isFunction(getById),
                (params) =>
                  retryCall({
                    name: `isUpById: ${name}`,
                    fn: pipe([() => params, getById, isInstanceUp]),
                    config: configIsUp,
                  })
              ),
              postCreate({
                name,
                payload,
                created,
                programOptions,
                resolvedDependencies,
                dependencies,
                lives,
              }),
              tap(() => {
                logger.info(`created ${type}, ${name}`);
              }),
            ])(),
        ])();

    const update =
      ({
        preUpdate = ({ live }) => identity,
        postUpdate = ({ live }) => identity,
        method,
        config,
        pickId = () => ({}),
        extraParam = {},
        filterParams = ({ pickId, payload, diff, live }) =>
          pipe([
            () => diff,
            get("liveDiff.updated", {}),
            defaultsDeep(get("liveDiff.added", {})(diff)),
            defaultsDeep(pickId(live)),
          ])(),
        getById,
        isInstanceUp = identity,
        filterAll = identity,
        shouldRetryOnExceptionCodes = [],
        shouldRetryOnExceptionMessages = [],
        shouldRetryOnException = () => false,
        isExpectedException = () => false,
      }) =>
      ({ name, payload, diff, live, compare, programOptions }) =>
        pipe([
          tap(() => {
            assert(method);
            assert(pickId);
            assert(compare);
            assert(getById);
            logger.info(`update ${type}, ${name}`);
            logger.debug(
              `${JSON.stringify({
                payload,
                live,
                diff,
              })}`
            );
          }),
          preUpdate({ name, live, payload, diff, programOptions }),
          () => filterParams({ pickId, extraParam, payload, diff, live }),
          defaultsDeep(extraParam),
          tap((params) => {
            logger.debug(
              `update ${type}, ${name}, params: ${JSON.stringify(
                params,
                null,
                4
              )}`
            );
          }),
          tryCatch(
            pipe([
              (payload) =>
                retryCall({
                  name: `update ${type} ${name}`,
                  fn: pipe([
                    () => payload,
                    endpoint()[method],
                    tap((results) => {
                      logger.debug(
                        `updated ${type} ${name}, response: ${JSON.stringify(
                          results
                        )}`
                      );
                    }),
                  ]),
                  config,
                  isExpectedException,
                  shouldRetryOnException: or([
                    shouldRetryOnException,
                    shouldRetryOnExceptionDefault({
                      shouldRetryOnExceptionCodes,
                      shouldRetryOnExceptionMessages,
                    }),
                  ]),
                }),
              () =>
                retryCall({
                  name: `isUpById: ${name}`,
                  fn: pipe([
                    () => live,
                    getById,
                    tap((params) => {
                      assert(true);
                    }),
                    filterAll,
                    and([
                      isInstanceUp,
                      pipe([
                        (live) => compare({ live, target: filterAll(payload) }),
                        tap((diff) => {
                          logger.debug(
                            `updating ${type}, ${name}, diff: ${JSON.stringify(
                              diff,
                              null,
                              4
                            )}`
                          );
                        }),
                        or([
                          eq(pipe([get("jsonDiff"), size]), 1),
                          and([
                            pipe([get("liveDiff"), isEmpty]),
                            pipe([get("targetDiff"), isEmpty]),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]),
                  config,
                }),
            ]),
            (error, params) =>
              pipe([
                tap(() => {
                  logger.debug(
                    `error updating ${type}, ${name}, ${JSON.stringify(params)}`
                  );
                }),
                () => {
                  throw error;
                },
              ])()
          ),
          postUpdate({ name, live, payload, diff, programOptions }),
          tap(() => {
            logger.info(`updated ${type}, ${name}`);
          }),
        ])();

    const destroy =
      ({
        preDestroy = () => {},
        postDestroy = () => {},
        pickId,
        extraParam = {},
        method,
        getById,
        isInstanceDown = isEmpty,
        ignoreError = () => false,
        ignoreErrorCodes = [],
        ignoreErrorMessages = [],
        shouldRetryOnExceptionCodes = [],
        shouldRetryOnExceptionMessages = [],
        shouldRetryOnException = pipe([
          get("error.name"),
          tap((name) => {
            assert(name);
          }),
          (name) =>
            pipe([
              () => [
                "ResourceInUseException",
                "DeleteConflict",
                "DependencyViolation",
              ],
              includes(name),
            ])(),
        ]),
        isExpectedResult,
        config,
      }) =>
      ({ name, live, lives }) =>
        pipe([
          tap(() => {
            assert(isFunction(pickId));
            assert(method);
            assert(ignoreError);
          }),
          tryCatch(
            pipe([
              tap(() => preDestroy({ name, live, lives })),
              () => live,
              pickId,
              tap((params) => {
                logger.debug(
                  `destroy ${type}, ${name} ${JSON.stringify(params)}`
                );
              }),
              defaultsDeep(extraParam),
              (params) =>
                retryCall({
                  name: `destroying ${type}`,
                  fn: pipe([() => params, endpoint()[method]]),
                  config,
                  isExpectedResult,
                  shouldRetryOnException: or([
                    shouldRetryOnException,
                    shouldRetryOnExceptionDefault({
                      shouldRetryOnExceptionCodes,
                      shouldRetryOnExceptionMessages,
                    }),
                  ]),
                }),
              () => live,
              tap(postDestroy),
              tap.if(
                () => getById,
                () =>
                  retryCall({
                    name: `isDestroyed ${type}`,
                    fn: pipe([
                      () => live,
                      tap((params) => {
                        assert(true);
                      }),
                      getById,
                      isInstanceDown,
                    ]),
                    config,
                  })
              ),
            ]),
            (error, params) =>
              pipe([
                tap(() => {
                  logger.info(
                    `error destroying ${type} ${name}, ${util.inspect({
                      params,
                      error,
                    })}`
                  );
                }),
                () => error,
                switchCase([
                  or([
                    ignoreError,
                    pipe([() => ignoreErrorCodes, includes(error.name)]),
                    pipe([
                      () => ignoreErrorMessages,
                      any((message) =>
                        pipe([() => error.message, includes(message)])()
                      ),
                    ]),
                  ]),
                  pipe([
                    tap((params) => {
                      assert(true);
                    }),
                    () => undefined,
                  ]),
                  () => {
                    logger.error(error.stack);
                    throw error;
                  },
                ]),
              ])()
          ),
          tap(() => {
            logger.debug(`destroy ${type} ${name} done`);
          }),
        ])();

    return {
      getById,
      getList,
      getListWithParent,
      create,
      update,
      destroy,
    };
  };
