const assert = require("assert");
const { eq, get } = require("rubico");

const { find, groupBy } = require("rubico/x");
const { MockProvider } = require("../MockProvider");
const { Cli } = require("@grucloud/core/cli/cliCommands");
const { createProviderMaker } = require("@grucloud/core/cli/infra");

describe("MockProviderMulti", async function () {
  const providerName1 = "provider1";
  const providerName2 = "provider2";

  let provider1;
  let provider2;

  before(async () => {
    provider1 = createProviderMaker({})(MockProvider, {
      name: providerName1,
      config: () => ({}),
      createResources: ({ provider }) => {
        provider.makeVolume({
          name: "volume1",
          properties: () => ({
            size: 10_000_000_000,
          }),
        });
      },
    });

    provider2 = createProviderMaker({})(MockProvider, {
      name: providerName2,
      config: () => ({}),
      dependencies: { provider1 },
      createResources: ({ provider }) => {
        provider.makeVolume({
          name: "volume2",
          properties: () => ({
            size: 10_000_000_000,
          }),
        });
      },
    });
  });

  it("multi  apply", async function () {
    const cli = await Cli({
      createStack: () => ({
        stacks: [{ provider: provider1 }, { provider: provider2 }],
      }),
    });
    {
      const result = await cli.list({
        commandOptions: { provider: [providerName2] },
      });
      assert(!result.error);
      const mapProvider = groupBy("providerName")(result.results);
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
      const result = await cli.list({});
      assert(!result.error);
      const mapProvider = groupBy("providerName")(result.results);
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
