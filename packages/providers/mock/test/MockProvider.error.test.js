const assert = require("assert");
const { MockProvider } = require("../MockProvider");
const { createAxiosMock } = require("../MockAxios");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");
const { Cli } = require("@grucloud/core/cli/cliCommands");

describe("MockProvider errors", async function () {
  let config;
  let mockCloud;
  before(async () => {
    config = ConfigLoader({ path: "examples/multi" });
    mockCloud = MockCloud();
  });
  after(async () => {});

  it("create 2 resources with the same name", async function () {
    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        stacks: [
          {
            provider: createProvider(MockProvider, {
              name: "mock",
              config,
              mockCloud: MockCloud(),
              createResources: pipe([
                tap((params) => {
                  assert(true);
                }),
                () => [
                  { type: "Ip", group: "Compute", name: "myip" },
                  { type: "Ip", group: "Compute", name: "myip" },
                ],
              ]),
            }),
          },
        ],
      }),
    });

    const result = await cli.planQuery({});
    assert(!result.error);
  });
  it("create 2 providers with the same resource name", async function () {
    const config = () => ({ mockCloud, createAxios: createAxiosMock });

    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        stacks: [
          {
            provider: createProvider(MockProvider, {
              name: "mock1",
              createResources: () => [
                { type: "Ip", group: "Compute", name: "myip" },
              ],
              config,
            }),
          },
          {
            provider: createProvider(MockProvider, {
              name: "mock2",
              createResources: () => [
                { type: "Ip", group: "Compute", name: "myip" },
              ],
              config,
            }),
          },
        ],
      }),
    });

    const result = await cli.planQuery({});

    assert(!result.error);
  });

  it("empty create plan, non empty destroy plan", async function () {
    const config = () => ({ mockCloud, createAxios: createAxiosMock });

    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        stacks: [
          {
            provider: createProvider(MockProvider, {
              name: "mock1",
              config,
              mockCloud,
              createResources: () => [
                {
                  type: "Volume",
                  group: "Compute",
                  name: "volume1",
                  properties: () => ({
                    size: 20_000_000_000,
                  }),
                },
                {
                  type: "Server",
                  group: "Compute",
                  name: "web-server",
                  properties: () => ({
                    diskSizeGb: "20",
                    machineType: "f1-micro",
                  }),
                },
                { type: "Ip", group: "Compute", name: "myip" },
              ],
            }),
          },
          {
            provider: createProvider(MockProvider, {
              name: "mock2",
              config,
              mockCloud,
              createResources: () => [],
            }),
          },
        ],
      }),
    });

    const result = await cli.planQuery({});

    assert(!result.error);
  });
});
