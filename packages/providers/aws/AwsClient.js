const assert = require("assert");
const {
  pipe,
  tryCatch,
  tap,
  switchCase,
  get,
  map,
  not,
  flatMap,
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
const { createEndpoint } = require("./AwsCommon");

exports.AwsClient = ({ spec: { type, group }, config }) => {
  assert(type);
  assert(group);
  assert(config);

  const endpoint = () => createEndpoint({ endpointName: group })(config);

  const getById =
    ({
      method,
      pickId = identity,
      getField,
      decorate = identity,
      ignoreErrorCodes = [],
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
            endpoint()[method],
            tap((params) => {
              assert(true);
            }),
            when(() => getField, get(getField)),
            when(Array.isArray, first),
            unless(isEmpty, decorate),
          ]),
          switchCase([
            ({ code }) => pipe([() => ignoreErrorCodes, includes(code)])(),
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
            )} result: ${JSON.stringify(result)}`
          );
        }),
      ])();

  const getList =
    ({ method, getParam, decorate = identity }) =>
    () =>
      pipe([
        tap(() => {
          logger.debug(`getList ${type}`);
          assert(method);
          assert(getParam);
          assert(isFunction(endpoint()[method]));
        }),
        endpoint()[method],
        tap((params) => {
          assert(true);
        }),
        get(getParam),
        map(decorate),
        tap((items) => {
          assert(Array.isArray(items));
          logger.debug(`getList ${type} #items ${size(items)}`);
        }),
      ])();

  const getListWithParent =
    ({
      parent: { type, group },
      pickKey,
      method,
      getParam,
      decorate = identity,
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
        flatMap(
          pipe([
            tap((params) => {
              assert(true);
            }),
            pickKey,
            tap((params) => {
              assert(true);
            }),
            endpoint()[method],
            tap((params) => {
              assert(true);
            }),
            get(getParam),
            map(decorate),
          ])
        ),

        tap((items) => {
          logger.debug(`getListWithParent ${type} #items ${size(items)}`);
        }),
      ])();

  const create =
    ({
      method,
      config,
      pickCreated,
      getById,
      isInstanceUp = not(isEmpty),
      shouldRetryOnException = () => false,
    }) =>
    ({ name, payload }) =>
      pipe([
        tap(() => {
          logger.debug(`create ${type}, ${name}`);
          assert(method);
          assert(pickCreated);
          assert(getById);
        }),
        () =>
          retryCall({
            name: `create ${type} ${name}`,
            fn: pipe([
              () => payload,
              tap((params) => {
                assert(true);
              }),
              endpoint()[method],
              tap((params) => {
                assert(true);
              }),
            ]),
            config,
            shouldRetryOnException,
          }),
        pickCreated(payload),
        tap((params) => {
          assert(isObject(params));
          logger.debug(`isUpById: ${name}, ${JSON.stringify(params)}`);
        }),
        tap((params) =>
          retryCall({
            name: `isUpById: ${name}`,
            fn: pipe([() => params, getById, isInstanceUp]),
            config,
          })
        ),
        tap(() => {
          logger.debug(`created ${type}, ${name}`);
        }),
      ])();

  const update =
    ({
      method,
      config,
      pickId = () => ({}),
      extraParam = {},
      filterParams = identity,
      isUpdatedById,
    }) =>
    ({ name, payload, diff, live }) =>
      pipe([
        tap(() => {
          assert(method);
          assert(pickId);
          logger.debug(
            `update ${type}, ${name}, ${JSON.stringify({
              payload,
              live,
              diff,
            })}`
          );
        }),
        () => diff,
        get("liveDiff.updated"),
        defaultsDeep(pickId(live)),
        defaultsDeep(extraParam),
        filterParams,
        tap((params) => {
          assert(params);
          logger.debug(
            `update ${type}, ${name}, params: ${JSON.stringify(params)}`
          );
        }),
        tryCatch(
          pipe([
            endpoint()[method],
            tap.if(
              () => isUpdatedById,
              pipe([
                () => live,
                pickId,
                (params) =>
                  retryCall({
                    name: `isUpById: ${name}`,
                    fn: () => isUpdatedById(params),
                    config,
                  }),
              ])
            ),
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
        tap(() => {
          logger.debug(`updated ${type}, ${name}`);
        }),
      ])();

  const destroy =
    ({
      preDestroy = () => {},
      pickId,
      extraParam = {},
      method,
      getById,
      isInstanceDown = isEmpty,
      ignoreError,
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
        () => live,
        tap(preDestroy),
        pickId,
        (params) =>
          pipe([
            tryCatch(
              pipe([
                tap(() => {
                  logger.debug(
                    `destroy ${type}, ${name} ${JSON.stringify(params)}`
                  );
                }),
                () => params,
                defaultsDeep(extraParam),
                tap((params) => {
                  assert(true);
                }),
                endpoint()[method],
                tap((params) => {
                  assert(true);
                }),
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
                    logger.error(error.stack);
                  }),
                  () => error,
                  switchCase([
                    ignoreError,
                    () => undefined,
                    () => {
                      throw error;
                    },
                  ]),
                ])()
            ),
            tap(() => {
              assert(params);
            }),
            tap.if(
              () => getById,
              () =>
                retryCall({
                  name: `isDestroyed ${type}`,
                  fn: pipe([() => params, getById, isInstanceDown]),
                  config,
                })
            ),
          ])(),
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
