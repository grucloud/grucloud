const assert = require("assert");
const { tryCatch, pipe, tap, switchCase } = require("rubico");
const { isEmpty } = require("rubico/x");

const logger = require("../logger")({ prefix: "CoreClient" });
const { tos } = require("../tos");
const identity = (x) => x;
const { retryExpectOk, retryCallOnError } = require("./Retry");
const {
  getByNameCore,
  findField,
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
  pathGet = (id) => `/${id}`,
  pathCreate = () => `/`,
  pathDelete = (id) => `/${id}`,
  pathList = () => `/`,
  verbGet = "GET",
  verbList = "GET",
  verbCreate = "POST",
  isUpByIdFactory = ({ getById }) => isUpByIdCore({ getById }),
  configDefault = async ({ name, properties }) => ({
    name,
    ...properties,
  }),
  findName = (item) => findField({ item, field: "name" }),
  findId = (item) => {
    return item.id;
  },
  findTargetId = (item) => item.id,
  onResponseGet = ({ data }) => data,
  onResponseList = identity,
  onResponseCreate = identity,
  onResponseDelete = identity,
  cannotBeDeleted = () => false,
  shouldRetryOnException,
  onCreateExpectedException,
}) => {
  assert(spec);
  assert(type);
  assert(config, "config");

  const getByName = ({ provider, name }) =>
    getByNameCore({ provider, name, getList, findName });

  const getById = async ({ name, id }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(
            `getById ${JSON.stringify({ type: spec.type, name, id })}`
          );
          assert(!isEmpty(id), `getById ${type}: invalid id`);
          assert(!spec.listOnly);
        }),
        () => pathGet(id),
        async (path) =>
          await retryCallOnError({
            name: `getById type ${spec.type}, name: ${name}, path: ${path}`,
            fn: async () =>
              await axios.request(path, {
                method: verbGet,
              }),
            config,
          }),
        (result) => onResponseGet({ id, data: result.data }),
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
      () => pathList(),
      (path) =>
        retryCallOnError({
          name: `getList type: ${spec.type}, path ${path}`,
          fn: async () =>
            await axios.request(path, {
              method: verbList,
            }),
          config,
        }),
      (result) => onResponseList(result.data),
    ]),
    (error) => {
      logError(`getList ${spec.type}`, error);
      throw axiosErrorToJSON(error);
    }
  );

  const isUpById = isUpByIdFactory({ getById, getList, findId });
  const isDownById = isDownByIdCore({ getById, getList, findId });

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
            fn: async () =>
              await axios.request(path, {
                method: verbCreate,
                data: payload,
              }),
            config,
          }),
        tap((result) => {
          logger.info(
            `created ${spec.type}/${name}, status: ${
              result.status
            }, data: ${tos(result.data)}`
          );
        }),
        switchCase([
          (result) => result.status === 409,
          () => {
            logger.debug(`create: already created ${type}/${name}, 409`);
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
                      retryExpectOk({
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
        () => pathDelete(id),
        (path) =>
          retryCallOnError({
            name: `destroy type ${spec.type}, path: ${path}`,
            fn: async () =>
              await axios.request(path, {
                method: "DELETE",
              }),
            config,
            isExpectedException: (error) => {
              return [404].includes(error.response?.status);
            },
          }),
        (result) => onResponseDelete(result.data),
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
    getById,
    getByName,
    findName,
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
