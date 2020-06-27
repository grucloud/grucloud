const assert = require("assert");
const urljoin = require("url-join");
const MockAdapter = require("axios-mock-adapter");
const logger = require("../../../logger")({ prefix: "MockAxios" });

const AxiosMaker = require("../../AxiosMaker");

const { tos } = require("../../../tos");
const BASE_URL = "http://localhost:8089";

exports.createAxiosMock = ({ config, url, spec }) => {
  const { type } = spec;
  assert(type);
  assert(url);
  const { mockCloud } = config;
  assert(mockCloud);

  const axios = AxiosMaker({
    baseURL: urljoin(BASE_URL, url),
    onHeaders: () => ({}),
  });

  const mock = new MockAdapter(axios);
  mock.onGet(/^\/.+/).reply((config) => {
    const id = config.url.replace("/", "");
    try {
      logger.debug(`mock onGet id: ${id}`);
      const data = mockCloud.onGet({ type, id });
      return [200, data];
    } catch (error) {
      logger.debug(`mock onGet id: ${id} not found`);
      return [404];
    }
  });
  mock.onGet("").reply((config) => {
    logger.debug(`mock onGet list`);
    const data = mockCloud.onList({ type });
    return [200, data];
  });
  mock.onGet().reply((config) => {
    logger.error(`mock onGet all`);
    return [500];
  });
  mock.onPost("").reply((config) => {
    logger.debug(`mock onPost: ${tos(config.data)}`);
    try {
      const data = mockCloud.onCreate({
        type,
        payload: JSON.parse(config.data),
      });
      return [200, data];
    } catch (error) {
      logger.error(`mock onPost: ${tos(error)}`);
      return [500];
    }
  });
  mock.onDelete(/^\/.+/).reply((config) => {
    const data = mockCloud.onDestroy({
      type,
      id: config.url.replace("/", ""),
    });
    return [200, data];
  });
  //TODO delete all
  return axios;
};
