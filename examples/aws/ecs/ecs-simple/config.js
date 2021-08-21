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
      ec2ContainerServiceMyClusterDemoEcsInstanceLc_1Uka3Bbe6Tzqm: {
        name: "EC2ContainerService-my-cluster-demo-EcsInstanceLc-1UKA3BBE6TZQM",
        properties: {
          InstanceType: "t2.micro",
          ImageId: "ami-02fee912d20d2f3cd",
          UserData:
            "IyEvYmluL2Jhc2gKZWNobyBFQ1NfQ0xVU1RFUj1teS1jbHVzdGVyLWRlbW8gPj4gL2V0Yy9lY3MvZWNzLmNvbmZpZztlY2hvIEVDU19CQUNLRU5EX0hPU1Q9ID4+IC9ldGMvZWNzL2Vjcy5jb25maWc7",
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
      myClusterDemo: {
        name: "my-cluster-demo",
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
      cpDemo: {
        name: "cp-demo",
        properties: {
          autoScalingGroupProvider: {
            managedScaling: {
              status: "ENABLED",
              targetCapacity: 80,
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
              memory: 128,
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
  },
});
