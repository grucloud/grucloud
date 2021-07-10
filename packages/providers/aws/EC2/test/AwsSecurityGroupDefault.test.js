const assert = require("assert");
const { get, eq, pipe, tap } = require("rubico");
const { find } = require("rubico/x");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("AwsSecurityGroupDefault", async function () {
  let config;
  let provider;
  let vpcDefault;
  let securityGroup;
  let sgRuleIngress;
  let sgRuleEgress;
  const types = [
    "SecurityGroup",
    "SecurityGroupRuleIngress",
    "SecurityGroupRuleEgress",
    "Vpc",
  ];
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
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

    securityGroup = provider.ec2.useSecurityGroup({
      name: "sgCluster-test",
      filterLives: ({ items }) =>
        pipe([
          () => items,
          find(eq(get("GroupName"), "default")),
          tap((live) => {
            //logger.info(`sgCluster live ${live}`);
          }),
        ])(),
    });

    sgRuleIngress = provider.ec2.makeSecurityGroupRuleIngress({
      name: "sg-rule-ingress-test",
      dependencies: { securityGroup },
      properties: () => ({
        IpPermission: {
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
      }),
    });
    sgRuleEgress = provider.ec2.makeSecurityGroupRuleEgress({
      name: "sg-rule-egress-test",
      dependencies: { securityGroup },
      properties: () => ({
        IpPermission: {
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
      }),
    });
  });
  after(async () => {});
  it("sg default apply and destroy", async function () {
    try {
      await testPlanDeploy({ provider, types });
      const vpcDefaultLive = await vpcDefault.getLive();
      assert(vpcDefaultLive);
      await testPlanDestroy({ provider, types });
    } catch (error) {
      throw error;
    }
  });
});
