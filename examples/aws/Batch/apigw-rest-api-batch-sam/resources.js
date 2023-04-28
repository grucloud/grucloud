// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      name: "sam-app-api",
      schema: {
        openapi: "3.0.1",
        info: {
          title: "sam-app-api",
          version: "1",
        },
        paths: {
          "/": {
            post: {
              responses: {
                200: {
                  description: "200 response",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Empty",
                      },
                    },
                  },
                },
                403: {
                  description: "403 response",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Error",
                      },
                    },
                  },
                },
              },
              "x-amazon-apigateway-integration": {
                credentials: `arn:aws:iam::${config.accountId()}:role/sam-app/sam-app-ApiGatewayBatchRole-WWSNJKBXNX4`,
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_TEMPLATES",
                requestTemplates: {
                  "application/json": `#set($inputRoot = $input.path('$')) 
  {
    "jobName": "$inputRoot.jobName",
    "jobQueue": "$inputRoot.jobQueue",
    "jobDefinition": "$inputRoot.jobDefinition"
  }
`,
                },
                type: "AWS",
                uri: `arn:aws:apigateway:${config.region}:batch:path//v1/submitjob`,
                responses: {
                  default: {
                    responseTemplates: {
                      "application/json": `{
"message": "Successfully submitted the batch job"
}`,
                    },
                    statusCode: "200",
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            Empty: {
              title: "Empty Schema",
              type: "object",
            },
            Error: {
              title: "Error Schema",
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      deployment: {
        stageName: "dev",
      },
    }),
    dependencies: ({}) => ({
      roles: ["sam-app-ApiGatewayBatchRole-WWSNJKBXNX4"],
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "dev",
    }),
    dependencies: ({}) => ({
      restApi: "sam-app-api",
    }),
  },
  {
    type: "ComputeEnvironment",
    group: "Batch",
    properties: ({ config }) => ({
      computeEnvironmentName: "ComputeEnvironment-YTEATQ99CNmz8gKV",
      computeResources: {
        desiredvCpus: 0,
        ec2Configuration: [
          {
            imageType: "ECS_AL2",
          },
        ],
        instanceTypes: ["optimal"],
        maxvCpus: 64,
        minvCpus: 0,
        type: "EC2",
      },
      containerOrchestrationType: "ECS",
      serviceRole: `arn:aws:iam::${config.accountId()}:role/sam-app-BatchServiceRole-1NEHP2HZWO2GS`,
      type: "MANAGED",
    }),
    dependencies: ({}) => ({
      instanceProfile: "sam-app-IamInstanceProfile-d8ccX1kbQaec",
      securityGroups: ["sg::VPC::sam-app-SecurityGroup-OFCM27BWEM7Q"],
      serviceRole: "sam-app-BatchServiceRole-1NEHP2HZWO2GS",
      subnets: ["VPC::Subnet"],
    }),
  },
  {
    type: "JobQueue",
    group: "Batch",
    properties: ({ getId }) => ({
      computeEnvironmentOrder: [
        {
          computeEnvironment: `${getId({
            type: "ComputeEnvironment",
            group: "Batch",
            name: "ComputeEnvironment-YTEATQ99CNmz8gKV",
          })}`,
          order: 1,
        },
      ],
      jobQueueName: "JobQueue-p4uddGWyAniwvr9o",
      priority: 1,
    }),
    dependencies: ({}) => ({
      computeEnvironments: ["ComputeEnvironment-YTEATQ99CNmz8gKV"],
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "InternetGateway" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "VPC",
      internetGateway: "InternetGateway",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "InternetGateway",
      routeTable: "VPC::RouteTable",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "RouteTable",
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "VPC::RouteTable",
      subnet: "VPC::Subnet",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "sam-app-SecurityGroup-OFCM27BWEM7Q",
      Description:
        "EC2 Security Group for instances launched in the VPC by Batch",
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "Subnet",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}e`,
      MapPublicIpOnLaunch: true,
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "VPC",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "sam-app-IamInstanceProfile-d8ccX1kbQaec",
    dependencies: ({}) => ({
      roles: ["sam-app-EcsInstanceRole-1HOBBJD9ZPIRW"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-ApiGatewayBatchRole-WWSNJKBXNX4",
      Path: "/sam-app/",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
            },
            Sid: "AllowApiGatewayServiceToAssumeRole",
          },
        ],
        Version: "2012-10-17",
      },
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: ["batch:SubmitJob"],
                Effect: "Allow",
                Resource: [
                  `arn:aws:batch:${
                    config.region
                  }:${config.accountId()}:job-queue/JobQueue-p4uddGWyAniwvr9o`,
                  `arn:aws:batch:${
                    config.region
                  }:${config.accountId()}:job-definition/JobDefinition-7bde177a2de1a66`,
                ],
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "AWSBatchSubmitJob",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-BatchServiceRole-1NEHP2HZWO2GS",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "batch.amazonaws.com",
            },
          },
        ],
        Version: "2012-10-17",
      },
      AttachedPolicies: [
        {
          PolicyArn: "arn:aws:iam::aws:policy/service-role/AWSBatchServiceRole",
          PolicyName: "AWSBatchServiceRole",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-EcsInstanceRole-1HOBBJD9ZPIRW",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Sid: "",
          },
        ],
        Version: "2008-10-17",
      },
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",
          PolicyName: "AmazonEC2ContainerServiceforEC2Role",
        },
      ],
    }),
  },
];
