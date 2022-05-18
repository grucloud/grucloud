const assert = require("assert");
const { groupBy } = require("rubico/x");

const { Cli } = require("@grucloud/core/cli/cliCommands");

const { MockProvider } = require("../MockProvider");

describe("MockProviderMulti", async function () {
  const providerName1 = "provider1";
  const providerName2 = "provider2";

  before(async () => {});

  it("multi  apply", async function () {
    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        stacks: [
          {
            provider: createProvider(MockProvider, {
              name: providerName1,
              config: () => ({}),
              createResources: () => [
                {
                  type: "Volume",
                  group: "Compute",
                  name: "volume1",
                  properties: () => ({
                    size: 10_000_000_000,
                  }),
                },
              ],
            }),
          },
          {
            provider: createProvider(MockProvider, {
              name: providerName2,
              config: () => ({}),
              //TODO
              //dependencies: { provider1 },
              createResources: () => [
                {
                  type: "Volume",
                  group: "Compute",
                  name: "volume2",
                  properties: () => ({
                    size: 10_000_000_000,
                  }),
                },
              ],
            }),
          },
        ],
      }),
    });

    {
      const { lives } = await cli.list({
        commandOptions: { provider: [providerName2] },
      });
      assert(!lives.error);
      const mapProvider = groupBy("providerName")(lives.results);
      assert.equal(mapProvider.size, 1);
    }
    {
      const result = await cli.planQuery({
        commandOptions: { force: true },
      });
      assert(!result.error);
    }
    {
      await cli.planApply({
        commandOptions: { force: true },
      });
    }
    {
      const { lives } = await cli.list({});
      assert(!lives.error);
      const mapProvider = groupBy("providerName")(lives.results);
      assert.equal(mapProvider.size, 2);
    }
    {
      const result = await cli.planDestroy({
        commandOptions: { force: true },
      });
      assert(!result.error);
    }
  });
});
