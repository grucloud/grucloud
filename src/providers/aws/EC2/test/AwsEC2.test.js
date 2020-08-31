const assert = require("assert");
const AwsProvider = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { notAvailable } = require("../../../ProviderCommon");
const { CheckTagsEC2 } = require("../../AwsTagCheck");

describe("AwsEC2", async function () {
  let config;
  let provider;
  let server;
  let keyPair;

  const keyPairName = "kp";
  const serverName = "web-server";

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/aws/ec2-vpc" });
    } catch (error) {
      this.skip();
    }
    provider = await AwsProvider({
      name: "aws",
      config,
    });

    const { error } = await provider.destroyAll();
    assert(!error, "destroyAll failed");

    keyPair = await provider.useKeyPair({
      name: keyPairName,
    });

    server = await provider.makeEC2({
      name: serverName,
      properties: () => ({}),
      dependencies: { keyPair },
    });
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("ec2 server resolveConfig", async function () {
    assert.equal(server.name, serverName);

    const config = await server.resolveConfig();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
    assert.equal(config.InstanceType, "t2.micro");
    assert.equal(config.MaxCount, 1);
    assert.equal(config.MinCount, 1);
    assert.equal(config.KeyName, keyPair.name);
  });
  it("server resolveDependencies", async function () {
    const dependencies = await server.resolveDependencies();
    assert(dependencies.keyPair);
  });
  it("config", async function () {
    const config = await server.resolveConfig();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
  });
  it.skip("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it.skip("listLives all", async function () {
    const { results: lives } = await provider.listLives({ all: true });
    assert(lives);
  });
  it.skip("ec2 apply plan", async function () {
    await testPlanDeploy({ provider });

    const serverLive = await server.getLive();

    const serverInstance = serverLive.Instances[0];

    CheckTagsEC2({
      config: provider.config(),
      tags: serverInstance.Tags,
      name: server.name,
    });

    const {
      results: [vpcs],
    } = await provider.listLives({ types: ["Vpc"] });
    assert(vpcs);
    const vpcDefault = vpcs.resources.find((vpc) => vpc.data.IsDefault);
    assert(vpcDefault);

    assert.equal(serverInstance.VpcId, vpcDefault.data.VpcId);

    await testPlanDestroy({ provider, full: false });
  });
});
