const { isEmpty } = require("rubico/x");
const assert = require("assert");

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

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = async ({ id }) => {
    logger.debug(`getById ${tos({ type, id })}`);
    assert(id);
    assert(!isEmpty(id), `getById ${type}: invalid id`);
    assert(!spec.listOnly);

    try {
      const path = pathGet(id);
      logger.debug(`getById path: ${path}`);

      const result = await retryCallOnError({
        name: `getById type ${spec.type}, path: ${path}`,
        fn: async () =>
          await axios.request(path, {
            method: verbGet,
          }),
        config,
      });
      const data = onResponseGet({ id, data: result.data });
      logger.debug(`get ${tos(data)}`);
      return data;
    } catch (error) {
      const status = error.response?.status;
      logger.debug(`getById status: ${status}`);
      if (status != 404) {
        logError("getById", error);
        throw axiosErrorToJSON(error);
      }
    }
  };

  const getList = async ({ resources }) => {
    try {
      const path = pathList({ resources });
      const result = await retryCallOnError({
        name: `getList type: ${spec.type}, path ${path}`,
        fn: async () =>
          await axios.request(path, {
            method: verbList,
          }),
        config,
      });

      const data = onResponseList(result.data);
      return data;
    } catch (error) {
      logError(`getList ${spec.type}`, error);
      throw axiosErrorToJSON(error);
    }
  };

  const isUpById = isUpByIdFactory({ getById, getList, findId });
  const isDownById = isDownByIdCore({ getById, getList, findId });

  const create = async ({ name, payload, dependencies }) => {
    logger.debug(`create ${type}/${name}, payload: ${tos(payload)}`);
    assert(name);
    assert(payload);
    assert(!spec.singleton);
    assert(!spec.listOnly);

    try {
      const path = pathCreate({ dependencies, name });
      logger.info(`create ${spec.type}/${name}`);

      const result = await retryCallOnError({
        name: `create ${spec.type}/${name}`,
        isExpectedException: onCreateExpectedException,
        fn: async () =>
          await axios.request(path, {
            method: verbCreate,
            data: payload,
          }),
        config,
      });

      if (result.response?.status === 409) {
        logger.debug(`create: already created ${type}/${name}, 409`);
        return;
      }
      assert(result.data, "result.data");
      const data = onResponseCreate(result.data);
      logger.info(`create result: ${tos(data)}`);

      const id = findTargetId(data);
      logger.debug(`create findTargetId: ${id}`);

      assert(id, "no target id from result");
      const resource = await retryExpectOk({
        name: `create ${spec.type}/${name}`,
        fn: () => isUpById({ id }),
        config,
      });
      logger.info(`created ${type}/${name}`);
      return onResponseGet({ id, data: resource });
    } catch (error) {
      logError(`create ${type}/${name}`, error);
      throw axiosErrorToJSON(error);
    }
  };

  const destroy = async ({ id, name }) => {
    logger.info(`destroy ${tos({ type, name, id })}`);
    assert(!spec.singleton);
    assert(!spec.listOnly);
    assert(!isEmpty(id), `destroy ${type}: invalid id`);

    try {
      const path = pathDelete(id);
      logger.debug(`destroy url: ${path}`);
      const result = await retryCallOnError({
        name: `destroy type ${spec.type}, path: ${path}`,
        fn: async () =>
          await axios.request(path, {
            method: "DELETE",
          }),
        config,
      });

      const data = onResponseDelete(result.data);
      logger.info(`destroy ${tos({ name, type, id, data })} destroyed`);

      return data;
    } catch (error) {
      logError(`delete ${type}/${name}`, error);
      throw axiosErrorToJSON(error);
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
    axios,
  };
};
