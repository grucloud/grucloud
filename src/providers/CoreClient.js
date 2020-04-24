const _ = require("lodash");
const Axios = require("axios");
const logger = require("../logger")({ prefix: "CoreClient" });
const toString = (x) => JSON.stringify(x, null, 4);
const noop = () => ({});
const identity = (x) => x;

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
        ` get ${type}/${name}, error ${toString(error)}` //TODO function to print axios error
      );
      throw error;
    }
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

      try {
        const result = await axios.request(`/${id}`, { method: "DELETE" });
        result.data = onResponseDelete(result.data);

        try {
          await get(id);
          // Not a good place, the resource still exist
          logger.error(
            `resource ${spec.type}/${name}/${id} still there despite being deleted.`
          );
        } catch (error) {
          // Good here
          // Check error 404

          if (error.response && error.response.status === 404) {
            logger.info(
              `destroy resource ${toString({
                type: spec.type,
                id,
              })} gone, error: ${toString(error)}`
            );
          } else {
            logger.error(`destroy: ${toString({ id, error })}`);
            throw error;
          }
        }

        return result;
      } catch (error) {
        logger.error(`delete type ${type}, error ${toString(error)}`);
        throw Error(error);
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
