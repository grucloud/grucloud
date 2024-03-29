// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      EventPattern: {
        source: ["aws.s3"],
      },
      Name: "sam-app-MyFunctionTrigger-4TOBV7BERNJE",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "MyFunctionTriggerLambdaTarget",
    }),
    dependencies: ({}) => ({
      rule: "sam-app-MyFunctionTrigger-4TOBV7BERNJE",
      lambdaFunction: "sam-app-MyFunction-d0RdgPN8djZ9",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-MyFunctionRole-Y342C99LHAR4",
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
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  "s3:GetObject",
                  "s3:ListBucket",
                  "s3:GetBucketLocation",
                  "s3:GetObjectVersion",
                  "s3:GetLifecycleConfiguration",
                ],
                Resource: [
                  "arn:aws:s3:::sam-app-sourcebucket-16jz3ieh0d3d7",
                  "arn:aws:s3:::sam-app-sourcebucket-16jz3ieh0d3d7/*",
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "MyFunctionRolePolicy0",
        },
      ],
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
          PolicyName: "AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-MyFunction-d0RdgPN8djZ9",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-MyFunctionRole-Y342C99LHAR4",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ config }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-MyFunction-d0RdgPN8djZ9",
          Principal: "events.amazonaws.com",
          SourceArn: `arn:aws:events:${
            config.region
          }:${config.accountId()}:rule/sam-app-MyFunctionTrigger-4TOBV7BERNJE`,
          StatementId: "sam-app-MyFunctionTriggerPermission-1OZKJ0UDFJU4B",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-MyFunction-d0RdgPN8djZ9",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "sam-app-sourcebucket-16jz3ieh0d3d7",
      NotificationConfiguration: {
        EventBridgeConfiguration: {},
      },
      Policy: {
        Version: "2008-10-17",
        Statement: [
          {
            Effect: "Deny",
            Principal: "*",
            Action: "s3:*",
            Resource: [
              "arn:aws:s3:::sam-app-sourcebucket-16jz3ieh0d3d7/*",
              "arn:aws:s3:::sam-app-sourcebucket-16jz3ieh0d3d7",
            ],
            Condition: {
              Bool: {
                "aws:SecureTransport": "false",
              },
            },
          },
        ],
      },
    }),
  },
];
