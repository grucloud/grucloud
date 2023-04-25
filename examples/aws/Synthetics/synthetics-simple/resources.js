// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "CloudWatchSyntheticsPolicy-my-canary-874-b96ae8dcb649",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["s3:PutObject", "s3:GetObject"],
            Resource: [
              `arn:aws:s3:::cw-syn-results-${config.accountId()}-${
                config.region
              }/canary/${config.region}/my-canary-874-b96ae8dcb649/*`,
            ],
          },
          {
            Effect: "Allow",
            Action: ["s3:GetBucketLocation"],
            Resource: [
              `arn:aws:s3:::cw-syn-results-${config.accountId()}-${
                config.region
              }`,
            ],
          },
          {
            Effect: "Allow",
            Action: [
              "logs:CreateLogStream",
              "logs:PutLogEvents",
              "logs:CreateLogGroup",
            ],
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/lambda/cwsyn-my-canary-*`,
            ],
          },
          {
            Effect: "Allow",
            Action: ["s3:ListAllMyBuckets", "xray:PutTraceSegments"],
            Resource: ["*"],
          },
          {
            Effect: "Allow",
            Resource: "*",
            Action: "cloudwatch:PutMetricData",
            Condition: {
              StringEquals: {
                "cloudwatch:namespace": "CloudWatchSynthetics",
              },
            },
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "CloudWatchSyntheticsRole-my-canary-874-b96ae8dcb649",
      Description:
        "CloudWatch Synthetics lambda execution role for running canaries",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["CloudWatchSyntheticsPolicy-my-canary-874-b96ae8dcb649"],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ getId }) => ({
      Configuration: {
        FunctionName: "cwsyn-my-canary-2bf3df82-6b6a-4cf0-983a-b489fc267051",
        Runtime: "nodejs14.x",
        Layers: [
          "arn:aws:lambda:us-east-1:378653112637:layer:Synthetics:30",
          `${getId({
            type: "Layer",
            group: "Lambda",
            name: "cwsyn-my-canary-2bf3df82-6b6a-4cf0-983a-b489fc267051",
            path: "live.LayerVersionArn",
          })}`,
        ],
        MemorySize: 1000,
        Timeout: 300,
        Handler: "index.handler",
      },
    }),
    dependencies: ({}) => ({
      layers: ["cwsyn-my-canary-2bf3df82-6b6a-4cf0-983a-b489fc267051"],
      role: "CloudWatchSyntheticsRole-my-canary-874-b96ae8dcb649",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ getId }) => ({
      Configuration: {
        FunctionName: "cwsyn-my-canary-459b7673-e931-481d-95bd-b4a5bd0bec0e",
        Runtime: "nodejs14.x",
        Layers: [
          "arn:aws:lambda:us-east-1:378653112637:layer:Synthetics:30",
          `${getId({
            type: "Layer",
            group: "Lambda",
            name: "cwsyn-my-canary-459b7673-e931-481d-95bd-b4a5bd0bec0e",
            path: "live.LayerVersionArn",
          })}`,
        ],
        MemorySize: 1000,
        Timeout: 300,
        Handler: "index.handler",
      },
    }),
    dependencies: ({}) => ({
      layers: ["cwsyn-my-canary-459b7673-e931-481d-95bd-b4a5bd0bec0e"],
      role: "CloudWatchSyntheticsRole-my-canary-874-b96ae8dcb649",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ getId }) => ({
      Configuration: {
        FunctionName: "cwsyn-my-canary-71c68c24-99bd-4cfb-aa97-7f5a86896f75",
        Runtime: "nodejs14.x",
        Layers: [
          "arn:aws:lambda:us-east-1:378653112637:layer:Synthetics:30",
          `${getId({
            type: "Layer",
            group: "Lambda",
            name: "cwsyn-my-canary-71c68c24-99bd-4cfb-aa97-7f5a86896f75",
            path: "live.LayerVersionArn",
          })}`,
        ],
        MemorySize: 1000,
        Timeout: 300,
        Handler: "index.handler",
      },
    }),
    dependencies: ({}) => ({
      layers: ["cwsyn-my-canary-71c68c24-99bd-4cfb-aa97-7f5a86896f75"],
      role: "CloudWatchSyntheticsRole-my-canary-874-b96ae8dcb649",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ getId }) => ({
      Configuration: {
        FunctionName: "cwsyn-my-canary-cbebc4a6-705d-4ee5-aa6c-3eb7823363f3",
        Runtime: "nodejs14.x",
        Layers: [
          "arn:aws:lambda:us-east-1:378653112637:layer:Synthetics:30",
          `${getId({
            type: "Layer",
            group: "Lambda",
            name: "cwsyn-my-canary-cbebc4a6-705d-4ee5-aa6c-3eb7823363f3",
            path: "live.LayerVersionArn",
          })}`,
        ],
        MemorySize: 1000,
        Timeout: 300,
        Handler: "index.handler",
      },
    }),
    dependencies: ({}) => ({
      layers: ["cwsyn-my-canary-cbebc4a6-705d-4ee5-aa6c-3eb7823363f3"],
      role: "CloudWatchSyntheticsRole-my-canary-874-b96ae8dcb649",
    }),
  },
  {
    type: "Layer",
    group: "Lambda",
    properties: ({}) => ({
      LayerName: "cwsyn-my-canary-2bf3df82-6b6a-4cf0-983a-b489fc267051",
      Description:
        "Created by CloudWatch Synthetics for a wonderful customer. Thank you!",
      CompatibleRuntimes: ["nodejs14.x"],
    }),
  },
  {
    type: "Layer",
    group: "Lambda",
    properties: ({}) => ({
      LayerName: "cwsyn-my-canary-351357ed-53be-4586-b1b3-e83dda2a8f15",
      Description:
        "Created by CloudWatch Synthetics for a wonderful customer. Thank you!",
      CompatibleRuntimes: ["nodejs14.x"],
    }),
  },
  {
    type: "Layer",
    group: "Lambda",
    properties: ({}) => ({
      LayerName: "cwsyn-my-canary-459b7673-e931-481d-95bd-b4a5bd0bec0e",
      Description:
        "Created by CloudWatch Synthetics for a wonderful customer. Thank you!",
      CompatibleRuntimes: ["nodejs14.x"],
    }),
  },
  {
    type: "Layer",
    group: "Lambda",
    properties: ({}) => ({
      LayerName: "cwsyn-my-canary-71c68c24-99bd-4cfb-aa97-7f5a86896f75",
      Description:
        "Created by CloudWatch Synthetics for a wonderful customer. Thank you!",
      CompatibleRuntimes: ["nodejs14.x"],
    }),
  },
  {
    type: "Layer",
    group: "Lambda",
    properties: ({}) => ({
      LayerName: "cwsyn-my-canary-cbebc4a6-705d-4ee5-aa6c-3eb7823363f3",
      Description:
        "Created by CloudWatch Synthetics for a wonderful customer. Thank you!",
      CompatibleRuntimes: ["nodejs14.x"],
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: `cw-syn-results-${config.accountId()}-${config.region}`,
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "aws:kms",
            },
          },
        ],
      },
    }),
  },
  {
    type: "Canary",
    group: "Synthetics",
    properties: ({ config }) => ({
      ArtifactS3Location: `s3://cw-syn-results-${config.accountId()}-${
        config.region
      }/canary/${config.region}/my-canary-874-b96ae8dcb649`,
      Code: {
        Handler: "pageLoadBlueprint.handler",
      },
      FailureRetentionPeriodInDays: 31,
      Name: "my-canary",
      RunConfig: {
        ActiveTracing: false,
        MemoryInMB: 1000,
        TimeoutInSeconds: 300,
      },
      RuntimeVersion: "syn-nodejs-puppeteer-3.9",
      Schedule: {
        DurationInSeconds: 0,
        Expression: "rate(5 minutes)",
      },
      SuccessRetentionPeriodInDays: 31,
      Tags: {
        blueprint: "heartbeat",
      },
    }),
    dependencies: ({}) => ({
      iamRole: "CloudWatchSyntheticsRole-my-canary-874-b96ae8dcb649",
      lambdaFunction: "cwsyn-my-canary-71c68c24-99bd-4cfb-aa97-7f5a86896f75",
      lambdaLayer: "cwsyn-my-canary-71c68c24-99bd-4cfb-aa97-7f5a86896f75",
    }),
  },
];
