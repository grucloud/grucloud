const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsEC2", async function () {
  let config;
  const types = ["EC2"];
  const keyPairName = "kp";
  const serverName = "web-server";

  const createStack = async ({ serverProperty }) => {
    const provider = AwsProvider({
      config: () => ({ projectName: "ec2-test" }),
    });

    const keyPair = await provider.useKeyPair({
      name: keyPairName,
    });

    const server = await provider.makeEC2({
      name: serverName,
      properties: serverProperty,
      dependencies: { keyPair },
    });
    return { provider, resources: { server } };
  };

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});
  it("ec2 server resolveConfig", async function () {
    const {
      provider,
      resources: { server },
    } = await createStack({
      serverProperty: () => ({}),
    });

    assert.equal(server.name, serverName);

    const config = await server.resolveConfig();
    assert.equal(config.InstanceType, "t2.micro");
    assert.equal(config.MaxCount, 1);
    assert.equal(config.MinCount, 1);
    //assert.equal(config.KeyName, keyPair.name);
  });
  it("ec2 apply plan", async function () {
    {
      const {
        provider,
        resources: { server },
      } = await createStack({
        serverProperty: () => ({
          InstanceType: "t2.micro",
          ImageId: "ami-00f6a0c18edb19300", // Ubuntu 18.04
        }),
      });

      await testPlanDeploy({ provider, types, destroy: true });

      const serverLive = await server.getLive();

      assert(
        CheckAwsTags({
          config: provider.config,
          tags: serverLive.Tags,
          name: server.name,
        })
      );
    }
    {
      const {
        provider,
        resources: { server },
      } = await createStack({
        serverProperty: () => ({
          InstanceType: "t3.micro",
          ImageId: "ami-00f6a0c18edb19300", // Ubuntu 18.04
        }),
      });

      await testPlanDeploy({ provider, types, destroy: false });

      const serverLive = await server.getLive();
      //Check new Instance Type

      await testPlanDestroy({ provider, types });
    }
  });
});
