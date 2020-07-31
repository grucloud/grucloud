const assert = require("assert");
const logger = require("logger")({ prefix: "CoreProvider" });
const { ConfigLoader } = require("ConfigLoader");
const { createAxiosMock } = require("../MockAxios");

const { tos } = require("../../../tos");

const createMockProvider = async ({ name, config, mockCloud }) => {
  return await MockProvider({
    name,
    config: {
      ...config,
      mockCloud,
      createAxios: createAxiosMock,
    },
  });
};
describe("MockProvider errors", async function () {
  let config;
  let mockCloud;
  before(async () => {
    config = ConfigLoader({ path: "examples/aws/ec2-vpc" });
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

    const plan1 = await provider1.planQuery();
    const plan2 = await provider2.planQuery();
    {
      const { error } = await provider1.planApply({
        plan: plan1,
      });
      assert(!error);
    }
    {
      const { error } = await provider2.planApply({
        plan: plan2,
      });
      assert(error);
    }
  });
});
