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
        //console.log("axios rx ", baseURL, data);
        //logger.debug(`rx ${data}`);
        try {
          return JSON.parse(data);
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
      logger.debug(`get ${type}, name: ${name}, canGet: ${canGet}`);
      if (canGet) {
        const result = await axios.request(`/${name}`, { method: "GET" });
        result.data = onResponseGet(result.data);
        return result;
      }
    },
    destroy: async (name) => {
      logger.debug(`destroyaa ${{ type, name, canDelete }}`);
      if (canDelete) {
        const result = await axios.request(`/${name}`, { method: "DELETE" });
        result.data = onResponseDelete(result.data);
        return result;
      }
    },
    list: async () => {
      logger.debug(`list type ${type}`);
      if (canList) {
        const result = await axios.request(`/`, { method: "GET" });
        result.data = onResponseList(result.data);
        return result;
      }
    },
    create: async ({ payload }) => {
      logger.debug(
        `create type ${type}, canCreate: ${canCreate}, payload: ${toString(
          payload
        )}`
      );
      if (canCreate) {
        const result = await axios.request("/", { method: "POST", payload });
        result.data = onResponseCreate(result.data);
        return result;
      }
    },
  };
};
