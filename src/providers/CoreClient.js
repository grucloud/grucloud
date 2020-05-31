const _ = require("lodash");
const assert = require("assert");
const logger = require("../logger")({ prefix: "CoreClient" });
const toString = (x) => JSON.stringify(x, null, 4);
const identity = (x) => x;
const { retryExpectException } = require("./Retry");
const { getByNameCore, findNameCore } = require("./Common");
module.exports = CoreClient = ({
  spec,
  type,
  axios,
  methods, //TODO use defaults
  configDefault = async ({ name, properties }) => ({
    name,
    ...properties,
  }),
  findName = (item) => findNameCore({ item, field: "name" }),
  onResponseGet = identity,
  onResponseList = identity,
  onResponseCreate = identity,
  onResponseDelete = identity,
}) => {
  assert(spec);
  assert(type);
  const canGet = !methods || methods.get;
  const canCreate = !methods || methods.create;
  const canDelete = !methods || methods.del;
  const canList = !methods || methods.list;

  //Same as findName
  const findId = (item) => item.id;

  const getByName = ({ name }) => getByNameCore({ name, list, findName });

  const getById = async ({ id }) => {
    logger.debug(`get ${toString({ type, id, canGet })}`);
    assert(id);

    if (_.isEmpty(id)) {
      throw Error(`get ${type}: invalid id`);
    }

    if (!canGet) return;

    try {
      const result = await axios.request(`/${id}`, { method: "GET" });
      result.data = onResponseGet(result.data);
      logger.debug(`get ${toString({ result })}`);

      return result;
    } catch (error) {
      //TODO function to print axios error
      logger.error(`get ${type}/${id}, error ${toString(error.response)}`);
      throw error;
    }
  };

  const isUp = async ({ name }) => {
    logger.info(`isUp ${type}/${name}`);
    assert(name, "isUp missing name");
    const instance = await getByName({ name });
    return !!instance;
  };
  const isDown = async ({ name }) => {
    logger.info(`isDown ${type}/${name}`);
    assert(name, "isDown missing name");
    const instance = await getByName({ name });
    return !instance;
  };

  const create = async ({ name, payload }) => {
    logger.debug(`create ${type}/${name}, payload: ${toString(payload)}`);
    assert(name);
    assert(payload);
    if (!canCreate) return;

    try {
      const result = await axios.request("/", {
        method: "POST",
        data: payload,
      });
      result.data = onResponseCreate(result.data);
      logger.debug(`create result: ${toString(result.data)}`);
      return result;
    } catch (error) {
      logger.error(`create type ${type}, error ${toString(error)}`);
      throw error;
    }
  };

  const list = async () => {
    logger.debug(`list type ${type}`);

    if (!canList) return;

    try {
      const result = await axios.request(`/`, { method: "GET" });
      result.data = onResponseList(result.data);
      return result;
    } catch (error) {
      logger.error(`list type ${type}, error ${toString(error)}`);
      throw error;
    }
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ${toString({ type, name, id, canDelete })}`);
    if (!canDelete) return;

    if (_.isEmpty(id)) {
      throw Error(`destroy ${type}: invalid id`);
    }

    try {
      const result = await axios.request(`/${id}`, { method: "DELETE" });
      result.data = onResponseDelete(result.data);
      logger.debug(
        `destroy ${toString({ name, type, id })} should be destroyed`
      );

      //TODO use isDown in CoreProvider
      await retryExpectException({
        fn: () => getById({ id }),
        isExpectedError: (error) =>
          error.response && error.response.status === 404,
      });
      return result;
    } catch (error) {
      logger.error(`delete type ${type}, error TODO`);
      throw error;
    }
  };

  return {
    spec,
    type,
    methods,
    findId,
    getById,
    getByName,
    findName,
    findName,
    isUp,
    isDown,
    create,
    destroy,
    list,
    configDefault,
  };
};
