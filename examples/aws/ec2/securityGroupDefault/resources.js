const createResources = ({ provider }) => {
  provider.EC2.useDefaultSecurityGroup({
    name: "sg-default-vpc-default",
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-test",
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
      securityGroup: resources.EC2.SecurityGroup.sgDefaultVpcDefault,
    }),
  });

  provider.EC2.makeSecurityGroupRuleEgress({
    name: "sg-rule-egress-test",
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
      securityGroup: resources.EC2.SecurityGroup.sgDefaultVpcDefault,
    }),
  });
};

exports.createResources = createResources;
