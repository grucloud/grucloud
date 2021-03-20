const Axios = require("axios");
const assert = require("assert");
const urljoin = require("url-join");
const { MockProvider } = require("@grucloud/core");
const hooks = require("./hooks");

const BASE_URL = "http://localhost:8089";

const createAxios = ({ url }) => {
  assert(url);
  return Axios.create({
    baseURL: urljoin(BASE_URL, url),
    headers: { "Content-Type": "application/json" },
  });
};

const createResources1 = async ({ provider }) => {
  // Ip
  const volume = await provider.makeVolume({
    name: "volume1",
    properties: () => ({
      size: 20_000_000_000,
    }),
  });

  return { volume };
};

const createResources2 = async ({ provider }) => {
  // Ip
  const volume = await provider.makeVolume({
    name: "volume2",
    properties: () => ({
      size: 20_000_000_000,
    }),
  });

  return { volume };
};

exports.createStack = async ({ config }) => {
  const provider1 = MockProvider({
    name: "mock-1",
    config: require("./config"),
  });

  const resources1 = await createResources1({ provider: provider1 });

  const provider2 = MockProvider({
    name: "mock-2",
    dependencies: { provider1 },
    config: require("./config"),
  });

  const resources2 = await createResources2({ provider: provider2 });

  return [
    {
      provider: provider1,
      resources: resources1,
      hooks,
      isProviderUp: () => resources1.volume.getLive(),
    },
    {
      provider: provider2,
      resources: resources2,
    },
  ];
};
