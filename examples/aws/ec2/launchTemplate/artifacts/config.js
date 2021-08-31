module.exports = ({ stage }) => ({
  projectName: "example-grucloud-ec2-launch-template",
  IAM: {
    Role: {
      roleEcs: {
        name: "role-ecs",
        properties: {
          RoleName: "role-ecs",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: "ec2.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
        },
      },
    },
    InstanceProfile: {
      roleEcs: {
        name: "role-ecs",
      },
    },
  },
  EC2: {
    Vpc: {
      vpc: {
        name: "Vpc",
        properties: {
          CidrBlock: "10.0.0.0/16",
          DnsSupport: true,
          DnsHostnames: true,
        },
      },
    },
    Subnet: {
      pubSubnetAz1: {
        name: "PubSubnetAz1",
        properties: {
          CidrBlock: "10.0.0.0/24",
          AvailabilityZone: "eu-west-2a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      pubSubnetAz2: {
        name: "PubSubnetAz2",
        properties: {
          CidrBlock: "10.0.1.0/24",
          AvailabilityZone: "eu-west-2b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
    },
    KeyPair: {
      kpEcs: {
        name: "kp-ecs",
      },
    },
    SecurityGroup: {
      ecsSecurityGroup: {
        name: "EcsSecurityGroup",
        properties: {
          Description: "Managed By GruCloud",
        },
      },
    },
    SecurityGroupRuleIngress: {
      ecsSecurityGroupRuleIngressTcp_80V4: {
        name: "EcsSecurityGroup-rule-ingress-tcp-80-v4",
        properties: {
          IpPermission: {
            IpProtocol: "tcp",
            FromPort: 80,
            ToPort: 80,
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
          },
        },
      },
    },
    LaunchTemplate: {
      ltEc2Micro: {
        name: "lt-ec2-micro",
        properties: {
          LaunchTemplateData: {
            EbsOptimized: false,
            ImageId: "ami-0d26eb3972b7f8c96",
            InstanceType: "t2.micro",
            KeyName: "kp-ecs",
          },
        },
      },
    },
  },
});
