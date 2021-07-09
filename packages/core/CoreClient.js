const assert = require("assert");
const { tryCatch, pipe, tap, switchCase, eq, get } = require("rubico");
const { isEmpty } = require("rubico/x");

const logger = require("./logger")({ prefix: "CoreClient" });
const { tos } = require("./tos");
const identity = (x) => x;
const { retryCall, retryCallOnError } = require("./Retry");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
  logError,
  axiosErrorToJSON,
} = require("./Common");

module.exports = CoreClient = ({
  spec,
  type,
  config,
  axios,
  pathGet = ({ id }) => `/${id}`,
  pathCreate = () => `/`,
  pathDelete = ({ id }) => `/${id}`,
  pathList = () => `/`,
  verbGet = "GET",
  verbList = "GET",
  verbCreate = "POST",
  isInstanceUp,
  isDefault,
  isUpByIdFactory = ({ getById }) => isUpByIdCore({ getById }),
  isDownByIdFactory = ({ getById }) => isDownByIdCore({ getById }),
  configDefault = async ({ name, properties }) => ({
    name,
    ...properties,
  }),
  findName = get("live.name"),
  findId = get("live.id"),
  findTargetId = get("id"),
  onResponseGet = get("data"),
  onResponseList = identity,
  onResponseCreate = identity,
  onResponseDelete = identity,
  cannotBeDeleted = () => false,
  shouldRetryOnException,
  onCreateExpectedException,
  findDependencies,
}) => {
  assert(spec);
  assert(type);
  assert(config, "config");

  const getById = async ({ name, id }) =>
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
        tap((data) => {
          logger.debug(`getById result: ${tos(data)}`);
        }),
      ]),
      switchCase([
        (error) => error.response?.status !== 404,
        (error) => {
          logError("getById", error);
          throw axiosErrorToJSON(error);
        },
        () => {},
      ])
    )();

  const getList = tryCatch(
    pipe([
      tap((params) => {
        logger.debug(`getList ${spec.type}`);
      }),
      () => pathList(),
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
      onResponseList,
      tap(({ total }) => {
        logger.info(`getList ${spec.type}, #items: ${total}`);
      }),
    ]),
    (error) => {
      logError(`getList ${spec.type}`, error);
      throw axiosErrorToJSON(error);
    }
  );

  const getByName = getByNameCore({ getList, findName });
  const isUpById = isUpByIdFactory({ getById, getList, findId });
  const isDownById = isDownByIdFactory({ getById, getList, findId });

  const create = async ({ name, payload, dependencies }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(`create ${type}/${name}, payload: ${tos(payload)}`);
          assert(name);
          assert(payload);
          assert(!spec.singleton);
          assert(!spec.listOnly);
        }),
        () => pathCreate({ dependencies, name }),
        tap((path) => {
          logger.info(`create ${spec.type}/${name}, path: ${path}`);
        }),
        (path) =>
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
            logger.error(`create: already created ${type}/${name}, 409`);
            //TODO get by id ?
          },
          pipe([
            tap((result) => {
              assert(result.data, "result.data");
            }),

            (result) => onResponseCreate(result.data),
            (data) =>
              pipe([
                () => findTargetId(data),
                tap((id) => {
                  assert(id, `no target id from result: ${tos(data)}`);
                }),
                (id) =>
                  pipe([
                    () =>
                      retryCall({
                        name: `create isUpById ${spec.type}/${name}, id: ${id}`,
                        fn: () => isUpById({ type: spec.type, name, id }),
                        config,
                      }),
                    (resource) => onResponseGet({ id, data: resource }),
                  ])(),
              ])(),
          ]),
        ]),
      ]),
      (error) => {
        logError(`create ${type}/${name}`, error);
        throw axiosErrorToJSON(error);
      }
    )();

  const destroy = async ({ id, name }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`destroy ${tos({ type, name, id })}`);
          assert(!spec.singleton);
          assert(!spec.listOnly);
          assert(!isEmpty(id), `destroy ${type}: invalid id`);
        }),
        () => pathDelete({ id }),
        (path) =>
          retryCallOnError({
            name: `destroy type ${spec.type}, path: ${path}`,
            fn: () => axios.delete(path),
            isExpectedResult: () => true,
            config: { ...config, repeatCount: 0 },
            isExpectedException: (error) => {
              return [404].includes(error.response?.status);
            },
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
          logger.info(`destroy ${tos({ name, type, id, data })} destroyed`);
        }),
      ]),
      (error) => {
        logError(`delete ${type}/${name}`, error);
        throw axiosErrorToJSON(error);
      }
    )();

  return {
    spec,
    type,
    config,
    findId,
    findDependencies,
    getById,
    getByName,
    isInstanceUp,
    findName,
    isDefault,
    cannotBeDeleted,
    shouldRetryOnException,
    isUpById,
    isDownById,
    create,
    destroy,
    getList,
    configDefault,
    axios,
  };
};
