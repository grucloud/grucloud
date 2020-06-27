const _ = require("lodash");
const Axios = require("axios");
const logger = require("../logger")({ prefix: "AxiosMaker" });
const { tos } = require("../tos");
module.exports = AxiosMaker = ({ baseURL, onHeaders = noop }) => {
  return Axios.create({
    baseURL,
    timeout: 30e3,
    withCredentials: true,
    headers: { ...onHeaders(), "Content-Type": "application/json" },
    transformRequest: [
      (data, headers) => {
        logger.info(`tx ${baseURL} ${data ? tos(data) : ""}`);
        //logger.info(`tx ${tos({ headers })}`);

        return JSON.stringify(data);
      },
    ],
    transformResponse: [
      (data) => {
        logger.debug(`rx baseURL: ${baseURL}`);
        try {
          const parsedData = data && JSON.parse(data);
          logger.debug(`rx baseURL: ${baseURL}, ${tos(parsedData)}`);
          return parsedData;
        } catch (error) {
          logger.info(`rx json data ${tos(data)}`);
          return data;
        }
      },
    ],
  });
};
