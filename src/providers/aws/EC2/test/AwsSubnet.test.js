const assert = require("assert");
const { get, eq } = require("rubico");
const { find } = require("rubico/x");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsSubnet", async function () {
  const types = ["Vpc", "Subnet"];
  let config;
  let provider;
  let vpc;
  let subnet;
  const subnetName = "subnet";
  const k8sSubnetTagKey = "kubernetes.io/role/elb";

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
        Tags: [{ Key: k8sSubnetTagKey, Value: "1" }],
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

  it("subnet apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    const subnetLive = await subnet.getLive();
    const vpcLive = await vpc.getLive();
    assert.equal(subnetLive.VpcId, vpcLive.VpcId);

    assert(find(eq(get("Key"), k8sSubnetTagKey))(subnetLive.Tags));

    assert(
      CheckAwsTags({
        config: provider.config(),
        tags: subnetLive.Tags,
        name: subnet.name,
      })
    );

    const {
      results: [subnets],
    } = await provider.listLives({ types: ["Subnet"] });
    assert(subnets);
    const subnetDefault = subnets.resources.find(
      (subnet) => subnet.data.DefaultForAz
    );
    assert(subnetDefault);

    await testPlanDestroy({ provider, types, full: false });
  });
});
