const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  ec2: {
    Vpc: {
      vpcEc2Example: {
        name: "vpc-ec2-example",
        properties: {
          CidrBlock: "10.1.0.0/16",
          DnsSupport: true,
          DnsHostnames: false,
        },
      },
      vpcDefault: {
        name: "vpc-default",
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
      kp: {
        name: "kp",
        properties: {
          KeyPairId: "key-03d67e8e3990df776",
          KeyFingerprint:
            "29:88:c1:d1:9a:6b:05:66:65:fe:cd:1d:be:30:ee:6c:08:95:d5:ae",
          KeyName: "kp",
        },
      },
    },
    Volume: {
      volume: {
        name: "volume",
        properties: {
          Size: 5,
          VolumeType: "standard",
        },
      },
      vol_06724d6a9e89eb755: {
        name: "vol-06724d6a9e89eb755",
        properties: {
          Size: 2,
          VolumeType: "standard",
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
          Description: "Security Group Description",
        },
      },
      sgDefaultVpcEc2Example: {
        name: "sg-default-vpc-ec2-example",
      },
      sgDefaultVpcDefault: {
        name: "sg-default-vpc-default",
      },
    },
    SecurityGroupRuleIngress: {
      sgRuleIngressSsh: {
        name: "sg-rule-ingress-ssh",
        properties: {
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
        },
      },
      sgRuleIngressIcmp: {
        name: "sg-rule-ingress-icmp",
        properties: {
          IpPermission: {
            FromPort: -1,
            IpProtocol: "icmp",
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
            ToPort: -1,
          },
        },
      },
      sgDefaultVpcEc2ExampleRuleIngressAll: {
        name: "sg-default-vpc-ec2-example-rule-ingress-all",
      },
      sgDefaultVpcDefaultRuleIngressAll: {
        name: "sg-default-vpc-default-rule-ingress-all",
      },
    },
    SecurityGroupRuleEgress: {
      securityGroupRuleEgressAll: {
        name: "security-group-rule-egress-all",
      },
      sgDefaultVpcEc2ExampleRuleEgressAll: {
        name: "sg-default-vpc-ec2-example-rule-egress-all",
      },
      sgDefaultVpcDefaultRuleEgressAll: {
        name: "sg-default-vpc-default-rule-egress-all",
      },
    },
    Instance: {
      webServerEc2Vpc: {
        name: "web-server-ec2-vpc",
        properties: {
          InstanceType: "t2.micro",
          ImageId: "ami-0baa0a5cc6cd768ac",
          Placement: {
            AvailabilityZone: "eu-west-2a",
          },
        },
      },
    },
  },
});
