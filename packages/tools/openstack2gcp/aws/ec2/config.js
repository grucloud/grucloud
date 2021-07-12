const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  ec2: {
    Vpc: {
      vpcDefault: {
        name: "vpc-default",
        properties: {
          CidrBlock: "172.31.0.0/16",
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
    },
    ElasticIpAddress: {
      myip: {
        name: "myip",
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
        properties: {
          Description: "default VPC security group",
        },
      },
      sgDefaultVpcDefault: {
        name: "sg-default-vpc-default",
        properties: {
          Description: "default VPC security group",
        },
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
        properties: {
          IpPermission: {
            IpProtocol: "-1",
            IpRanges: [],
            Ipv6Ranges: [],
            UserIdGroupPairs: [
              {
                GroupId: "sg-05abd72c4d45078fa",
              },
            ],
          },
        },
      },
      sgDefaultVpcDefaultRuleIngressAll: {
        name: "sg-default-vpc-default-rule-ingress-all",
        properties: {
          IpPermission: {
            IpProtocol: "-1",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [],
          },
        },
      },
    },
    SecurityGroupRuleEgress: {
      securityGroupRuleEgressAll: {
        name: "security-group-rule-egress-all",
        properties: {
          IpPermission: {
            IpProtocol: "-1",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [],
          },
        },
      },
      sgDefaultVpcEc2ExampleRuleEgressAll: {
        name: "sg-default-vpc-ec2-example-rule-egress-all",
        properties: {
          IpPermission: {
            IpProtocol: "-1",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [],
          },
        },
      },
      sgDefaultVpcDefaultRuleEgressAll: {
        name: "sg-default-vpc-default-rule-egress-all",
        properties: {
          IpPermission: {
            IpProtocol: "-1",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [],
          },
        },
      },
    },
    InternetGateway: {
      ig: {
        name: "ig",
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
