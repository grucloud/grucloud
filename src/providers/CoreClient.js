const _ = require("lodash");
const logger = require("../logger")({ prefix: "CoreClient" });
const toString = (x) => JSON.stringify(x, null, 4);
const noop = () => ({});
const identity = (x) => x;
const { retryExpectException, retryExpectOk } = require("./Retry");

module.exports = CoreClient = ({
  spec,
  type,
  axios,
  onResponseGet = identity,
  onResponseList = identity,
  onResponseCreate = identity,
  onResponseDelete = identity,
}) => {
  const { methods } = spec;
  const canGet = !methods || methods.get;
  const canCreate = !methods || methods.create;
  const canDelete = !methods || methods.del;
  const canList = !methods || methods.list;

  const getById = async ({ id }) => {
    logger.debug(`get ${toString({ type, id, canGet })}`);

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
      logger.error(`get ${type}/${id}, error ${error.response}`);
      throw error;
    }
  };

  const getByName = async ({ name }) => {
    logger.info(`getByName ${type}/${name}`);
    if (!name) {
      throw Error(`getByName no name`);
    }
    const {
      data: { items },
    } = await list();
    const instance = spec.getByName({ name, items });
    logger.info(`getByName ${type}/${name}, out: ${toString(instance)}`);
    return instance;
  };

  const create = async ({ name, payload }) => {
    logger.debug(`create ${type}/${name}, payload: ${toString(payload)}`);

    if (!canCreate) return;

    try {
      const result = await axios.request("/", {
        method: "POST",
        data: payload,
      });
      result.data = onResponseCreate(result.data);
      logger.debug(`create result: ${toString(result.data)}`);

      await retryExpectOk({
        fn: () => getByName({ name }),
        isOk: (result) => result,
      });

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
    getById,
    getByName,
    create,
    destroy,
    list,
  };
};
