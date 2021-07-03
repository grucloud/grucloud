const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsVolume", async function () {
  const types = ["Volume", "Instance"];
  let config;
  let provider;
  let volume;
  let server;
  const serverName = "ec2-volume-test";
  const volumeName = "volume-test";
  const Device = "/dev/sdf";
  const deviceMounted = "/dev/xvdf";
  const mountPoint = "/data";

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    const image = provider.ec2.useImage({
      name: "Amazon Linux 2",
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

    volume = provider.ec2.makeVolume({
      name: volumeName,

      properties: () => ({
        Size: 5,
        VolumeType: "standard",
        Device,
      }),
    });

    server = provider.ec2.makeInstance({
      name: serverName,
      properties: () => ({
        UserData: volume.spec.setupEbsVolume({ deviceMounted, mountPoint }),
      }),
      dependencies: { image, volumes: [volume] },
    });
  });

  after(async () => {});
  it.skip("volume resolveConfig", async function () {
    const config = await volume.resolveConfig();
    assert(config.Size);
    assert(config.AvailabilityZone);
    assert(config.VolumeType);
  });
  it("volume apply and destroy", async function () {
    try {
      await testPlanDeploy({ provider, types });

      const volumeLive = await volume.getLive();

      assert(
        CheckAwsTags({
          config: provider.config,
          tags: volumeLive.Tags,
          name: volume.name,
        })
      );

      await testPlanDestroy({ provider, types });
    } catch (error) {
      throw error;
    }
  });
});
