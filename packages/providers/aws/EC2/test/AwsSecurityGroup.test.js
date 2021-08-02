const assert = require("assert");
const { get, eq } = require("rubico");
const { size, isEmpty } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

const {
  SecurityGroupRulesFixture,
  SecurityGroupRulesFixtureMerged,
} = require("./AwsSecurityGroupFixtures");
const { mergeSecurityGroupRules } = require("../AwsSecurityGroupRule");

describe("AwsSecurityGroup", async function () {
  let config;
  let provider;
  let vpc;
  let sg;
  let sgDefault;
  const clusterName = "cluster";
  const k8sSecurityGroupTagKey = `kubernetes.io/cluster/${clusterName}`;
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

    vpc = provider.ec2.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });
    sg = provider.ec2.makeSecurityGroup({
      name: "security-group-test",
      dependencies: { vpc },
      properties: () => ({
        Tags: [{ Key: k8sSecurityGroupTagKey, Value: "owned" }],
        create: {
          Description: "Security Group Description",
        },
      }),
    });
    sgRuleIngress = provider.ec2.makeSecurityGroupRuleIngress({
      name: "sg-rule-ingress-port-22",
      dependencies: { securityGroup: sg },
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
      name: "sg-rule-egress-all",
      dependencies: { securityGroup: sg },
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
  it.skip("sg apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    await testPlanDestroy({ provider, types });
  });

  it("merge security group rules", async function () {
    const merged = mergeSecurityGroupRules(SecurityGroupRulesFixture);
    assert.equal(size(merged), 2);
    const diff = detailedDiff(merged, SecurityGroupRulesFixtureMerged);
    assert(isEmpty(diff.added));
    assert(isEmpty(diff.deleted));
    assert(isEmpty(diff.updated));
  });
});
