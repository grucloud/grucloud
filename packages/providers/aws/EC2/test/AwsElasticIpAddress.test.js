const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsElasticIpAddress", async function () {
  let config;
  let provider;
  let eip;
  const resourceName = "myip";
  const types = ["ElasticIpAddress"];
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      name: "aws",
      config: () => ({ projectName: "gru-test" }),
    });

    eip = provider.EC2.makeElasticIpAddress({
      name: resourceName,
      properties: () => ({}),
    });

    server = provider.EC2.makeInstance({
      name: "ec2",
      dependencies: { eip },
      properties: () => ({}),
    });
  });
  after(async () => {});
  it("eip name", async function () {
    assert.equal(eip.name, resourceName);
  });
  it.skip("eip apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    const eipLive = await eip.getLive();

    assert(
      CheckAwsTags({
        config: provider.config,
        tags: eipLive.Tags,
        name: eip.name,
      })
    );

    await testPlanDestroy({ provider, types });
  });
});
