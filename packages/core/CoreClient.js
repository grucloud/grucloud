const assert = require("assert");
const {
  assign,
  tryCatch,
  pipe,
  tap,
  switchCase,
  eq,
  get,
  map,
  not,
} = require("rubico");
const { isEmpty, defaultsDeep, flatten, unless } = require("rubico/x");

const logger = require("./logger")({ prefix: "CoreClient" });
const { tos } = require("./tos");
const identity = (x) => x;
const { retryCall, retryCallOnError } = require("./Retry");
const { getByNameCore, logError, axiosErrorToJSON } = require("./Common");

module.exports = CoreClient = ({
  spec,
  type,
  config,
  lives,
  axios,
  pathGet = ({ id }) => `/${id}`,
  pathCreate = () => `/`,
  pathDelete = ({ id }) => `/${id}`,
  pathUpdate = ({ id }) => `/${id}`,
  pathList = () => `/`,
  verbGet = "GET",
  verbList = "GET",
  verbCreate = "POST",
  verbUpdate = "PATCH",
  isInstanceUp = not(isEmpty),
  isInstanceDown = isEmpty,

  configDefault = ({ name, properties }) => ({
    name,
    ...properties,
  }),
  findName = pipe([
    get("live.name"),
    tap((name) => {
      assert(name, "missing name");
    }),
  ]),
  findId = get("live.id"),
  findTargetId = () => get("id"),
  decorate = () => identity,
  //TODO curry
  onResponseGet = get("data"),
  onResponseList = () => identity,
  onResponseCreate = () => identity,
  onResponseDelete = identity,
  onResponseUpdate = identity,
  isDefault,
  managedByOther = () => false,
  cannotBeDeleted,
  shouldRetryOnException,
  onCreateExpectedException,
  findDependencies,
  isUpById,
  isDownById,
  getList,
  getById,
  getByName,
  create,
  destroy,
}) =>
  pipe([
    tap((params) => {
      assert(lives);
      assert(spec);
      assert(type);
      assert(config, "config");
    }),
    () => ({
      spec,
      type,
      config,
      findId,
      findDependencies,
      isInstanceUp,
      isInstanceDown,
      findName,
      isDefault,
      managedByOther,
      cannotBeDeleted: cannotBeDeleted || managedByOther,
      shouldRetryOnException,
      isUpById,
      isDownById,
      getList,
      getById,
      getByName,
      create,
      destroy,
      configDefault,
      axios,
    }),
    tap((params) => {
      assert(true);
    }),
    defaultsDeep({
      getById: ({ name, id }) =>
        tryCatch(
          pipe([
            tap(() => {
              logger.info(
                `getById ${JSON.stringify({ type: spec.type, name, id })}`
              );
              assert(!isEmpty(id), `getById ${type}: invalid id`);
              assert(!spec.listOnly);
            }),
            () => pathGet({ id }),
            (path) =>
              retryCallOnError({
                name: `getById type ${spec.type}, name: ${name}, path: ${path}`,
                fn: () =>
                  axios.request(path, {
                    method: verbGet,
                  }),
                config,
              }),
            get("data"),
            (data) => onResponseGet({ id, data }),
            tap((params) => {
              assert(true);
            }),
            decorate({ axios, lives }),
            tap((data) => {
              logger.debug(`getById result: ${tos(data)}`);
            }),
          ]),
          switchCase([
            eq(get("response.status"), 404),
            () => {},
            (error) => {
              logError("getById", error);
              throw axiosErrorToJSON(error);
            },
            () => {},
          ])
        )(),
      getList: tryCatch(
        pipe([
          tap((params) => {
            logger.debug(`getList ${spec.type}`);
          }),
          pathList,
          tap((params) => {
            assert(true);
          }),
          unless(Array.isArray, (path) => [path]),
          map.pool(
            50,
            pipe([
              (path) =>
                retryCallOnError({
                  name: `getList type: ${spec.type}, path ${path}`,
                  fn: () =>
                    axios.request(path, {
                      method: verbList,
                    }),
                  config,
                }),
              get("data"),
              tap((data) => {
                logger.debug(`getList ${spec.type}, ${tos(data)}`);
              }),
              onResponseList({ axios }),
              map(decorate({ axios, lives })),
            ])
          ),
          flatten,
          tap((params) => {
            assert(true);
          }),
        ]),
        (error) => {
          logError(`getList ${spec.type}`, error);
          throw axiosErrorToJSON(error);
        }
      ),
    }),
    (client) =>
      pipe([
        () => client,
        defaultsDeep({
          getByName: getByNameCore(client),
          isUpById: pipe([client.getById, isInstanceUp]),
          isDownById: pipe([client.getById, isInstanceDown]),
        }),
      ])(),
    assign({
      create:
        ({ isUpById }) =>
        ({ name, payload, dependencies = () => ({}) }) =>
          tryCatch(
            pipe([
              tap(() => {
                logger.debug(
                  `create ${type}/${name}, payload: ${tos(payload)}`
                );
                assert(name);
                assert(payload);
                assert(!spec.singleton);
                assert(!spec.listOnly);
              }),
              () => ({ dependencies: dependencies(), name, payload }),
              pathCreate,
              tap((path) => {
                logger.info(`create ${spec.type}/${name}, path: ${path}`);
              }),
              (path) =>
                pipe([
                  () =>
                    retryCallOnError({
                      name: `create ${spec.type}/${name}`,
                      isExpectedException: onCreateExpectedException,
                      shouldRetryOnException,
                      fn: () =>
                        axios.request(path, {
                          method: verbCreate,
                          data: payload,
                        }),
                      config: { ...config, repeatCount: 0 },
                    }),
                  tap((result) => {
                    logger.info(
                      `created ${spec.type}/${name}, status: ${
                        result.status
                      }, data: ${tos(result.data)}`
                    );
                  }),
                  switchCase([
                    eq(get("response.status"), 409),
                    () => {
                      logger.error(
                        `create: already created ${type}/${name}, 409`
                      );
                      //TODO get by id ?
                    },
                    pipe([
                      tap((result) => {
                        assert(result);
                      }),
                      get("data"),
                      onResponseCreate({ name, payload }),
                      (data) =>
                        pipe([
                          () => data,
                          findTargetId({ path }),
                          tap((id) => {
                            logger.debug(
                              `create: ${spec.type}/${name} findTargetId ${id}`
                            );
                            if (!id) {
                              assert(
                                id,
                                `no target id from result: ${tos(data)}`
                              );
                            }
                          }),
                          (id) =>
                            pipe([
                              () =>
                                retryCall({
                                  name: `create isUpById ${spec.type}/${name}, id: ${id}`,
                                  fn: () =>
                                    isUpById({ type: spec.type, name, id }),
                                  config,
                                }),
                              () => onResponseGet({ id, data }),
                            ])(),
                        ])(),
                    ]),
                  ]),
                ])(),
            ]),
            (error) => {
              logError(`create ${type}/${name}`, error);
              throw axiosErrorToJSON(error);
            }
          )(),
      update:
        ({ isUpById }) =>
        ({ id, name, payload, dependencies = () => ({}) }) =>
          tryCatch(
            pipe([
              tap(() => {
                logger.info(`update ${tos({ type, name, id })}`);
              }),
              () => ({ id, name, payload, dependencies: dependencies() }),
              tap((params) => {
                assert(true);
              }),
              pathUpdate,
              (path) =>
                retryCallOnError({
                  name: `update type ${spec.type}, path: ${path}`,
                  fn: () =>
                    axios.request(path, {
                      method: verbUpdate,
                      data: payload,
                    }),
                  isExpectedResult: () => true,
                  config: { ...config, repeatCount: 0 },
                }),
              get("data"),
              onResponseUpdate,
              tap(() =>
                retryCall({
                  name: `update type: ${spec.type}, name: ${name}, isDownById`,
                  fn: () => isUpById({ id, name }),
                  config,
                })
              ),
              tap((data) => {
                logger.info(`update ${tos({ name, type, id, data })} updated`);
              }),
            ]),
            (error) => {
              logError(`update ${type}/${name}`, error);
              throw axiosErrorToJSON(error);
            }
          )(),
      destroy:
        ({ isDownById }) =>
        ({ id, name, dependencies = () => ({}) }) =>
          tryCatch(
            pipe([
              tap(() => {
                logger.info(`destroy ${tos({ type, name, id })}`);
                assert(!spec.singleton);
                assert(!spec.listOnly);
                assert(!isEmpty(id), `destroy ${type}: invalid id`);
              }),
              () => ({ id, name, dependencies: dependencies() }),
              tap((params) => {
                assert(true);
              }),
              pathDelete,
              (path) =>
                retryCallOnError({
                  name: `destroy type ${spec.type}, path: ${path}`,
                  fn: () => axios.delete(path),
                  isExpectedResult: () => true,
                  config: { ...config, repeatCount: 0 },
                  isExpectedException: eq(get("response.status"), 404),
                  shouldRetryOnException: eq(get("error.response.status"), 409),
                }),
              get("data"),
              onResponseDelete,
              tap(() =>
                retryCall({
                  name: `destroy type: ${spec.type}, name: ${name}, isDownById`,
                  fn: () => isDownById({ id, name }),
                  config,
                })
              ),
              tap((data) => {
                logger.info(
                  `destroy ${tos({ name, type, id, data })} destroyed`
                );
              }),
            ]),
            (error) => {
              logError(`delete ${type}/${name}`, error);
              throw axiosErrorToJSON(error);
            }
          )(),
    }),
    tap((params) => {
      assert(true);
    }),
  ])();
