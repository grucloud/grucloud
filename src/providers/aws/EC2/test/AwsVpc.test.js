const assert = require("assert");
const AWS = require("aws-sdk");
const { get, eq } = require("rubico");
const { find } = require("rubico/x");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsVpc", async function () {
  const vpcName = "vpc-test";
  const types = ["Vpc"];
  let config;
  let provider;
  let vpc;

  const k8sClusterTagKey = `kubernetes.io/cluster/myClusterName`;

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: config.aws,
    });

    await provider.start();

    vpc = await provider.makeVpc({
      name: vpcName,
      properties: () => ({
        DnsHostnames: true,
        CidrBlock: "10.0.0.0/16",
        Tags: [{ Key: k8sClusterTagKey, Value: "shared" }],
      }),
    });
  });
  after(async () => {});
  it("vpc name", async function () {
    assert.equal(vpc.name, vpcName);
  });

  it("vpc listLives canBeDeleted", async function () {
    const { results } = await provider.listLives({
      types,
      canBeDeleted: true,
    });
    assert(isEmpty(results));
  });

  it("vpc apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    const vpcLive = await vpc.getLive({ deep: true });
    const { VpcId } = vpcLive;
    assert(vpcLive.Tags);
    //assert(vpcLive.DnsHostnames);

    assert(find(eq(get("Key"), k8sClusterTagKey))(vpcLive.Tags));

    assert(
      CheckAwsTags({
        config: provider.config(),
        tags: vpcLive.Tags,
        name: vpc.name,
      })
    );

    const {
      results: [vpcs],
    } = await provider.listLives({ types });
    assert(vpcs);
    const vpcDefault = vpcs.resources.find((vpc) => vpc.data.IsDefault);
    assert(vpcDefault);

    await testPlanDestroy({ provider, types, full: false });
  });
});
