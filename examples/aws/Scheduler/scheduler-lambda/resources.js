// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "Amazon_EventBridge_Scheduler_LAMBDA_d6db1d2ad4",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "scheduler.amazonaws.com",
            },
            Action: "sts:AssumeRole",
            Condition: {
              StringEquals: {
                "aws:SourceAccount": `${config.accountId()}`,
                "aws:SourceArn": `arn:aws:scheduler:${
                  config.region
                }:${config.accountId()}:schedule/default/scheduleLambda`,
              },
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: [
        "Amazon-EventBridge-Scheduler-Execution-Policy-3a54c973-3820-47e3-a9f5-01148ae3aa27",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "mylambda-role-9ogx9vwe",
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
      policies: [
        "AWSLambdaBasicExecutionRole-2c60bc7b-a716-4df4-8688-f7237aa45ae7",
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName:
        "Amazon-EventBridge-Scheduler-Execution-Policy-3a54c973-3820-47e3-a9f5-01148ae3aa27",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["lambda:InvokeFunction"],
            Resource: [
              `arn:aws:lambda:${
                config.region
              }:${config.accountId()}:function:mylambda:*`,
              `arn:aws:lambda:${
                config.region
              }:${config.accountId()}:function:mylambda`,
            ],
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName:
        "AWSLambdaBasicExecutionRole-2c60bc7b-a716-4df4-8688-f7237aa45ae7",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "logs:CreateLogGroup",
            Resource: `arn:aws:logs:${config.region}:${config.accountId()}:*`,
          },
          {
            Effect: "Allow",
            Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/lambda/mylambda:*`,
            ],
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "mylambda",
        Handler: "index.handler",
        Runtime: "nodejs16.x",
      },
    }),
    dependencies: ({}) => ({
      role: "mylambda-role-9ogx9vwe",
    }),
  },
  {
    type: "Schedule",
    group: "Scheduler",
    properties: ({ config }) => ({
      Description: "",
      FlexibleTimeWindow: {
        MaximumWindowInMinutes: 15,
        Mode: "FLEXIBLE",
      },
      GroupName: "default",
      Name: "scheduleLambda",
      ScheduleExpression: "rate(1 hours)",
      ScheduleExpressionTimezone: "America/Fortaleza",
      Target: {
        Arn: `arn:aws:lambda:${
          config.region
        }:${config.accountId()}:function:mylambda`,
        Input: "{}",
        RetryPolicy: {
          MaximumEventAgeInSeconds: 86400,
          MaximumRetryAttempts: 185,
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "Amazon_EventBridge_Scheduler_LAMBDA_d6db1d2ad4",
      lambdaFunction: "mylambda",
    }),
  },
];
