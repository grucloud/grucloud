const _ = require("lodash");
const assert = require("assert");
const MockAdapter = require("axios-mock-adapter");
const MockCloud = require("./MockCloud");

const CoreClient = require("../CoreClient");
const AxiosMaker = require("../AxiosMaker");
const urljoin = require("url-join");
const logger = require("../../logger")({ prefix: "MockClient" });
const toJSON = (x) => JSON.stringify(x, null, 4);
const tos = (x) => JSON.stringify(x, null, 4);
const { findField } = require("../Common");

const BASE_URL = "http://localhost:8089";

const setupAxiosMock = ({ axios, config, spec }) => {
  const { type } = spec;
  const { mockCloud } = config;
  assert(mockCloud);
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
};

module.exports = MockClient = ({ spec, url, config, configDefault }) => {
  assert(spec);
  assert(url);
  const findName = (item) => findField({ item, field: "name" });

  const axios = AxiosMaker({
    baseURL: urljoin(BASE_URL, url),
    onHeaders: () => ({}),
  });

  config.mockCloud && setupAxiosMock({ axios, spec, config });

  const core = CoreClient({
    type: "mock",
    spec,
    ...spec,
    axios,
    configDefault,
    findName,
  });
  return core;
};
