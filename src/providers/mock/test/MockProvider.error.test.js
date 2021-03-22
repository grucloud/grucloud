const assert = require("assert");
const logger = require("logger")({ prefix: "CoreProvider" });
const { MockProvider } = require("../MockProvider");
const { ConfigLoader } = require("ConfigLoader");
const { createAxiosMock } = require("../MockAxios");
const { ProviderGru } = require("../../ProviderGru");

const { tos } = require("../../../tos");

const createMockProvider = async ({ name, config, mockCloud }) => {
  return MockProvider({
    name,
    config: () => ({
      //...config,
      mockCloud,
      createAxios: createAxiosMock,
    }),
  });
};
describe("MockProvider errors", async function () {
  let config;
  let mockCloud;
  before(async () => {
    config = ConfigLoader({ path: "examples/multi" });
    mockCloud = MockCloud();
  });
  after(async () => {});

  it("create 2 resources with the same name", async function () {
    const provider = await createMockProvider({
      name: "mock",
      config,
      mockCloud: MockCloud(),
    });

    // Ip
    try {
      const ip = await provider.makeIp({ name: "myip" });
      const ip2 = await provider.makeIp({ name: "myip" });
      assert(false);
    } catch (error) {
      assert.equal(error.code, 400);
    }
  });
  it("create 2 providers with the same resource name", async function () {
    const provider1 = await createMockProvider({
      name: "mock1",
      config,
      mockCloud,
    });
    const provider2 = await createMockProvider({
      name: "mock2",
      config,
      mockCloud,
    });
    await provider1.makeIp({ name: "myip" });
    await provider2.makeIp({ name: "myip" });
    const providersGru = ProviderGru({
      stacks: [{ provider: provider1 }, { provider: provider2 }],
    });
    const result = await providersGru.planQuery();
    assert(!result.error);
  });

  it("empty create plan, non empty destroy plan", async function () {
    const mockCloud = MockCloud();
    {
      const provider = await createMockProvider({
        name: "mock1",
        config,
        mockCloud,
      });

      const volume = await provider.makeVolume({
        name: "volume1",
        properties: () => ({
          size: 20_000_000_000,
        }),
      });

      await provider.makeServer({
        name: "web-server",
        properties: () => ({
          diskSizeGb: "20",
          machineType: "f1-micro",
        }),
      });

      await provider.makeIp({
        name: "ip",
        properties: () => ({}),
      });
      const providersGru = ProviderGru({ stacks: [{ provider }] });
      const { error } = await providersGru.planQuery();
      assert(!error);
    }
    {
      const provider = await createMockProvider({
        name: "mock2",
        config,
        mockCloud,
      });
      const providersGru = ProviderGru({ stacks: [{ provider }] });

      const { error } = await providersGru.planQueryAndApply();
      assert(!error);
    }
  });
});
