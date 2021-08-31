module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-ec2-security-group",
  EC2: {
    SecurityGroupRuleIngress: {
      sgRuleClusterIngressPort_22: {
        name: "sg-rule-cluster-ingress-port-22",
        properties: {
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
        },
      },
    },
  },
});
