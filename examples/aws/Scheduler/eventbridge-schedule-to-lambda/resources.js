// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-MyFirstScheduleRole-A76X8CY1CMB7",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "scheduler.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["lambda:InvokeFunction"],
                Resource: [
                  `arn:aws:lambda:${
                    config.region
                  }:${config.accountId()}:function:sam-app-ScheduledLambdaFunction-yYv0pABTDhLS`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "MyFirstScheduleRolePolicy",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-ScheduledLambdaFunctionRole-4JYXF2YKLM8V",
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
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-ScheduledLambdaFunction-yYv0pABTDhLS",
        Runtime: "nodejs16.x",
        Handler: "app.lambdaHandler",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-ScheduledLambdaFunctionRole-4JYXF2YKLM8V",
    }),
  },
  {
    type: "Schedule",
    group: "Scheduler",
    properties: ({ config }) => ({
      FlexibleTimeWindow: {
        Mode: "OFF",
      },
      GroupName: "default",
      Name: "MySchedule",
      ScheduleExpression: "rate(5 minute)",
      ScheduleExpressionTimezone: "UTC",
      Target: {
        Arn: `arn:aws:lambda:${
          config.region
        }:${config.accountId()}:function:sam-app-ScheduledLambdaFunction-yYv0pABTDhLS`,
        RetryPolicy: {
          MaximumEventAgeInSeconds: 86400,
          MaximumRetryAttempts: 185,
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "sam-app-MyFirstScheduleRole-A76X8CY1CMB7",
      lambdaFunction: "sam-app-ScheduledLambdaFunction-yYv0pABTDhLS",
    }),
  },
];
