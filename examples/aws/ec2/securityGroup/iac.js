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
  const securityGroupCluster = provider.ec2.makeSecurityGroup({
    name: "security-group-cluster-test",
    dependencies: { vpc },
    properties: () => ({
      Description: "SG for the EKS Cluster",
    }),
  });

  const sgRuleClusterIngressSsh = provider.ec2.makeSecurityGroupRuleIngress({
    name: "sg-rule-cluster-ingress-port-22",
    dependencies: { securityGroup: securityGroupCluster },
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

  const sgRuleClusterEgress = provider.ec2.makeSecurityGroupRuleEgress({
    name: "sg-rule-cluster-egress",
    dependencies: {
      securityGroup: securityGroupCluster,
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

  const securityGroupNodes = provider.ec2.makeSecurityGroup({
    name: "security-group-node-group-test",
    dependencies: { vpc },
    properties: () => ({
      Description: "SG for the EKS Nodes",
    }),
  });

  const sgRuleNodesIngressCluster = provider.ec2.makeSecurityGroupRuleIngress({
    name: "sg-rule-node-group-ingress-cluster",
    dependencies: {
      securityGroup: securityGroupNodes,
      securityGroupFrom: securityGroupCluster,
    },
    properties: () => ({
      IpPermission: {
        FromPort: 0,
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
