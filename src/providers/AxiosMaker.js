const _ = require("lodash");
const Axios = require("axios");
const logger = require("../logger")({ prefix: "AxiosMaker" });

module.exports = AxiosMaker = ({ baseURL, onHeaders = noop }) => {
  return Axios.create({
    baseURL,
    timeout: 30e3,
    withCredentials: true,
    headers: { ...onHeaders(), "Content-Type": "application/json" },
    transformRequest: [
      (data, headers) => {
        logger.info(`tx ${baseURL} ${data ? toString(data) : ""}`);
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
};
