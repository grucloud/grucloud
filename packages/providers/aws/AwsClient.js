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
  assign,
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
const { assignTagsSort, createEndpoint } = require("./AwsCommon");

const shouldRetryOnExceptionCodesDefault =
  (shouldRetryOnExceptionCodes) =>
  ({ error, name }) =>
    pipe([
      tap(() => {
        assert(error.name);
        logger.debug(
          `shouldRetryOnExceptionCodesDefault ${name} ${util.inspect(error)}`
        );
      }),
      () => shouldRetryOnExceptionCodes,
      includes(error.name),
    ])();

const shouldRetryOnExceptionMessagesDefault =
  (shouldRetryOnExceptionMessages) =>
  ({ error, name }) =>
    pipe([
      tap(() => {
        assert(error.message);
        logger.debug(
          `shouldRetryOnExceptionMessagesDefault  ${name} ${util.inspect(
            error
          )}`
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

const AwsClient =
  ({ spec, config }) =>
  (endpoint) => {
    const { type, group, groupType } = spec;
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
      (live) =>
        pipe([
          tap(() => {
            assert(method);
            logger.debug(`getById ${type}`);
          }),
          tryCatch(
            pipe([
              () => live,
              pickId,
              defaultsDeep(extraParams),
              tap((params) => {
                logger.info(`getById ${type}`);
              }),
              (params) => endpoint()[method](params),
              tap((params) => {
                assert(true);
              }),
              when(() => getField, get(getField)),
              tap((params) => {
                assert(true);
              }),
              when(Array.isArray, first),
              unless(
                isEmpty,
                pipe([decorate({ live, endpoint }), assignTagsSort])
              ),
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
                logger.error(
                  `getById ${type} name: ${error.name}, message: ${
                    error.message
                  }, error: ${util.inspect(
                    error
                  )}, ignoreErrorMessages: ${ignoreErrorMessages}, ignoreErrorCodes: ${ignoreErrorCodes}`
                );
                throw error;
              },
            ])
          ),
          tap((result) => {
            // logger.debug(
            //   `getById ${type} result: ${JSON.stringify(result, null, 4)}`
            // );
            logger.debug(`getById ${groupType} done`);
          }),
        ])();

    const getList =
      ({
        method,
        getParam,
        transformListPre = () => identity,
        transformListPost = () => identity,
        decorate = () => identity,
        filterResource = () => true,
        extraParam = {},
        enhanceParams = () => identity,
        ignoreErrorCodes = ["AccessDeniedException"],
        getById,
      }) =>
      ({ lives, params = {} } = {}) =>
        pipe([
          tryCatch(
            pipe([
              tap(() => {
                assert(method);
                assert(getParam);
                //assert(isFunction(endpoint()[method]));
              }),
              () => params,
              defaultsDeep(extraParam),
              defaultsDeep(enhanceParams()()),
              tap((params) => {
                logger.debug(
                  `getList ${groupType}, method: ${method}, params: ${JSON.stringify(
                    params
                  )}`
                );
              }),
              async (params) => {
                let NextToken;
                let data = [];
                do {
                  const results = await endpoint()[method]({
                    ...params,
                    NextToken,
                  });
                  NextToken = results.NextToken;
                  const newData = get(getParam)(results);
                  if (newData) {
                    if (Array.isArray(newData)) {
                      data = [...data, ...newData];
                    } else {
                      data = [...data, newData];
                    }
                  }
                } while (NextToken);
                return data;
              },
              tap((params) => {
                assert(true);
              }),
              transformListPre({ lives, endpoint }),
              filter(filterResource),
              tap((params) => {
                assert(true);
              }),
              map(decorate({ lives, endpoint, getById })),
              transformListPost({ lives, endpoint }),
              tap((params) => {
                assert(true);
              }),
              map(assignTagsSort),
              tap((items) => {
                assert(Array.isArray(items));
                logger.info(`getList ${groupType} #items ${size(items)}`);
              }),
              filter(not(isEmpty)),
              tap((items) => {
                assert(Array.isArray(items));
                logger.info(`getList ${groupType} final #items ${size(items)}`);
              }),
            ]),
            pipe([
              switchCase([
                (error) =>
                  pipe([() => ignoreErrorCodes, includes(error.name)])(),
                pipe([
                  tap((result) => {
                    assert(true);
                  }),
                  () => [],
                ]),
                (error) => {
                  throw error;
                },
              ]),
            ])
          ),
        ])();

    const getListWithParent =
      ({
        parent: { type, group },
        pickKey,
        method,
        getParam,
        decorate = () => identity,
        filterParent = () => true,
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
          filter(filterParent),
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
                  tryCatch(
                    pipe([
                      (param) => endpoint()[method](param),
                      when(() => getParam, get(getParam)),
                      tap((params) => {
                        assert(true);
                      }),
                      switchCase([
                        Array.isArray,
                        pipe([
                          map(
                            decorate({ name, parent: live, lives, endpoint })
                          ),
                          tap((params) => {
                            assert(true);
                          }),
                          when(pipe([first, Array.isArray]), flatten),
                        ]),
                        pipe([
                          tap((params) => {
                            assert(true);
                          }),
                          decorate({ name, parent: live, lives, endpoint }),
                          tap((params) => {
                            assert(true);
                          }),
                          unless(Array.isArray, (result) => [result]),
                          tap((params) => {
                            assert(true);
                          }),
                        ]),
                      ]),
                    ]),
                    (error) => {
                      //TODO
                      assert(true);
                    }
                  ),
                  tap((params) => {
                    assert(true);
                  }),
                ]),
                pipe([
                  decorate({
                    name,
                    managedByOther,
                    parent: live,
                    lives,
                    endpoint,
                  }),
                  unless(Array.isArray, (result) => [result]),
                ]),
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
        isInstanceError = () => false,
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
            logger.info(
              `create ${groupType}, ${name}, configIsUp: ${JSON.stringify(
                configIsUp
              )}`
            );
            assert(method);
            assert(pickCreated);
          }),
          () =>
            retryCall({
              name: `create ${groupType} ${name}`,
              fn: pipe([
                () => payload,
                filterPayload,
                tap((params) => {
                  assert(true);
                }),
                endpoint()[method],
                tap((params) => {
                  logger.debug(
                    `create ${groupType}, name: ${name}, response: ${JSON.stringify(
                      params
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
          tap((params) => {
            assert(true);
          }),
          (created) =>
            pipe([
              () => created,
              pickCreated({ pickId, payload, name, resolvedDependencies }),
              tap((params) => {
                assert(isObject(params));
                // logger.debug(
                //   `create isUpById: ${name}, ${JSON.stringify(params)}`
                // );
                logger.debug(`create ${groupType} isUpById: ${name}`);
              }),
              tap.if(
                () => isFunction(getById),
                (params) =>
                  retryCall({
                    name: `isUpById: ${name}`,
                    fn: pipe([
                      () => params,
                      getById,
                      switchCase([
                        isInstanceUp,
                        identity,
                        isInstanceError,
                        (live) => {
                          const ex = new Error("instance is in error state");
                          ex.live = live;
                          throw ex;
                        },
                        () => false,
                      ]),
                    ]),
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
                endpoint,
              }),
              tap(() => {
                logger.info(`created ${groupType}, ${name}`);
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
            tap((result) => {
              //logger.debug(`update filterParams: ${JSON.stringify(result)}`);
            }),
          ])(),
        getById,
        isInstanceUp = identity,
        filterAll = () => identity,
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
            logger.info(
              `update type: ${type}, method: ${method}, name: ${name}`
            );
            // logger.debug(
            //   `${JSON.stringify({
            //     payload,
            //     live,
            //     diff,
            //   })}`
            // );
          }),
          preUpdate({ name, live, payload, diff, programOptions }),
          () => filterParams({ pickId, extraParam, payload, diff, live }),
          tap((params) => {
            assert(true);
          }),
          defaultsDeep(extraParam),
          tap((input) => {
            // logger.debug(
            //   `update ${type}, ${name}, params: ${JSON.stringify(
            //     input,
            //     null,
            //     4
            //   )}`
            // );
          }),
          tryCatch(
            pipe([
              (input) =>
                retryCall({
                  name: `update ${type} ${name}`,
                  fn: pipe([
                    () => input,
                    endpoint()[method],
                    tap((results) => {
                      // logger.debug(
                      //   `updated ${type} ${name}, response: ${JSON.stringify(
                      //     results
                      //   )}`
                      // );
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
              tap.if(
                () => isFunction(getById),
                () =>
                  retryCall({
                    name: `isUpById: ${name}`,
                    fn: pipe([
                      () => live,
                      getById,
                      tap((params) => {
                        assert(true);
                      }),
                      filterAll({ name }),
                      and([
                        isInstanceUp,
                        pipe([
                          (live) =>
                            compare({
                              ...spec,
                              live,
                              target: filterAll({ name })(payload),
                            }),
                          tap((diff) => {
                            logger.debug(
                              `updating ${type}, ${name}, diff: ${JSON.stringify(
                                diff,
                                null,
                                4
                              )}`
                            );
                          }),
                          not(get("hasDataDiff")),
                        ]),
                      ]),
                    ]),
                    config,
                  })
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
        isInstanceError = () => false,
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
              tap(() => preDestroy({ name, live, lives, endpoint })),
              () => live,
              tap((params) => {
                assert(true);
              }),
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
                () => isFunction(getById),
                () =>
                  retryCall({
                    name: `isDestroyed ${type}`,
                    fn: pipe([
                      () => live,
                      tap((params) => {
                        assert(true);
                      }),
                      getById,
                      tap.if(isInstanceError, (live) => {
                        logger.error(
                          `isInstanceError: ${JSON.stringify(live, null, 4)}`
                        );
                        const error = new Error(
                          `error destroying resource ${name}`
                        );
                        error.live = live;
                        throw error;
                      }),
                      or([isEmpty, isInstanceDown]),
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

exports.AwsClient = AwsClient;

exports.createAwsResource = ({
  spec,
  config,
  model,
  findName,
  findId,
  managedByOther,
  decorate,
  decorateList = ({ getById }) => getById,
  //TODO remove
  isInstanceUp,
  //TODO remove
  isInstanceDown,
  tagResource,
  untagResource,
  cannotBeDeleted,
  findNamespace,
  pickId,
  getByName = () => undefined,
  configDefault,
  findDependencies,
  //TODO remove
  createFilterPayload,
  //TODO remove
  createShouldRetryOnExceptionCodes,
  //TODO remove
  pickCreated,
  postCreate,
  //TODO remove
  updateFilterParams,
  getList,
  create,
  update,
  //TODO remove

  pickIdDestroy,
  destroy,
}) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    () => createEndpoint(model.package, model.client, model.region)(config),
    (endpoint) =>
      pipe([
        () => endpoint,
        AwsClient({ spec, config }),
        (client) =>
          pipe([
            () => ({
              spec,
              getByName,
              findName,
              findId,
              findDependencies,
              cannotBeDeleted,
              managedByOther,
              findNamespace,
              pickId,
              pickIdDestroy: pickIdDestroy || pickId,
              configDefault,
            }),
            when(
              () => tagResource,
              assign({
                tagResource: () => tagResource({ endpoint }),
                untagResource: () => untagResource({ endpoint }),
              })
            ),
            when(
              () => model.getById,
              assign({
                getById: ({ pickId }) =>
                  client.getById({
                    pickId,
                    decorate,
                    ...model.getById,
                    ignoreErrorCodes: model.ignoreErrorCodes,
                  }),
              })
            ),
            assign({
              getList: switchCase([
                () => getList,
                pipe([
                  ({ getById }) =>
                    getList({ client, endpoint, getById, config }),
                ]),
                ({ getById }) =>
                  client.getList({
                    getById,
                    decorate: decorateList,
                    ...model.getList,
                  }),
              ]),
              create: switchCase([
                () => create,
                ({ getById }) => create({ endpoint, getById }),
                ({ getById }) =>
                  client.create({
                    getById,
                    pickCreated,
                    postCreate,
                    filterPayload: createFilterPayload,
                    shouldRetryOnExceptionCodes:
                      createShouldRetryOnExceptionCodes,
                    isInstanceUp,
                    ...model.create,
                  }),
              ]),
              update: switchCase([
                () => update,
                ({ getById }) => update({ endpoint, getById }),
                ({ getById, pickId }) =>
                  client.update({
                    pickId,
                    getById,
                    filterParams: updateFilterParams,
                    isInstanceUp,
                    ...model.update,
                  }),
              ]),
              destroy: switchCase([
                () => destroy,
                ({ getById }) => destroy({ endpoint, getById }),
                ({ getById, pickIdDestroy }) =>
                  client.destroy({
                    pickId: pickIdDestroy,
                    getById,
                    ignoreErrorCodes: model.ignoreErrorCodes,
                    isInstanceDown,
                    ...model.destroy,
                  }),
              ]),
            }),
            assign({
              getByName: ({ getList, findName, getById }) =>
                getByName({ getList, findName, getById, endpoint }),
            }),
            defaultsDeep({
              cannotBeDeleted,
              findNamespace,
            }),
            tap((params) => {
              assert(true);
            }),
          ])(),
      ])(),
  ])();
