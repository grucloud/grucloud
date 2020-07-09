const assert = require("assert");
const AwsProvider = require("../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { notAvailable } = require("../../ProviderCommon");
const { CheckTags } = require("./AwsTagCheck");

describe("AwsEC2", async function () {
  let config;
  let provider;
  let server;
  let keyPair;

  const keyPairName = "kp";
  const serverName = "web-server";

  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
    provider = await AwsProvider({
      name: "aws",
      config,
    });

    const { success } = await provider.destroyAll();
    assert(success);

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
    //await provider?.destroyAll();
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
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it("listLives all", async function () {
    const lives = await provider.listLives({ all: true });
    assert(lives);
  });
  it("ec2 apply plan", async function () {
    await testPlanDeploy({ provider });

    const serverLive = await server.getLive();
    const serverInstance = serverLive.Instances[0];

    CheckTags({
      config: provider.config(),
      tags: serverInstance.Tags,
      name: server.name,
    });

    //TODO get default vpc and sg and check ec2 belongs to them
    /*
    assert.equal(serverInstance.VpcId, vpcLive.VpcId);
    assert.equal(serverInstance.SecurityGroups[0].GroupId, sgLive.GroupId);
    assert.equal(subnetLive.VpcId, vpcLive.VpcId);
    assert.equal(sgLive.VpcId, vpcLive.VpcId);
*/
    await testPlanDestroy({ provider });
  });
});
