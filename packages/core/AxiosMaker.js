const Axios = require("axios");
const logger = require("./logger")({ prefix: "AxiosMaker" });
const { tos } = require("./tos");
const { convertError } = require("./Common");
module.exports = AxiosMaker = ({
  baseURL,
  httpsAgent,
  onHeaders = noop,
  contentType = "application/json",
}) => {
  const axios = Axios.create({
    baseURL,
    timeout: 10e3,
    withCredentials: true,
    httpsAgent,
  });

  axios.interceptors.request.use(
    function (config) {
      const { method, baseURL = "", url } = config;
      logger.debug(`axios request ${method} ${baseURL}${url}`);
      //config.data && logger.debug(tos(config.data));
      return {
        ...config,
        headers: {
          ...config.headers,
          common: { ...onHeaders(), "Content-Type": contentType },
        },
      };
    },
    function (error) {
      logger.debug(`axios request error ${error}, ${error.config.url}`);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      const { config, status } = response;
      const { method, baseURL = "", url } = config;
      logger.debug(`axios response ${status}, ${method} ${baseURL}${url}`);
      //logger.debug(tos(response.data));
      return response;
    },
    function (error) {
      const { response } = error;
      if (response?.status === 404) {
        const { method, baseURL = "", url } = error.config;
        logger.info(`axios ${method} ${baseURL}${url}`);
        logger.info(`axios ${error}`);
      } else {
        logger.error(`axios error ${tos(convertError({ error }))}`);
      }

      return Promise.reject(error);
    }
  );

  return axios;
};
