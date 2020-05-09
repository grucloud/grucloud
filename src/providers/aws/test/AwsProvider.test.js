const assert = require("assert");
const AwsProvider = require("../AwsProvider");
const config = require("../config");
const { testProviderLifeCycle } = require("test/E2ETestUtils");

describe.only("AwsProvider", async function () {
  let provider;
  let server;

  before(async () => {
    provider = await AwsProvider({ name: "aws" }, config);
    await provider.destroyAll();
    server = provider.makeInstance({
      name: "web-server",
      dependencies: {},
      config: async ({}) => ({
        machineType: "e2-micro",
      }),
    });
  });
  after(async () => {
    await provider.destroyAll();
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it.skip("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});
