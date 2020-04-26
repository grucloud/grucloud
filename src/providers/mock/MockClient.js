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
  //TODO delete all
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
