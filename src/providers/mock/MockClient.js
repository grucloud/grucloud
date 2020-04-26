const _ = require("lodash");
const assert = require("assert");
const MockAdapter = require("axios-mock-adapter");
const MockCloud = require("./MockCloud");

const CoreClient = require("../CoreClient");
const AxiosMaker = require("../AxiosMaker");
const urljoin = require("url-join");
const logger = require("../../logger")({ prefix: "MockClient" });
const toJSON = (x) => JSON.stringify(x, null, 4);

const BASE_URL = "http://localhost:8089";

const setupMock = ({ axios, config, spec }) => {
  const { type } = spec;
  const { mockCloud } = config;
  assert(mockCloud);
  const mock = new MockAdapter(axios);
  mock.onGet(/^\/.+/).reply((config) => {
    try {
      const data = mockCloud.onGet({ type, id: config.url.replace("/", "") });
      return [200, data];
    } catch (error) {
      return [404];
    }
  });
  mock.onGet("").reply((config) => {
    const data = mockCloud.onList({ type });
    return [200, data];
  });
  mock.onPost("").reply((config) => {
    const data = mockCloud.onCreate({
      type,
      payload: JSON.parse(config.data),
    });
    return [200, data];
  });
  mock.onDelete(/^\/.+/).reply((config) => {
    const data = mockCloud.onDestroy({
      type,
      id: config.url.replace("/", ""),
    });
    return [200, data];
  });
};

module.exports = MockClient = ({ spec, config, authKey }) => {
  const axios = AxiosMaker({
    baseURL: urljoin(BASE_URL, spec.url),
    onHeaders: () => ({ "X-Auth-Token": authKey }),
  });

  setupMock({ axios, spec, config });

  return CoreClient({
    type: "mock",
    spec,
    ...spec,
    axios,
  });
};
/*

module.exports = MockClient = ({ spec, config }) => {
  const { type } = spec;
  logger.debug(`MockClient init ${type}, ${JSON.stringify(config)}`);

  const list = async () => {
    return config.onList({ type });
  };

  const create = async ({ name, payload }) => {
    return config.onCreate({ type, name, payload });
  };

  const get = async (name, options) => {
    return config.onGet({ type, name, options });
  };

  const destroy = async (name) => {
    return config.onDestroy({ type, name });
  };

  const destroyAll = async () => {
    return config.onDestroyAll({ type });
  };

  return {
    spec,
    type: "mockClient",
    get,
    list,
    create,
    destroy,
    destroyAll,
  };
};
*/
