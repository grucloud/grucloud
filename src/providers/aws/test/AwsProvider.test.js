const assert = require("assert");
const AwsProvider = require("../AwsProvider");
const config = require("../config");
const { testProviderLifeCycle } = require("test/E2ETestUtils");

describe("AwsProvider", async function () {
  let provider;
  let server;

  before(async () => {
    provider = await AwsProvider({ name: "aws", config });
    await provider.destroyAll();
    server = provider.makeInstance({
      name: "web-server",
      properties: {},
      dependencies: {},
    });
  });
  after(async () => {
    await provider.destroyAll();
  });
  it("config static", async function () {
    const config = server.configStatic();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
    assert.equal(config.InstanceType, "t2.micro");
    assert.equal(config.MaxCount, 1);
    assert.equal(config.MinCount, 1);
    // TODO tags
  });
  it("config", async function () {
    const config = await server.config();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});
