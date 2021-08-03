const assert = require("assert");
const Axios = require("axios");
const urljoin = require("url-join");

const { forEach } = require("rubico/x");
const { createStack } = require("./MockStack");

const BASE_URL = "http://localhost:8089";

const createAxios = ({ url }) => {
  assert(url);
  return Axios.create({
    baseURL: urljoin(BASE_URL, url),
    headers: { "Content-Type": "application/json" },
  });
};

const displayResource = (resource, depth = 0) => {
  console.log(
    "  ".repeat(depth),
    resource.toJSON && resource.toJSON(),
    resource.usedBy && [...resource.usedBy().keys()].join("\n")
  );
  resource.dependencies &&
    forEach((dep) => {
      displayResource(dep, depth + 1);
    })(resource.dependencies);
};

describe("MockProvider", async function () {
  let stack;
  let provider;
  let resources;

  before(async () => {
    stack = await createStack({
      createProvider: (provider) =>
        provider({ config: () => ({ createAxios }) }),
    });
    provider = stack.provider;
    await provider.start();
    resources = stack.resources;
  });

  it("type", async function () {
    assert.equal(provider.type(), "mock");
  });

  it("list config", async function () {
    const configs = provider.listConfig();
    assert(configs);
  });

  it("list resources", async function () {
    const resources = provider.getTargetResources();
    assert(resources);
    resources.map((resource) => {
      displayResource(resource);
    });
  });
});
