const createResources = ({ provider }) => {
  provider.EC2.makeVpc({
    name: "vpc-test-sg",
    properties: () => ({
      CidrBlock: "10.1.0.0/16",
      DnsSupport: true,
      DnsHostnames: false,
    }),
  });

  provider.EC2.makeSecurityGroup({
    name: "security-group-cluster-test",
    properties: () => ({
      Description: "Managed By GruCloud",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpcTestSg,
    }),
  });

  provider.EC2.makeSecurityGroup({
    name: "security-group-node-group-test",
    properties: () => ({
      Description: "Managed By GruCloud",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpcTestSg,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-cluster-ingress-port-22",
    properties: () => ({
      IpPermission: {
        IpProtocol: "tcp",
        FromPort: 22,
        ToPort: 22,
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
      },
    }),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.securityGroupClusterTest,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-node-group-ingress-cluster",
    properties: () => ({
      IpPermission: {
        IpProtocol: "tcp",
        FromPort: 0,
        ToPort: 65535,
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
      },
    }),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.securityGroupNodeGroupTest,
      securityGroupFrom: resources.EC2.SecurityGroup.securityGroupClusterTest,
    }),
  });

  provider.EC2.makeSecurityGroupRuleEgress({
    name: "sg-rule-cluster-egress",
    properties: () => ({
      IpPermission: {
        IpProtocol: "tcp",
        FromPort: 1024,
        ToPort: 65535,
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
      },
    }),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.securityGroupClusterTest,
    }),
  });
};

exports.createResources = createResources;
