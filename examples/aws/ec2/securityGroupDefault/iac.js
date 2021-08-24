const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");

exports.config = require("./config");

const createResources = async ({ provider, resources: {} }) => {
  const vpcDefault = provider.ec2.useDefaultVpc({
    name: "vpc-default",
  });

  const securityGroup = provider.ec2.useDefaultSecurityGroup({
    name: "sgCluster-test",
  });

  const sgRuleIngress = provider.ec2.makeSecurityGroupRuleIngress({
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
  const sgRuleEgress = provider.ec2.makeSecurityGroupRuleEgress({
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
  return {};
};
exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  // Create a AWS provider
  const provider = createProvider(AwsProvider, { config: require("./config") });
  const resources = await createResources({ provider, resources: {} });

  return {
    provider,
    resources,
  };
};
