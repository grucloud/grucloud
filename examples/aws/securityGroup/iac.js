const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");

exports.config = require("./config");

const createResources = async ({ provider, resources: {} }) => {
  const { config } = provider;
  const vpc = provider.ec2.makeVpc({
    name: "vpc-test-sg",
    properties: () => ({
      CidrBlock: "10.1.0.1/16",
    }),
  });
  const securityGroup = provider.ec2.makeSecurityGroup({
    name: "security-group-test",
    dependencies: { vpc },
    properties: () => ({
      create: {
        Description: "Security Group Description",
      },
    }),
  });

  sgRuleIngressSsh = provider.ec2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-port-22",
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

  const sgClusterRuleEgress = provider.ec2.makeSecurityGroupRuleEgress({
    name: "sg-rule-egress",
    dependencies: {
      securityGroup,
    },
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

exports.createStack = async () => {
  // Create a AWS provider
  const provider = AwsProvider({ config: require("./config") });
  const resources = await createResources({ provider, resources: {} });

  return {
    provider,
    resources,
  };
};
