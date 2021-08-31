const assert = require("assert");
const { get, eq, pipe } = require("rubico");
const { find } = require("rubico/x");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");
const { Cli } = require("@grucloud/core/cli/cliCommands");

describe.skip("AwsSubnet", async function () {
  const types = ["Vpc", "Subnet"];
  let config;
  let provider;
  let vpc;
  let subnet;
  const subnetName = "subnet-test";
  const k8sSubnetTagKey = "kubernetes.io/role/elb";

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

    await provider.start();

    vpc = provider.EC2.makeVpc({
      name: "vpc-test-subnet",
      properties: () => ({
        CidrBlock: "192.168.1.1/16",
      }),
    });
    subnet = provider.EC2.makeSubnet({
      name: subnetName,
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "192.168.1.1/24",
        Tags: [{ Key: k8sSubnetTagKey, Value: "1" }],
        MapPublicIpOnLaunch: true,
      }),
    });
  });
  after(async () => {});
  it("subnet name", async function () {
    assert.equal(subnet.name, subnetName);
  });
  it.skip("subnet apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    const subnetLive = await subnet.getLive();
    assert(subnetLive.MapPublicIpOnLaunch);
    const vpcLive = await vpc.getLive();
    assert.equal(subnetLive.VpcId, vpcLive.VpcId);

    assert(find(eq(get("Key"), k8sSubnetTagKey))(subnetLive.Tags));

    assert(
      CheckAwsTags({
        config: provider.config,
        tags: subnetLive.Tags,
        name: subnet.name,
      })
    );
    const cli = await Cli({
      createStack: () => ({
        provider,
      }),
    });
    const result = await cli.list({
      commandOptions: { our: true, types: ["Subnet"] },
    });
    assert(!result.error);
    assert(result.results);

    await testPlanDestroy({ provider, types });
  });
});
