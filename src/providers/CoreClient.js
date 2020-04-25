const _ = require("lodash");
const Promise = require("bluebird");
const Axios = require("axios");
const logger = require("../logger")({ prefix: "CoreClient" });
const toString = (x) => JSON.stringify(x, null, 4);
const noop = () => ({});
const identity = (x) => x;

const retryExpectException = async (
  { fn, isExpectedError, delay = 1e3 },
  count = 10
) => {
  logger.debug(`retryExpectException count: ${count}, delay: ${delay}`);
  if (count === 0) {
    throw Error("timeout");
  }
  try {
    await fn();
    throw Error("No exception, Have to retry");
  } catch (error) {
    if (isExpectedError(error)) {
      return true;
    }
    logger.debug(
      `retryExpectException count: ${count}, waiting delay: ${delay}`
    );

    await Promise.delay(delay);
    return retryExpectException({ fn, isExpectedError }, --count);
  }
};

module.exports = CoreClient = ({
  spec = {},
  type,
  baseURL,
  onHeaders = noop,
  onResponseGet = identity,
  onResponseList = identity,
  onResponseCreate = identity,
  onResponseDelete = identity,
}) => {
  const axios = Axios.create({
    baseURL,
    timeout: 30e3,
    withCredentials: true,
    headers: { ...onHeaders(), "Content-Type": "application/json" },
    transformRequest: [
      (data, headers) => {
        logger.info(
          `tx ${baseURL} ${data ? JSON.stringify(data, null, 4) : ""}`
        );
        return JSON.stringify(data);
      },
    ],
    transformResponse: [
      (data) => {
        logger.debug(`rx baseURL: ${baseURL}, ${data}`);
        try {
          return data && JSON.parse(data);
        } catch (error) {
          logger.error("rx could not parse data", data);
          return data;
        }
      },
    ],
  });
  const { methods } = spec;
  const canGet = !methods || methods.get;
  const canCreate = !methods || methods.create;
  const canDelete = !methods || methods.del;
  const canList = !methods || methods.list;

  // TODO get by name or id ?
  const get = async (name) => {
    logger.debug(`get ${toString({ type, name, canGet })}`);

    if (_.isEmpty(name)) {
      throw Error(`get ${type}: invalid name`);
    }

    if (!canGet) return;

    try {
      const result = await axios.request(`/${name}`, { method: "GET" });
      result.data = onResponseGet(result.data);
      return result;
    } catch (error) {
      logger.error(
        ` get ${type}/${name}, error TODO}` //TODO function to print axios error
      );
      throw error;
    }
  };

  const waitDestroyed = async ({ id, name }) => {
    logger.info(`waitDestroyed ${toString({ type, name, id })}`);

    await retryExpectException({
      fn: () => get(id),
      isExpectedError: (error) =>
        error.response && error.response.status === 404,
    });
  };
  return {
    spec,
    type,
    get, // TODO change name to getById
    destroy: async ({ id, name }) => {
      logger.debug(
        `destroy ${toString({ type: spec.type, name, id, canDelete })}`
      );
      if (!canDelete) return;

      if (_.isEmpty(id)) {
        throw Error(`destroy ${type}: invalid id`);
      }
      //TODO too many try catch
      try {
        const result = await axios.request(`/${id}`, { method: "DELETE" });
        result.data = onResponseDelete(result.data);
        logger.debug(
          `destroy ${toString({ name, type, id })} should be destroyed`
        );
        await waitDestroyed({ id, name });

        return result;
      } catch (error) {
        logger.error(`delete type ${type}, error TODO`);
        throw error;
      }
    },
    list: async () => {
      logger.debug(`list type ${type}`);

      if (!canList) return;

      try {
        const result = await axios.request(`/`, { method: "GET" });
        result.data = onResponseList(result.data);
        return result;
      } catch (error) {
        logger.error(`list type ${type}, error ${toString(error)}`);
        throw Error(error);
      }
    },
    create: async ({ payload }) => {
      logger.debug(
        `create ${type}, canCreate: ${canCreate}, payload: ${toString(payload)}`
      );

      if (!canCreate) return;

      try {
        const result = await axios.request("/", {
          method: "POST",
          data: payload,
        });
        result.data = onResponseCreate(result.data);
        return result;
      } catch (error) {
        logger.error(`create type ${type}, error ${toString(error)}`);
        throw Error(error);
      }
    },
  };
};
