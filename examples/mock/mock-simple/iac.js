const Axios = require("axios");
const assert = require("assert");
const urljoin = require("url-join");
const { MockProvider } = require("@grucloud/provider-mock");

const BASE_URL = "http://localhost:8089";

const createAxios = ({ url }) => {
  assert(url);
  return Axios.create({
    baseURL: urljoin(BASE_URL, url),
    headers: { "Content-Type": "application/json" },
  });
};

const createResources = () => [
  {
    type: "Server",
    group: "Compute",
    name: "db-server",
    properties: () => ({
      diskSizeGb: "50",
      machineType: "f1-micro",
    }),
  },
];

exports.createResources = createResources;

exports.createStack = ({ createProvider }) => {
  return {
    provider: createProvider(MockProvider, {
      name: "mock",
      createResources,
      config: () => ({
        createAxios,
      }),
    }),
  };
};
