const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

const formatName = (name) => `${name}-image-test`;
describe("AwsImage", async function () {
  let config;
  let provider;
  const types = ["EC2", "Image"];

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    await provider.start();
  });
  after(async () => {});
  it.skip("find ubuntu 20.04", async function () {
    const image = provider.ec2.useImage({
      name: "ubuntu 20.04",
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
    });

    const imageLive = await image.getLive();
    assert(imageLive);
    assert(imageLive.ImageId);
  });
  it("image does not exist", async function () {
    const image = provider.ec2.useImage({
      name: "ubuntu 20.04",
      properties: () => ({
        Filters: [
          {
            Name: "architecture",
            Values: ["x86_64"],
          },
          {
            Name: "description",
            Values: ["XXXCCCVVVWWWEEE"],
          },
        ],
      }),
    });

    const imageLive = await image.getLive();
    assert(!imageLive);
  });

  it.skip("ec2 with image", async function () {
    const image = provider.ec2.useImage({
      name: "Amazon Linux 2 AMI",
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
    });

    const server = provider.ec2.makeInstance({
      name: formatName("myserver"),
      dependencies: {
        image,
      },
      properties: () => ({
        InstanceType: "t2.micro",
      }),
    });
    await testPlanDeploy({ provider, types });

    const imageLive = await image.getLive();
    assert(imageLive);
    assert(imageLive.ImageId);

    const serverLive = await server.getLive();
    assert(serverLive);
    assert.equal(serverLive.ImageId, imageLive.ImageId);

    await testPlanDestroy({ provider, types });
  });
});
