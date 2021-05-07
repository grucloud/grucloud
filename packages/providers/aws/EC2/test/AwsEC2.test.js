const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

const imageUbuntu = {
  name: "ubuntu",
  properties: () => ({
    Filters: [
      {
        Name: "architecture",
        Values: ["x86_64"],
      },
      {
        Name: "description",
        Values: ["Canonical, Ubuntu, 20.04 LTS*"],
      },
    ],
  }),
};

const imageAmazon2 = {
  name: "amazon linux 2",
  properties: () => ({
    Filters: [
      {
        Name: "architecture",
        Values: ["x86_64"],
      },
      {
        Name: "description",
        Values: ["Amazon Linux 2 AMI *"],
      },
    ],
  }),
};

describe("AwsEC2", async function () {
  let config;
  const types = ["EC2"];
  const keyPairName = "kp";
  const serverName = "web-server";

  const createStack = async ({ imageProperties, serverProperties }) => {
    const provider = AwsProvider({
      config: () => ({ projectName: "ec2-test" }),
    });

    const keyPair = await provider.useKeyPair({
      name: keyPairName,
    });

    const image = await provider.useImage({
      name: imageProperties.name,
      properties: imageProperties.properties,
    });

    const server = await provider.makeEC2({
      name: serverName,
      properties: serverProperties,
      dependencies: { image, keyPair },
    });
    return { provider, resources: { image, server } };
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
      imageProperties: imageUbuntu,
      serverProperties: () => ({}),
    });

    assert.equal(server.name, serverName);

    const config = await server.resolveConfig();
    assert.equal(config.InstanceType, "t2.micro");
    assert.equal(config.MaxCount, 1);
    assert.equal(config.MinCount, 1);
    //assert.equal(config.KeyName, keyPair.name);
  });

  it("ec2 apply plan", async function () {
    // Step 1
    {
      const {
        provider,
        resources: { server },
      } = await createStack({
        imageProperties: imageUbuntu,
        serverProperties: () => ({
          InstanceType: "t2.micro",
        }),
      });

      await testPlanDeploy({ provider, types, destroy: true });
    }
    // Step 2: Change the InstanceType
    {
      const {
        provider,
        resources: { server },
      } = await createStack({
        imageProperties: imageUbuntu,
        serverProperties: () => ({
          InstanceType: "t3.micro",
        }),
      });

      await testPlanDeploy({ provider, types, destroy: false });

      const serverLive = await server.getLive();
      assert.equal(serverLive, "t3.micro");
    }

    // Step 3: Change the ImageId
    {
      const {
        provider,
        resources: { server, image },
      } = await createStack({
        imageProperties: imageAmazon2,
        serverProperties: () => ({
          InstanceType: "t3.micro",
        }),
      });

      await testPlanDeploy({ provider, types, destroy: false });
      const imageLive = await image.getLive();
      const serverLive = await server.getLive();
      assert.equal(serverLive.ImageId, imageLive.ImageId);
      await testPlanDestroy({ provider, types });
    }
  });
});
