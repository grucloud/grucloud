const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsEC2", async function () {
  let config;
  let provider;
  let server;
  let keyPair;
  const types = ["EC2"];
  const keyPairName = "kp";
  const serverName = "web-server";

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });
    await provider.start();

    keyPair = await provider.useKeyPair({
      name: keyPairName,
    });

    server = await provider.makeEC2({
      name: serverName,
      properties: () => ({}),
      dependencies: { keyPair },
    });
  });
  after(async () => {});
  it("ec2 server resolveConfig", async function () {
    assert.equal(server.name, serverName);

    const config = await server.resolveConfig();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
    assert.equal(config.InstanceType, "t2.micro");
    assert.equal(config.MaxCount, 1);
    assert.equal(config.MinCount, 1);
    assert.equal(config.KeyName, keyPair.name);
  });
  it("ec2 apply plan", async function () {
    await testPlanDeploy({ provider, types });

    const serverLive = await server.getLive();

    assert(
      CheckAwsTags({
        config: provider.config(),
        tags: serverLive.Tags,
        name: server.name,
      })
    );

    const {
      results: [vpcs],
    } = await provider.listLives({ types: ["Vpc"] });
    assert(vpcs);
    const vpcDefault = vpcs.resources.find((vpc) => vpc.data.IsDefault);
    assert(vpcDefault);

    assert.equal(serverLive.VpcId, vpcDefault.data.VpcId);

    await testPlanDestroy({ provider, types, full: false });
  });
});
