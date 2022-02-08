const assert = require("assert");
const { MockProvider } = require("../MockProvider");
const { createProviderMaker } = require("@grucloud/core/cli/infra");

describe("MockProviderCornerCase", async function () {
  before(async () => {});

  it("undefined dependencies", async function () {
    const provider = createProviderMaker({})(MockProvider, {
      config: () => ({}),
      createResources: () => [
        {
          type: "Server",
          group: "Compute",
          name: "web-server",
          dependencies: () => ({ volume: undefined }),
          properties: () => ({}),
        },
      ],
    });
    const resources = provider.resources();
    const server = resources.Compute.Server["web-server"];

    assert(server);
    const deps = server.getDependencyList();
    assert(deps);
    await provider.planQuery({});
  });

  it("same name, different type", async function () {
    const provider = createProviderMaker({})(MockProvider, {
      config: () => ({}),
      createResources: () => [
        {
          type: "Server",
          group: "Compute",
          name: "web-server",
          dependencies: () => ({ volume: undefined }),
          properties: () => ({}),
        },
        {
          type: "Ip",
          group: "Compute",
          name: "web-server",
          properties: () => ({}),
        },
      ],
    });
    await provider.planQuery({});
  });
  it("dependency to itself", async function () {
    const provider = createProviderMaker({})(MockProvider, {
      config: () => ({}),
      createResources: () => [
        {
          type: "Server",
          group: "Compute",
          name: "web-server",
          dependencies: () => ({ volume: undefined }),
          properties: () => ({}),
        },
        {
          type: "SecurityGroup",
          group: "Compute",
          name: "sh",
          properties: () => ({}),
        },
      ],
      createResources: ({ provider }) => {
        provider.Compute.makeSecurityGroup({
          name: "sg",
          dependencies: () => ({
            securityGroup: "sg",
          }),
          properties: () => ({}),
        });
      },
    });
    const resources = provider.resources();
    await provider.planQuery({});
  });
});
