const Axios = require("axios");
const logger = require("logger")({ prefix: "CoreClient" });
const noop = () => ({});
const identity = (x) => x;

module.exports = CoreClient = ({
  options = {},
  type,
  baseURL,
  onHeaders = noop,
  onResponse = identity,
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
        logger.debug(`rx ${data}`);
        try {
          return JSON.parse(data);
        } catch (error) {
          logger.error("rx could not parse data", data);
          return data;
        }
      },
      onResponse,
    ],
  });
  //console.log("client option ", options);
  const { methods } = options;
  const canGet = !methods || methods.get;
  const create = !methods || methods.create;
  const del = !methods || methods.del;
  const list = !methods || methods.list;

  //console.log("METHOD", get, create, list, del);
  return {
    options,
    type,
    get: (name) => {
      logger.debug(`${type} get ${name}`);
      if (canGet) return axios.request(`/${name}`, { method: "GET" });
    },
    destroy: (name) => {
      logger.debug(
        `${type} destroy type ${type}, name: ${name} canDestroy: ${del}`
      );
      if (del) return axios.request(`/${name}`, { method: "DELETE" });
    },
    list: () => list && axios.request("/", { method: "GET" }),
    create: (data) => {
      logger.debug(`${type} create type ${type}, canCreate: ${create}`);
      if (create) return axios.request("/", { method: "POST", data });
    },
  };
};
