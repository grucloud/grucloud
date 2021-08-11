module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-ec2-security-group",
  ec2: {
    Vpc: {
      vpc: {
        name: "vpc",
        properties: {
          CidrBlock: "192.168.0.0/16",
          DnsSupport: true,
          DnsHostnames: true,
        },
      },
      vpcEc2Example: {
        name: "vpc-ec2-example",
        properties: {
          CidrBlock: "10.1.0.0/16",
          DnsSupport: true,
          DnsHostnames: false,
        },
      },
      vpcPostgres: {
        name: "vpc-postgres",
        properties: {
          CidrBlock: "192.168.0.0/16",
          DnsSupport: true,
          DnsHostnames: true,
        },
      },
      vpcTestSg: {
        name: "vpc-test-sg",
        properties: {
          CidrBlock: "10.1.0.0/16",
          DnsSupport: true,
          DnsHostnames: false,
        },
      },
    },
    Subnet: {
      subnet: {
        name: "subnet",
        properties: {
          CidrBlock: "10.1.0.0/24",
          AvailabilityZone: "us-east-1a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      subnet_1: {
        name: "subnet-1",
        properties: {
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: "us-east-1a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      subnet_2: {
        name: "subnet-2",
        properties: {
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: "us-east-1b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      subnetPrivateA: {
        name: "subnet-private-a",
        properties: {
          CidrBlock: "192.168.96.0/19",
          AvailabilityZone: "us-east-1a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      subnetPrivateB: {
        name: "subnet-private-b",
        properties: {
          CidrBlock: "192.168.128.0/19",
          AvailabilityZone: "us-east-1b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      subnetPublicA: {
        name: "subnet-public-a",
        properties: {
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: "us-east-1a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      subnetPublicB: {
        name: "subnet-public-b",
        properties: {
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: "us-east-1b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
    },
    InternetGateway: {
      ig: {
        name: "ig",
      },
      igPostgres: {
        name: "ig-postgres",
      },
      internetGateway: {
        name: "internet-gateway",
      },
    },
    SecurityGroup: {
      securityGroup: {
        name: "security-group",
        properties: {
          Description: "Security Group Postgres",
        },
      },
      securityGroupClusterTest: {
        name: "security-group-cluster-test",
        properties: {
          Description: "SG for the EKS Cluster",
        },
      },
      securityGroupNodeGroupTest: {
        name: "security-group-node-group-test",
        properties: {
          Description: "SG for the EKS Nodes",
        },
      },
      securityGroupPostgres: {
        name: "security-group-postgres",
        properties: {
          Description: "Security Group Postgres",
        },
      },
      securityGroupPublic: {
        name: "security-group-public",
        properties: {
          Description: "Security Group Description",
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
      sgRuleIngressIcmp: {
        name: "sg-rule-ingress-icmp",
        properties: {
          IpPermission: {
            IpProtocol: "icmp",
            FromPort: -1,
            ToPort: -1,
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
      sgRuleIngressPostgres: {
        name: "sg-rule-ingress-postgres",
        properties: {
          IpPermission: {
            IpProtocol: "tcp",
            FromPort: 5432,
            ToPort: 5432,
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
      sgRuleIngressSsh: {
        name: "sg-rule-ingress-ssh",
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
      sgRuleIngressSshBastion: {
        name: "sg-rule-ingress-ssh-bastion",
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
