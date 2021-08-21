module.exports = ({ stage }) => ({
  projectName: "example-grucloud-autoscaling-group",
  iam: {
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
  ec2: {
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
            TagSpecifications: [
              {
                ResourceType: "instance",
                Tags: [
                  {
                    Key: "Name",
                    Value: "lt-ec2-micro",
                  },
                  {
                    Key: "gc-managed-by",
                    Value: "grucloud",
                  },
                  {
                    Key: "gc-created-by-provider",
                    Value: "aws",
                  },
                  {
                    Key: "gc-stage",
                    Value: "dev",
                  },
                  {
                    Key: "gc-project-name",
                    Value: "example-grucloud-ec2-launch-template",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  autoscaling: {
    AutoScalingGroup: {
      asg: {
        name: "asg",
        properties: {
          MinSize: 1,
          MaxSize: 1,
          DesiredCapacity: 1,
          DefaultCooldown: 300,
          HealthCheckType: "EC2",
          HealthCheckGracePeriod: 300,
        },
      },
    },
  },
});
