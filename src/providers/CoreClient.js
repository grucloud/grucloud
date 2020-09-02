const { isEmpty } = require("rubico/x");
const assert = require("assert");

const logger = require("../logger")({ prefix: "CoreClient" });
const { tos } = require("../tos");
const identity = (x) => x;
const { retryExpectOk, retryCallOnTimeout } = require("./Retry");
const {
  getByNameCore,
  findField,
  isUpByIdCore,
  isDownByIdCore,
  logError,
} = require("./Common");

const errorToJSON = (error) => ({
  isAxiosError: true,
  message: error.message,
  name: error.name,
  config: error.config,
  code: error.code,
  stack: error.stack,
  response: {
    status: error.response?.status,
    data: error.response?.data,
  },
});

module.exports = CoreClient = ({
  spec,
  type,
  config,
  axios,
  pathGet = (id) => `/${id}`,
  pathCreate = () => `/`,
  pathDelete = (id) => `/${id}`,
  pathList = () => `/`,
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
  onResponseGet = identity,
  onResponseList = identity,
  onResponseCreate = identity,
  onResponseDelete = identity,
  cannotBeDeleted = () => false,
  shouldRetryOnException,
}) => {
  assert(spec);
  assert(type);
  assert(config, "config");

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = async ({ id }) => {
    logger.debug(`getById ${tos({ type, id })}`);
    assert(id);
    assert(!isEmpty(id), `getById ${type}: invalid id`);
    assert(!spec.listOnly);

    try {
      const path = pathGet(id);
      logger.debug(`getById path: ${path}`);

      const result = await retryCallOnTimeout({
        name: `getById type ${spec.type}, path: ${path}`,
        fn: async () =>
          await axios.request(path, {
            method: "GET",
          }),
        config,
      });
      const data = onResponseGet(result.data);
      logger.debug(`get ${tos(data)}`);
      return data;
    } catch (error) {
      const status = error.response?.status;
      logger.debug(`getById status: ${status}`);
      if (status != 404) {
        logError("getById", error);
        throw errorToJSON(error);
      }
    }
  };

  const getList = async () => {
    try {
      const path = pathList();
      const result = await retryCallOnTimeout({
        name: `getList type: ${spec.type}, path ${path}`,
        fn: async () =>
          await axios.request(path, {
            method: "GET",
          }),
        config,
      });

      //logger.debug(`getList type ${type}: ${tos(result.data)}`);

      const data = onResponseList(result.data);
      return data;
    } catch (error) {
      logError(`getList ${type}`, error);
      throw errorToJSON(error);
    }
  };

  const isUpById = isUpByIdFactory({ getById, getList, findId });
  const isDownById = isDownByIdCore({ getById, getList, findId });

  const create = async ({ name, payload, dependencies }) => {
    logger.debug(`create ${type}/${name}, payload: ${tos(payload)}`);
    assert(name);
    assert(payload);
    assert(!spec.listOnly);

    try {
      const path = pathCreate({ dependencies, name });
      logger.debug(`create ${spec.type}/${name}`);

      const result = await retryCallOnTimeout({
        name: `create ${spec.type}/${name}`,
        fn: async () =>
          await axios.request(path, {
            method: verbCreate,
            data: payload,
          }),
        config,
      });

      const data = onResponseCreate(result.data);
      logger.debug(`create result: ${tos(data)}`);

      const id = findTargetId(data);
      logger.debug(`create findTargetId: ${id}`);

      assert(id, "no target id from result");
      const resource = await retryExpectOk({
        name: `create ${spec.type}/${name}`,
        fn: () => isUpById({ id }),
        config,
      });
      logger.debug(`created ${type}/${name}`);
      return onResponseGet(resource);
    } catch (error) {
      logError(`create ${type}/${name}`, error);
      throw errorToJSON(error);
    }
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ${tos({ type, name, id })}`);

    assert(!spec.listOnly);
    assert(!isEmpty(id), `destroy ${type}: invalid id`);

    try {
      const path = pathDelete(id);
      logger.debug(`destroy url: ${path}`);
      const result = await retryCallOnTimeout({
        name: `destroy type ${spec.type}, path: ${path}`,
        fn: async () =>
          await axios.request(path, {
            method: "DELETE",
          }),
        config,
      });

      const data = onResponseDelete(result.data);
      logger.debug(
        `destroy ${tos({ name, type, id, data })} should be destroyed`
      );

      return data;
    } catch (error) {
      logError(`delete ${type}/${name}`, error);
      throw errorToJSON(error);
    }
  };

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
  };
};
