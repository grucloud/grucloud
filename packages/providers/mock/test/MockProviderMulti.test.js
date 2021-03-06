const assert = require("assert");
const { eq, get } = require("rubico");

const { find, groupBy } = require("rubico/x");
const { MockProvider } = require("../MockProvider");
const cliCommands = require("@grucloud/core/cli/cliCommands");

describe("MockProviderMulti", async function () {
  const providerName1 = "provider1";
  const providerName2 = "provider2";

  let provider1;
  let volume1;
  let provider2;
  let volume2;

  before(async () => {
    provider1 = MockProvider({
      name: providerName1,
      config: () => ({}),
    });

    volume1 = provider1.makeVolume({
      name: "volume1",
      properties: () => ({
        size: 10_000_000_000,
      }),
    });

    provider2 = MockProvider({
      name: providerName2,
      config: () => ({}),
      dependencies: { provider1 },
    });

    volume2 = provider2.makeVolume({
      name: "volume2",
      properties: () => ({
        size: 10_000_000_000,
      }),
    });
  });

  it("multi  apply", async function () {
    const infra = {
      stacks: [{ provider: provider1 }, { provider: provider2 }],
    };
    {
      const result = await cliCommands.list({
        infra,
        commandOptions: { provider: [providerName2] },
      });
      assert(!result.error);
      const mapProvider = groupBy("providerName")(result.results);
      assert.equal(mapProvider.size, 1);
    }
    {
      const result = await cliCommands.planQuery({
        infra,
        commandOptions: { force: true },
      });
      assert(!result.error);
    }
    {
      await cliCommands.planApply({
        infra,
        commandOptions: { force: true },
      });
    }
    {
      const result = await cliCommands.list({
        infra,
      });
      assert(!result.error);
      const mapProvider = groupBy("providerName")(result.results);
      assert.equal(mapProvider.size, 2);
    }
    {
      const result = await cliCommands.planDestroy({
        infra,
        commandOptions: { force: true },
      });
      assert(!result.error);
    }
  });
});
