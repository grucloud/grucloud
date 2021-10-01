const createResources = ({ provider }) => {
  provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-cluster-ingress-port-22",
    properties: () => ({
      IpPermission: {
        IpProtocol: "tcp",
        FromPort: 23,
        ToPort: 23,
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
