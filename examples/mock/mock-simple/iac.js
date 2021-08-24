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

const createResources = async ({ provider }) => {
  //Server
  const server = provider.makeServer({
    name: "db-server",
    properties: () => ({
      diskSizeGb: "50",
      machineType: "f1-micro",
    }),
  });

  return { server };
};
exports.createResources = createResources;

//TODO
exports.createStack = async ({ config }) => {
  const provider = MockProvider({
    name: "mock",
    config: () => ({
      ...config,
      createAxios,
    }),
  });

  const resources = await createResources({ provider });

  return {
    provider,
    resources,
  };
};
