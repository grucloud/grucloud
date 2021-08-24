const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

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
  const types = ["Instance", "KeyPair"];
  const keyPairName = "kp-test-ec2";
  const serverName = "web-server";

  const createStack = async ({ imageProperties, serverProperties }) => {
    const provider = AwsProvider({
      config: () => ({ projectName: "ec2-test" }),
    });

    const keyPair = provider.ec2.makeKeyPair({
      name: keyPairName,
    });

    const image = provider.ec2.useImage({
      name: imageProperties.name,
      properties: imageProperties.properties,
    });

    const server = provider.ec2.makeInstance({
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

  it.skip("ec2 apply plan", async function () {
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
      await testPlanDestroy({ provider, types });
    }
  });
});
