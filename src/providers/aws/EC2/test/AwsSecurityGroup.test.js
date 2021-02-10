const assert = require("assert");
const { get, eq } = require("rubico");
const { find } = require("rubico/x");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsSecurityGroup", async function () {
  let config;
  let provider;
  let vpc;
  let sg;
  const clusterName = "cluster";
  const k8sSecurityGroupTagKey = `kubernetes.io/cluster/${clusterName}`;
  const types = ["SecurityGroup", "Vpc"];
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
    await provider.destroyAll({ options: { all: true, types } });
    vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });
    sg = await provider.makeSecurityGroup({
      name: "sg",
      dependencies: { vpc },
      properties: () => ({
        Tags: [{ Key: k8sSecurityGroupTagKey, Value: "owned" }],
        create: {
          Description: "Security Group Description",
        },
        ingress: {
          IpPermissions: [
            {
              FromPort: 22,
              IpProtocol: "tcp",
              IpRanges: [
                {
                  CidrIp: "0.0.0.0/0",
                },
              ],
              Ipv6Ranges: [
                {
                  CidrIpv6: "::/0",
                },
              ],
              ToPort: 22,
            },
          ],
        },
        egress: {
          IpPermissions: [
            {
              FromPort: 1024,
              IpProtocol: "tcp",
              IpRanges: [
                {
                  CidrIp: "0.0.0.0/0",
                },
              ],
              Ipv6Ranges: [
                {
                  CidrIpv6: "::/0",
                },
              ],
              ToPort: 65535,
            },
          ],
        },
      }),
    });
  });
  after(async () => {});
  it("empty ingress", async function () {
    const provider = AwsProvider({
      config: config.aws,
    });
    await provider.start();

    const vpc = await provider.makeVpc({
      name: "vpc-empty-ingress",
      properties: () => ({
        CidrBlock: "11.10.0.1/16",
      }),
    });
    await provider.makeSecurityGroup({
      name: "sg-empty-ingress",
      dependencies: { vpc },
      properties: () => ({
        create: {
          Description: "Security Group Description",
        },
      }),
    });

    await provider.destroyAll({ options: { types } });

    const { error, resultCreate } = await provider.planQueryAndApply();
    assert(error, "should have failed");
    assert(resultCreate.results[1].error.code, "InvalidParameterValue");
    await provider.destroyAll({ options: { types } });
  });
  it("sg name", async function () {
    assert.equal(sg.name, "sg");
  });
  it("sg resolveConfig", async function () {
    const config = await sg.resolveConfig();
    assert.equal(config.ingress.IpPermissions[0].FromPort, 22);
  });
  it.skip("sg apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    const sgLive = await sg.getLive();
    const vpcLive = await vpc.getLive();
    assert.equal(sgLive.IpPermissions.length, 2);
    assert.equal(sgLive.IpPermissionsEgress.length, 2);
    assert.equal(sgLive.VpcId, vpcLive.VpcId);
    assert(find(eq(get("Key"), k8sSecurityGroupTagKey))(sgLive.Tags));

    assert(
      CheckAwsTags({
        config: provider.config(),
        tags: sgLive.Tags,
        name: sg.name,
      })
    );

    await testPlanDestroy({ provider, full: false, types });
  });
});
