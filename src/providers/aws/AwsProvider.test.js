/*const assert = require("assert");
const AwsProvider = require("./AwsProvider");
const config = require("./config");
const { testProviderLifeCycle } = require("test/E2ETestUtils");

describe.skip("AwsProvider", async function () {
  const provider = await AwsProvider({ name: "aws" }, config);
  const ip = provider.makeAddress({ name: "ip-webserver" });

  const server = provider.makeInstance({
    name: "web-server",
    dependencies: {},
    config: async ({ dependencies: { ip } }) => ({
      machineType: "e2-micro",
    }),
  });

  before(async () => {
    await provider.destroyAll();
  });
  after(async () => {
    await provider.destroyAll();
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 2);
  });
  it.skip("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});
*/
