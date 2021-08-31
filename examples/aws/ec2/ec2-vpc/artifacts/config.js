module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-ec2-vpc",
  EC2: {
    Vpc: {
      vpcEc2Example: {
        name: "vpc-ec2-example",
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
          AvailabilityZone: "eu-west-2a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
    },
    KeyPair: {
      kpEc2Vpc: {
        name: "kp-ec2-vpc",
      },
    },
    Volume: {
      volume: {
        name: "volume",
        properties: {
          Size: 5,
          VolumeType: "standard",
          AvailabilityZone: "eu-west-2a",
        },
      },
    },
    ElasticIpAddress: {
      myip: {
        name: "myip",
      },
    },
    InternetGateway: {
      ig: {
        name: "ig",
      },
    },
    RouteTable: {
      routeTable: {
        name: "route-table",
      },
    },
    Route: {
      routeIg: {
        name: "route-ig",
        properties: {
          DestinationCidrBlock: "0.0.0.0/0",
        },
      },
    },
    SecurityGroup: {
      securityGroup: {
        name: "security-group",
        properties: {
          Description: "Managed By GruCloud",
        },
      },
    },
    SecurityGroupRuleIngress: {
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
    },
    Instance: {
      webServerEc2Vpc: {
        name: "web-server-ec2-vpc",
        properties: {
          InstanceType: "t2.micro",
          ImageId: "ami-084a1f89b0bb0f729",
        },
      },
    },
  },
});
