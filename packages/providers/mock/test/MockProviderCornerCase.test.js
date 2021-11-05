const assert = require("assert");
const { MockProvider } = require("../MockProvider");
const { createProviderMaker } = require("@grucloud/core/cli/infra");

describe("MockProviderCornerCase", async function () {
  before(async () => {});

  it("undefined dependencies", async function () {
    const provider = createProviderMaker({})(MockProvider, {
      config: () => ({}),
      createResources: ({ provider }) => {
        provider.makeServer({
          name: "web-server",
          dependencies: { volume: undefined },
          properties: () => ({}),
        });
      },
    });
    const resources = provider.resources();
    const server = resources.Server["web-server"];

    assert(server);
    const deps = server.getDependencyList();
    assert(deps);
    await provider.planQuery({});
  });

  it("same name, different type", async function () {
    const provider = createProviderMaker({})(MockProvider, {
      config: () => ({}),
      createResources: ({ provider }) => {
        provider.makeServer({
          name: "web-server",
          dependencies: {},
          properties: () => ({}),
        });
        provider.makeIp({
          name: "web-server",
          dependencies: {},
          properties: () => ({}),
        });
      },
    });
    await provider.planQuery({});
  });
  it("dependency to itself", async function () {
    const provider = createProviderMaker({})(MockProvider, {
      config: () => ({}),
      createResources: ({ provider }) => {
        provider.makeSecurityGroup({
          name: "sg",
          dependencies: ({ resources }) => ({
            securityGroup: resources.SecurityGroup.sg,
          }),
          properties: () => ({}),
        });
      },
    });
    const resources = provider.resources();
    await provider.planQuery({});
  });
});
