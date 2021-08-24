module.exports = ({ stage }) => ({
  projectName: "example-grucloud-ecs-simple",
  iam: {
    Policy: {
      serviceRoleAmazonEc2ContainerServiceforEc2Role: {
        name: "service-role/AmazonEC2ContainerServiceforEC2Role",
        properties: {
          Arn: "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",
        },
      },
    },
    Role: {
      ecsInstanceRole: {
        name: "ecsInstanceRole",
        properties: {
          RoleName: "ecsInstanceRole",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2008-10-17",
            Statement: [
              {
                Sid: "",
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
      ecsInstanceRole: {
        name: "ecsInstanceRole",
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
          MapPublicIpOnLaunch: true,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      pubSubnetAz2: {
        name: "PubSubnetAz2",
        properties: {
          CidrBlock: "10.0.1.0/24",
          AvailabilityZone: "eu-west-2b",
          MapPublicIpOnLaunch: true,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
    },
    InternetGateway: {
      internetGateway: {
        name: "InternetGateway",
      },
    },
    RouteTable: {
      routeViaIgw: {
        name: "RouteViaIgw",
      },
    },
    Route: {
      routeViaIgwIgw: {
        name: "RouteViaIgw-igw",
        properties: {
          DestinationCidrBlock: "0.0.0.0/0",
        },
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
  },
  autoscaling: {
    AutoScalingGroup: {
      ecsInstanceAsg: {
        name: "EcsInstanceAsg",
        properties: {
          MinSize: 0,
          MaxSize: 1,
          DesiredCapacity: 1,
          DefaultCooldown: 300,
          HealthCheckType: "EC2",
          HealthCheckGracePeriod: 0,
        },
      },
    },
    LaunchConfiguration: {
      ec2ContainerServiceClusterEcsInstanceLcCoyk3Cqz0Qrj: {
        name: "EC2ContainerService-cluster-EcsInstanceLc-COYK3CQZ0QRJ",
        properties: {
          InstanceType: "t2.micro",
          ImageId: "ami-02fee912d20d2f3cd",
          UserData:
            "IyEvYmluL2Jhc2gKZWNobyBFQ1NfQ0xVU1RFUj1jbHVzdGVyID4+IC9ldGMvZWNzL2Vjcy5jb25maWc7ZWNobyBFQ1NfQkFDS0VORF9IT1NUPSA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnOw==",
          InstanceMonitoring: {
            Enabled: true,
          },
          BlockDeviceMappings: [
            {
              DeviceName: "/dev/xvda",
              Ebs: {
                VolumeSize: 30,
                VolumeType: "gp2",
              },
            },
          ],
          EbsOptimized: false,
        },
      },
    },
  },
  ecs: {
    Cluster: {
      cluster: {
        name: "cluster",
        properties: {
          settings: [
            {
              name: "containerInsights",
              value: "disabled",
            },
          ],
          defaultCapacityProviderStrategy: [],
        },
      },
    },
    CapacityProvider: {
      cp: {
        name: "cp",
        properties: {
          autoScalingGroupProvider: {
            managedScaling: {
              status: "ENABLED",
              targetCapacity: 100,
              minimumScalingStepSize: 1,
              maximumScalingStepSize: 10000,
              instanceWarmupPeriod: 300,
            },
            managedTerminationProtection: "DISABLED",
          },
        },
      },
    },
    TaskDefinition: {
      nginx: {
        name: "nginx",
        properties: {
          containerDefinitions: [
            {
              name: "nginx",
              image: "nginx",
              cpu: 0,
              memory: 512,
              portMappings: [
                {
                  containerPort: 80,
                  hostPort: 80,
                  protocol: "tcp",
                },
              ],
              essential: true,
              environment: [],
              mountPoints: [],
              volumesFrom: [],
            },
          ],
          placementConstraints: [],
          requiresCompatibilities: ["EC2"],
        },
      },
    },
    Service: {
      serviceNginx: {
        name: "service-nginx",
        properties: {
          launchType: "EC2",
          desiredCount: 2,
          deploymentConfiguration: {
            deploymentCircuitBreaker: {
              enable: false,
              rollback: false,
            },
            maximumPercent: 200,
            minimumHealthyPercent: 100,
          },
          placementConstraints: [],
          placementStrategy: [
            {
              type: "spread",
              field: "attribute:ecs.availability-zone",
            },
            {
              type: "spread",
              field: "instanceId",
            },
          ],
          schedulingStrategy: "REPLICA",
          enableECSManagedTags: true,
          enableExecuteCommand: false,
        },
      },
    },
  },
});
