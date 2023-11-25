// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Instance",
    group: "EC2",
    name: "console-demo",
    properties: ({ config, getId }) => ({
      BootMode: "uefi",
      CurrentInstanceBootMode: "uefi",
      EbsOptimized: true,
      Image: {
        Description:
          "Canonical, Ubuntu, 22.04 LTS, arm64 jammy image build on 2023-09-19",
      },
      InstanceType: "t4g.small",
      MetadataOptions: {
        HttpPutResponseHopLimit: 2,
        HttpTokens: "required",
      },
      NetworkInterfaces: [
        {
          DeviceIndex: 0,
          Groups: [
            `${getId({
              type: "SecurityGroup",
              group: "EC2",
              name: "sg::vpc::launch-wizard-2",
            })}`,
          ],
          SubnetId: `${getId({
            type: "Subnet",
            group: "EC2",
            name: `vpc::subnet-public1-${config.region}a`,
          })}`,
        },
      ],
      Placement: {
        AvailabilityZone: `${config.region}a`,
      },
    }),
    dependencies: ({ config }) => ({
      subnets: [`vpc::subnet-public1-${config.region}a`],
      keyPair: "kp-console-demo",
      iamInstanceProfile: "role-ec2-s3",
      securityGroups: ["sg::vpc::launch-wizard-2"],
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "igw" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "vpc",
      internetGateway: "igw",
    }),
  },
  { type: "KeyPair", group: "EC2", name: "kp-console-demo" },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "igw",
      routeTable: "vpc::rtb-public",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "rtb-public",
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: "vpc::rtb-public",
      subnet: `vpc::subnet-public1-${config.region}a`,
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::vpc::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "launch-wizard-2",
      Description: "launch-wizard-2 created 2023-11-21T21:28:14.091Z",
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 0,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 0,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc::launch-wizard-2",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 22,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 22,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc::launch-wizard-2",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 443,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 443,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc::launch-wizard-2",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 80,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc::launch-wizard-2",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 9000,
      IpProtocol: "tcp",
      ToPort: 9000,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc::launch-wizard-2",
      securityGroupFrom: ["sg::vpc::default"],
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `subnet-public1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/24",
      DnsHostnames: true,
    }),
  },
  {
    type: "Cluster",
    group: "ECS",
    properties: ({}) => ({
      clusterName: "cluster-console-demo",
      capacityProviders: ["FARGATE", "FARGATE_SPOT"],
    }),
  },
  {
    type: "TaskDefinition",
    group: "ECS",
    properties: ({ config }) => ({
      containerDefinitions: [
        {
          cpu: 0,
          essential: true,
          image: "public.ecr.aws/a4o9b2p8/grucloud/grucloud-cli:13.0.4",
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-create-group": "true",
              "awslogs-group": "/ecs/grucloud-cli",
              "awslogs-region": `${config.region}`,
              "awslogs-stream-prefix": "ecs",
            },
          },
          memory: 2048,
          name: "grucloud-cli",
          portMappings: [],
        },
      ],
      cpu: "1024",
      family: "grucloud-cli",
      memory: "2048",
      networkMode: "awsvpc",
      requiresCompatibilities: ["FARGATE"],
      runtimePlatform: {
        cpuArchitecture: "ARM64",
        operatingSystemFamily: "LINUX",
      },
    }),
    dependencies: ({}) => ({
      taskRole: "ecsTaskS3",
      executionRole: "ecsTaskExecutionRole",
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "role-ec2-s3",
    dependencies: ({}) => ({
      roles: ["role-ec2-s3"],
    }),
  },
  {
    type: "OpenIDConnectProvider",
    group: "IAM",
    properties: ({}) => ({
      ClientIDList: ["aws.workload.identity"],
      Url: "demo.grucloud.com",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "ecsTaskExecutionRole",
      AssumeRolePolicyDocument: {
        Version: "2008-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "ecs-tasks.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
          PolicyName: "AmazonECSTaskExecutionRolePolicy",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "ecsTaskS3",
      Description: "Allows ECS tasks to call AWS services on your behalf.",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "ecs-tasks.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn: "arn:aws:iam::aws:policy/AmazonS3FullAccess",
          PolicyName: "AmazonS3FullAccess",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "role-ec2-s3",
      Description: "Allows EC2 instances to call AWS services on your behalf.",
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
      AttachedPolicies: [
        {
          PolicyArn: "arn:aws:iam::aws:policy/AmazonS3FullAccess",
          PolicyName: "AmazonS3FullAccess",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ getId }) => ({
      RoleName: "role-grucloud",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: `${getId({
                type: "OpenIDConnectProvider",
                group: "IAM",
                name: "oidp::demo.grucloud.com",
              })}`,
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                [`${getId({
                  type: "OpenIDConnectProvider",
                  group: "IAM",
                  name: "oidp::demo.grucloud.com",
                  path: "live.Url",
                })}:aud`]: "aws.workload.identity",
              },
              StringLike: {
                [`${getId({
                  type: "OpenIDConnectProvider",
                  group: "IAM",
                  name: "oidp::demo.grucloud.com",
                  path: "live.Url",
                })}:sub`]: "organization:my-org:*",
              },
            },
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
          PolicyName: "AdministratorAccess",
        },
      ],
    }),
    dependencies: ({}) => ({
      openIdConnectProvider: "oidp::demo.grucloud.com",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "grucloud-console-demo",
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET"],
            AllowedOrigins: ["*"],
            ExposeHeaders: [
              "x-amz-server-side-encryption",
              "x-amz-request-id",
              "x-amz-id-2",
            ],
            MaxAgeSeconds: 3000,
          },
        ],
      },
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
            BucketKeyEnabled: true,
          },
        ],
      },
    }),
  },
];
