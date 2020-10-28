const Axios = require("axios");
const logger = require("../logger")({ prefix: "AxiosMaker" });
const { tos } = require("../tos");

module.exports = AxiosMaker = ({
  baseURL,
  onHeaders = noop,
  contentType = "application/json",
}) => {
  const axios = Axios.create({
    baseURL,
    timeout: 15e3,
    withCredentials: true,
    headers: { ...onHeaders(), "Content-Type": contentType },
  });

  axios.interceptors.request.use(
    function (config) {
      const { method, baseURL, url } = config;
      logger.debug(`axios request ${method} ${baseURL}${url}`);
      //config.data && logger.debug(tos(config.data));
      return config;
    },
    function (error) {
      logger.debug(`axios request error ${error}`);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      const { config, status } = response;
      const { method, baseURL, url } = config;
      logger.debug(`axios response ${status}, ${method} ${baseURL}${url}`);
      //logger.debug(tos(response.data));
      return response;
    },
    function (error) {
      logger.error(`axios error ${error}`);
      return Promise.reject(error);
    }
  );

  return axios;
};
