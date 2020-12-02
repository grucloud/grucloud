const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsSubnet", async function () {
  let config;
  let provider;
  let vpc;
  let subnet;
  const subnetName = "subnet";
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

    vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });
    subnet = await provider.makeSubnet({
      name: subnetName,
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "10.1.0.1/24",
      }),
    });
  });
  after(async () => {});
  it("subnet name", async function () {
    assert.equal(subnet.name, subnetName);
  });
  it("subnet resolveConfig", async function () {
    const config = await subnet.resolveConfig();
    assert(config.CidrBlock);
  });
  it.skip("subnet targets", async function () {
    const live = await subnet.getLive();
  });
  it.skip("subnet listLives", async function () {
    const {
      results: [subnets],
    } = await provider.listLives({ types: ["Subnet"] });
    assert(subnets);
    const subnetDefault = subnets.resources.find(
      (subnet) => subnet.data.DefaultForAz
    );
    assert(subnetDefault);
  });
  it.skip("subnet apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const subnetLive = await subnet.getLive();
    const vpcLive = await vpc.getLive();
    assert.equal(subnetLive.VpcId, vpcLive.VpcId);

    CheckAwsTags({
      config: provider.config(),
      tags: subnetLive.Tags,
      name: subnet.name,
    });

    await testPlanDestroy({ provider, full: false });
  });
});
