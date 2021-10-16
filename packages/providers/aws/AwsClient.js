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
} = require("rubico");
const {
  pluck,
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
const logger = require("@grucloud/core/logger")({ prefix: "AwsClient" });
const { retryCall } = require("@grucloud/core/Retry");
const { createEndpoint, assignTags } = require("./AwsCommon");

exports.AwsClient = ({ spec: { type, group }, config }) => {
  assert(type);
  assert(group);
  assert(config);

  const endpoint = () => createEndpoint({ endpointName: group })(config);

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
          logger.info(`getById ${type} ${JSON.stringify(params)}`);
        }),
        tryCatch(
          pipe([
            () => params,
            pickId,
            defaultsDeep(extraParams),
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
                  tap((params) => {
                    assert(true);
                  }),
                ])(),
              ({ code }) => pipe([() => ignoreErrorCodes, includes(code)])(),
            ]),
            () => undefined,
            (error) => {
              logger.error(`getById ${type} ${JSON.stringify(error)}`);
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
    ({ method, getParam, decorate = () => identity }) =>
    ({ lives, params } = {}) =>
      pipe([
        tap(() => {
          logger.debug(`getList ${type}`);
          assert(method);
          assert(getParam);
          assert(isFunction(endpoint()[method]));
        }),
        () => params,
        endpoint()[method],
        tap((params) => {
          assert(true);
        }),
        get(getParam, []),
        map(decorate({ lives })),
        tap((params) => {
          assert(true);
        }),
        map(assignTags),
        tap((items) => {
          assert(Array.isArray(items));
          logger.debug(`getList ${type} #items ${size(items)}`);
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
          assert(method);
          assert(getParam);
          assert(isFunction(endpoint()[method]));
          assert(lives);
          assert(config);
        }),
        () =>
          lives.getByType({ providerName: config.providerName, type, group }),
        tap((parents) => {
          logger.debug(`getListWithParent ${type} #parents: ${size(parents)}`);
        }),
        pluck("live"),
        flatMap((live) =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => live,
            pickKey,
            tap((params) => {
              assert(true);
            }),
            endpoint()[method],
            tap((params) => {
              assert(true);
            }),
            get(getParam),
            map(decorate({ parent: live, lives })),
          ])()
        ),
        tap((items) => {
          logger.debug(`getListWithParent ${type} #items ${size(items)}`);
        }),
      ])();

  const create =
    ({
      method,
      filterPayload = identity,
      config,
      configIsUp,
      pickCreated = ({ payload, pickId }) => pipe([() => payload, pickId]),
      pickId,
      getById,
      isInstanceUp = not(isEmpty),
      shouldRetryOnException = () => false,
      isExpectedException = () => false,
      postCreate = () => identity,
    }) =>
    ({ name, payload, programOptions, resolvedDependencies }) =>
      pipe([
        tap(() => {
          logger.debug(`create ${type}, ${name}`);
          assert(method);
          assert(pickCreated);
          assert(pickId);
          assert(getById);
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
            shouldRetryOnException,
          }),
        pickCreated({ pickId, payload, name, resolvedDependencies }),
        tap((params) => {
          assert(isObject(params));
          logger.debug(`create isUpById: ${name}, ${JSON.stringify(params)}`);
        }),
        tap((params) =>
          retryCall({
            name: `isUpById: ${name}`,
            fn: pipe([() => params, getById, isInstanceUp]),
            config: configIsUp,
          })
        ),
        postCreate({ name, payload, programOptions, resolvedDependencies }),
        tap(() => {
          logger.debug(`created ${type}, ${name}`);
        }),
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
          logger.debug(
            `update ${type}, ${name}, ${JSON.stringify({
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
                shouldRetryOnException,
              }),
            () => live,
            (params) =>
              retryCall({
                name: `isUpById: ${name}`,
                fn: pipe([
                  () => params,
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
                      and([
                        pipe([get("liveDiff"), isEmpty]),
                        pipe([get("targetDiff"), isEmpty]),
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
          logger.debug(`updated ${type}, ${name}`);
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
      config,
    }) =>
    ({ name, live, lives }) =>
      pipe([
        tap(() => {
          assert(isFunction(pickId));
          assert(method);
          assert(ignoreError);
          assert(config);
        }),
        tryCatch(
          pipe([
            () => live,
            tap(preDestroy),
            pickId,
            tap((params) => {
              logger.debug(
                `destroy ${type}, ${name} ${JSON.stringify(params)}`
              );
            }),
            defaultsDeep(extraParam),
            tap((params) => {
              assert(true);
            }),
            endpoint()[method],
            tap((params) => {
              assert(true);
            }),
            () => live,
            tap(postDestroy),
            tap.if(
              () => getById,
              () =>
                retryCall({
                  name: `isDestroyed ${type}`,
                  fn: pipe([() => live, getById, isInstanceDown]),
                  config,
                })
            ),
          ]),
          (error, params) =>
            pipe([
              tap(() => {
                logger.error(
                  `error destroying ${type} ${name}, ${JSON.stringify({
                    params,
                    error,
                  })}`
                );
              }),
              () => error,
              switchCase([
                or([
                  ignoreError,
                  pipe([
                    () => ignoreErrorCodes,
                    tap((params) => {
                      assert(true);
                    }),
                    includes(error.code),
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
