module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-ec2-vpc",
  iam: {
    Policy: {
      lambdaPolicy: {
        name: "lambda-policy",
        properties: {
          PolicyName: "lambda-policy",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["logs:*"],
                Effect: "Allow",
                Resource: "*",
              },
            ],
          },
          Path: "/",
          Description: "Allow logs",
        },
      },
    },
    Role: {
      lambdaRole: {
        name: "lambda-role",
        properties: {
          RoleName: "lambda-role",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "",
                Effect: "Allow",
                Principal: {
                  Service: "lambda.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
        },
      },
    },
  },
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
          Description: "Security Group Description",
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
