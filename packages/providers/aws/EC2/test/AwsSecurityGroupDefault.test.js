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

    vpcDefault = await provider.useVpc({
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

    securityGroup = await provider.useSecurityGroup({
      name: "sgCluster",
      filterLives: ({ items }) =>
        pipe([
          () => items,
          find(eq(get("GroupName"), "default")),
          tap((live) => {
            //logger.info(`sgCluster live ${live}`);
          }),
        ])(),
    });

    sgRuleIngress = await provider.makeSecurityGroupRuleIngress({
      name: "sg-rule-ingress",
      dependencies: { securityGroup },
      properties: () => ({
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
      }),
    });
    sgRuleEgress = await provider.makeSecurityGroupRuleEgress({
      name: "sg-rule-egress",
      dependencies: { securityGroup },
      properties: () => ({
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
      }),
    });
  });
  after(async () => {});
  it("sg default apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    const vpcDefaultLive = await vpcDefault.getLive();
    assert(vpcDefaultLive);
    await testPlanDestroy({ provider, types });
  });
});
