module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-ec2-security-group",
  ec2: {
    Vpc: {
      vpcTestSg: {
        name: "vpc-test-sg",
        properties: {
          CidrBlock: "10.1.0.0/16",
          DnsSupport: true,
          DnsHostnames: false,
        },
      },
    },
    SecurityGroup: {
      securityGroupClusterTest: {
        name: "security-group-cluster-test",
        properties: {
          Description: "Managed By GruCloud",
        },
      },
      securityGroupNodeGroupTest: {
        name: "security-group-node-group-test",
        properties: {
          Description: "Managed By GruCloud",
        },
      },
    },
    SecurityGroupRuleIngress: {
      sgRuleClusterIngressPort_22: {
        name: "sg-rule-cluster-ingress-port-22",
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
      sgRuleNodeGroupIngressCluster: {
        name: "sg-rule-node-group-ingress-cluster",
        properties: {
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
        },
      },
    },
    SecurityGroupRuleEgress: {
      sgRuleClusterEgress: {
        name: "sg-rule-cluster-egress",
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
