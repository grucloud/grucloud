module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-ec2-security-group-default",
  EC2: {
    SecurityGroupRuleIngress: {
      sgRuleIngressTest: {
        name: "sg-rule-ingress-test",
        properties: {
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
        },
      },
    },
    SecurityGroupRuleEgress: {
      sgRuleEgressTest: {
        name: "sg-rule-egress-test",
        properties: {
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
        },
      },
    },
  },
});
