const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckTags } = require("./AwsTagCheck");

describe("AwsSubnet", async function () {
  let config;
  let provider;
  let vpc;
  let subnet;
  const subnetName = "subnet";
  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
    provider = await AwsProvider({
      name: "aws",
      config: ConfigLoader({ baseDir: __dirname }),
    });
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

    const { success } = await provider.destroyAll();
    assert(success, "destroyAll failed");
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("subnet name", async function () {
    assert.equal(subnet.name, subnetName);
  });
  it("subnet resolveConfig", async function () {
    const config = await subnet.resolveConfig();
    assert(config.CidrBlock);
  });
  it("subnet targets", async function () {
    const live = await subnet.getLive();
  });
  it("subnet listLives", async function () {
    const [subnets] = await provider.listLives({ types: ["Subnet"] });
    assert(subnets);
    const subnetDefault = subnets.resources.find(
      (subnet) => subnet.data.DefaultForAz
    );
    assert(subnetDefault);
  });
  it("subnet apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const subnetLive = await subnet.getLive();
    const vpcLive = await vpc.getLive();
    assert.equal(subnetLive.VpcId, vpcLive.VpcId);

    CheckTags({
      config: provider.config(),
      tags: subnetLive.Tags,
      name: subnet.name,
    });

    await testPlanDestroy({ provider, full: false });
  });
});
