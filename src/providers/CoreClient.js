const Axios = require("axios");
const logger = require("logger")({ prefix: "CoreClient" });
const toString = (x) => JSON.stringify(x, null, 4);
const noop = () => ({});
const identity = (x) => x;

module.exports = CoreClient = ({
  options = {},
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
  const { methods } = options;
  const canGet = !methods || methods.get;
  const canCreate = !methods || methods.create;
  const canDelete = !methods || methods.del;
  const canList = !methods || methods.list;

  return {
    options,
    type,
    get: async (name) => {
      //TODO check for name
      logger.debug(`get ${type}, name: ${name}, canGet: ${canGet}`);
      if (!canGet) return;
      try {
        const result = await axios.request(`/${name}`, { method: "GET" });
        result.data = onResponseGet(result.data);
        return result;
      } catch (error) {
        logger.error(
          ` get type ${type}, , name: ${name}, error ${error.response}`
        );
        throw Error(error);
      }
    },
    destroy: async (id) => {
      //TODO check for id
      logger.debug(
        `destroy ${toString({ type: options.name, id, canDelete })}`
      );
      if (!canDelete) return;

      try {
        const result = await axios.request(`/${id}`, { method: "DELETE" });
        result.data = onResponseDelete(result.data);
        return result;
      } catch (error) {
        logger.error(`delete type ${type}, error ${error.response}`);
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
        logger.error(`list type ${type}, error ${error.response}`);
        throw Error(error);
      }
    },
    create: async ({ payload }) => {
      logger.debug(
        `create type ${type}, canCreate: ${canCreate}, payload: ${toString(
          payload
        )}`
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
        logger.error(`create type ${type}, error ${error.response}`);
        throw Error(error);
      }
    },
  };
};
