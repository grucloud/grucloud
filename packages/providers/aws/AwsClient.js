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

const shouldRetryOnExceptionMessagesDefaults = [
  "Service Unavailable. Please try again later",
];

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
    shouldRetryOnExceptionMessagesDefault([
      ...shouldRetryOnExceptionMessages,
      ...shouldRetryOnExceptionMessagesDefaults,
    ]),
  ]);

const AwsClient =
  ({ spec, config }) =>
  (endpoint) => {
    const { type, groupType } = spec;
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
      ({ lives }) =>
      (live) =>
        pipe([
          tap(() => {
            assert(method);
            logger.debug(`getById ${type}`);
            //assert(lives);
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
                pipe([
                  decorate({ live, endpoint, lives, config }),
                  assignTagsSort,
                ])
              ),
            ]),
            pipe([
              tap((params) => {
                assert(true);
              }),
              switchCase([
                or([
                  ({ message }) =>
                    pipe([
                      () => ignoreErrorMessages,
                      any((ignoreMessage) =>
                        pipe([() => message, includes(ignoreMessage)])()
                      ),
                    ])(),
                  ({ name }) =>
                    pipe([() => ignoreErrorCodes, includes(name)])(),
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
              ]),
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
        ignoreErrorCodes = [
          "AccessDeniedException",
          "InvalidAccessException",
          "BadRequestException",
          "ResourceNotFoundException",
        ],
        getById,
      }) =>
      ({ lives, params = {} } = {}) =>
        pipe([
          tryCatch(
            pipe([
              tap(() => {
                assert(method, `no method for ${spec.groupType}`);
                //assert(getParam);
                //assert(isFunction(endpoint()[method]));
              }),
              () => params,
              defaultsDeep(extraParam),
              defaultsDeep(enhanceParams({ config })()),
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
                  const newData = getParam ? get(getParam)(results) : results;
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
              map.withIndex((item, index) =>
                decorate({
                  lives,
                  index,
                  endpoint,
                  getById: getById ? getById({ lives, config }) : undefined,
                  config,
                })(item)
              ),
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
        transformListPost = () => identity,
        config,
      }) =>
      ({ lives }) =>
        pipe([
          tap(() => {
            logger.debug(`getListWithParent ${group}::${type}`);
            assert(lives);
            assert(config);
          }),
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
                      tap((params) => {
                        assert(true);
                      }),
                      when(() => getParam, get(getParam)),
                      tap((params) => {
                        assert(true);
                      }),
                      switchCase([
                        Array.isArray,
                        pipe([
                          map(
                            decorate({
                              name,
                              parent: live,
                              lives,
                              endpoint,
                              config,
                            })
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
                          decorate({
                            name,
                            parent: live,
                            lives,
                            endpoint,
                            config,
                          }),
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
                    config,
                  }),
                  unless(Array.isArray, (result) => [result]),
                ]),
              ]),
              tap((params) => {
                assert(true);
              }),
              transformListPost({ lives, endpoint }),
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
        configIsUp,
        pickCreated = () => identity,
        pickId,
        getById,
        isInstanceUp = not(isEmpty),
        isInstanceError = () => false,
        getErrorMessage = () => "error",
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
              `create ${groupType}, ${name}, ${
                config.region
              }, configIsUp: ${JSON.stringify(configIsUp)}`
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
                endpoint()[isFunction(method) ? method()(payload) : method],
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
              pickCreated({
                endpoint,
                pickId,
                payload,
                name,
                resolvedDependencies,
              }),
              tap((params) => {
                assert(
                  isObject(params),
                  `create pickCreated should return an object`
                );
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
                      getById({ lives, config }),
                      switchCase([
                        isInstanceUp,
                        identity,
                        isInstanceError,
                        (live) => {
                          const ex = new Error(getErrorMessage(live));
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
        preUpdate = () => identity,
        postUpdate = () => identity,
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
      ({ name, payload, diff, live, lives, compare, programOptions }) =>
        pipe([
          tap(() => {
            assert(method);
            assert(pickId);
            assert(compare);
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
          () => live,
          preUpdate({ name, payload, diff, programOptions }),
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
                      getById({ lives, config }),
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
        preDestroy = () => identity,
        postDestroy = () => identity,
        pickId,
        enhanceParams = () => identity,
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
      }) =>
      ({ name, live, lives }) =>
        pipe([
          tap(() => {
            assert(isFunction(pickId), `no pickId for destroy ${groupType}`);
            assert(method);
            assert(ignoreError);
          }),
          tryCatch(
            pipe([
              () => live,
              preDestroy({
                name,
                lives,
                config,
                endpoint,
                getById: getById ? getById({ lives, config }) : undefined,
              }),
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
              enhanceParams({ config }),
              (params) =>
                retryCall({
                  name: `destroying ${type}`,
                  fn: pipe([
                    () => params,
                    tap((params) => {
                      assert(true);
                    }),
                    endpoint()[method],
                    () => live,
                    tap(postDestroy({ name, endpoint, lives, config })),
                    when(
                      () => isFunction(getById),
                      () =>
                        retryCall({
                          name: `isDestroyed ${type}`,
                          fn: pipe([
                            () => live,
                            tap((params) => {
                              assert(true);
                            }),
                            getById({ lives, config }),
                            tap((params) => {
                              assert(true);
                            }),
                            tap.if(isInstanceError, (live) => {
                              logger.error(
                                `isInstanceError: ${JSON.stringify(
                                  live,
                                  null,
                                  4
                                )}`
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
              tap((params) => {
                assert(true);
              }),
            ]),
            (error = {}, params) =>
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
                  pipe([() => undefined]),
                  () => {
                    logger.error(error.stack);
                    throw error;
                  },
                ]),
              ])()
          ),
          tap((result) => {
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
  tagResource,
  isDefault,
  untagResource,
  cannotBeDeleted,
  findNamespace,
  pickId,
  getByName = () => undefined,
  configDefault,
  findDependencies,
  getById,
  getList,
  create,
  update,
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
              isDefault,
              cannotBeDeleted,
              managedByOther,
              findNamespace,
              pickId,
              configDefault,
            }),
            when(
              () => tagResource,
              assign({
                tagResource: () => tagResource({ endpoint }),
                untagResource: () => untagResource({ endpoint }),
              })
            ),
            switchCase([
              () => isFunction(getById),
              assign({
                getById: ({}) => getById({ client, endpoint }),
              }),
              () => isFunction(model.getById),
              assign({
                getById: ({}) => model.getById({ client, endpoint }),
              }),
              () => isObject(model.getById),
              assign({
                getById: ({ pickId }) =>
                  client.getById({
                    pickId,
                    ignoreErrorCodes: model.ignoreErrorCodes,
                    ...model.getById,
                  }),
              }),
              identity,
            ]),
            assign({
              getList: switchCase([
                () => isFunction(getList),
                pipe([
                  ({ getById }) =>
                    getList({ client, endpoint, getById, config }),
                ]),
                () => isFunction(model.getList),
                pipe([
                  ({ getById }) =>
                    model.getList({ client, endpoint, getById, config }),
                ]),
                () => isObject(model.getList),
                ({ getById }) =>
                  client.getList({
                    getById,
                    ...model.getList,
                  }),
                pipe([
                  tap((params) => {
                    assert(true);
                  }),
                ]),
              ]),
              create: switchCase([
                () => isFunction(create),
                ({ getById }) => create({ endpoint, getById }),
                () => isFunction(model.create),
                ({ getById }) => model.create({ endpoint, getById }),
                () => isObject(model.create),
                ({ getById }) =>
                  client.create({
                    getById,
                    ...model.create,
                  }),
                identity,
              ]),
              update: switchCase([
                () => isFunction(update),
                ({ getById }) => update({ endpoint, getById, pickId }),
                () => isFunction(model.update),
                ({ getById }) => model.update({ endpoint, getById, pickId }),
                () => isObject(model.update),
                ({ getById, pickId }) =>
                  client.update({
                    pickId,
                    getById,
                    ...model.update,
                  }),

                identity,
              ]),
              destroy: switchCase([
                () => isFunction(destroy),
                ({ getById }) => destroy({ endpoint, getById }),
                () => isFunction(model.destroy),
                ({ getById }) => model.destroy({ endpoint, getById }),
                () => isObject(model.destroy),
                ({ getById }) =>
                  client.destroy({
                    getById,
                    ignoreErrorCodes: model.ignoreErrorCodes,
                    ...model.destroy,
                  }),
                identity,
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
