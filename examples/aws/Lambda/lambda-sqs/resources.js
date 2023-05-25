// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-QueuePublisherFunctionRole-144E5ZEVAZOKL",
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
                Action: ["sqs:SendMessage*"],
                Effect: "Allow",
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:sam-app-MySqsQueue-pJgAHKB84btk`,
              },
            ],
          },
          PolicyName: "QueuePublisherFunctionRolePolicy0",
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
    properties: ({ config }) => ({
      Configuration: {
        Environment: {
          Variables: {
            SQSqueueName: `https://sqs.${
              config.region
            }.amazonaws.com/${config.accountId()}/sam-app-MySqsQueue-pJgAHKB84btk`,
          },
        },
        FunctionName: "sam-app-QueuePublisherFunction-3oAO6gZ7WBN5",
        Handler: "app.handler",
        Runtime: "nodejs12.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-QueuePublisherFunctionRole-144E5ZEVAZOKL",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-MySqsQueue-pJgAHKB84btk",
    }),
  },
];