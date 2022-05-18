const assert = require("assert");
const { MockProvider } = require("../MockProvider");
const { Cli } = require("@grucloud/core/cli/cliCommands");

describe("MockProviderCornerCase", async function () {
  before(async () => {});

  it("undefined dependencies", async function () {
    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: createProvider(MockProvider, {
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
        }),
      }),
    });

    await cli.planQuery();
  });

  it("same name, different type", async function () {
    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: createProvider(MockProvider, {
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
        }),
      }),
    });

    await cli.planQuery();
  });
  //TODO
  it.skip("dependency to itself", async function () {
    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: createProvider(MockProvider, {
          config: () => ({}),
          createResources: () => [
            {
              type: "SecurityGroup",
              group: "Compute",
              name: "sg",
              properties: () => ({}),
              dependencies: () => ({
                securityGroup: "sg",
              }),
            },
          ],
        }),
      }),
    });

    await cli.planQuery({});
  });
});
