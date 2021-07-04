const assert = require("assert");
const { get, eq, pipe, tap } = require("rubico");
const { find } = require("rubico/x");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsVpc", async function () {
  const vpcName = "vpc-test";
  const types = ["Vpc"];
  let config;
  let provider;
  let vpc;
  let vpcDefault;
  const k8sClusterTagKey = `kubernetes.io/cluster/myClusterName`;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    vpc = provider.ec2.makeVpc({
      name: vpcName,
      properties: () => ({
        DnsHostnames: true,
        CidrBlock: "10.0.0.0/16",
        Tags: [{ Key: k8sClusterTagKey, Value: "shared" }],
      }),
    });
    vpcDefault = provider.ec2.useVpc({
      name: "vpc-default",
      filterLives: ({ items }) =>
        pipe([
          () => items,
          find(get("IsDefault")),
          tap((live) => {
            assert(true);
          }),
        ])(),
    });
  });
  after(async () => {});
  it("vpc name", async function () {
    assert.equal(vpc.name, vpcName);
  });

  it.skip("vpc listLives canBeDeleted", async function () {
    const { results } = provider.listLives({
      options: {
        types,
        canBeDeleted: true,
      },
    });
    assert(isEmpty(results));
  });

  it("vpc apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    const vpcLive = await vpc.getLive({ deep: true });

    //TODO
    {
      const vpcLiveDefault = await vpcDefault.resolveConfig();
      assert(vpcLiveDefault);
    }
    {
      const vpcLiveDefault = await vpcDefault.getLive();
      assert(vpcLiveDefault);
      assert(vpcLiveDefault.IsDefault);
    }
    const { VpcId, Tags } = vpcLive;
    assert(VpcId);
    assert(Tags);

    assert(find(eq(get("Key"), k8sClusterTagKey))(vpcLive.Tags));

    assert(
      CheckAwsTags({
        config: provider.config,
        tags: vpcLive.Tags,
        name: vpc.name,
      })
    );
    await testPlanDestroy({ provider, types, full: false });
  });
});
