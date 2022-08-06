// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sqs_lambda_demo_functionrole",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
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
      policies: ["sqs-lambda-demo-lambdapolicy"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "sqs-lambda-demo-lambdapolicy",
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "sqs:ReceiveMessage",
              "sqs:DeleteMessage",
              "sqs:GetQueueAttributes",
            ],
            Effect: "Allow",
            Resource: `arn:aws:sqs:${
              config.region
            }:${config.accountId()}:sqs-lambda-demo`,
          },
          {
            Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
            Effect: "Allow",
            Resource: `arn:aws:logs:${
              config.region
            }:${config.accountId()}:log-group:/aws/lambda/sqs-lambda-demo-${config.accountId()}:*:*`,
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
      Description: "Policy for sqs to lambda demo",
    }),
    dependencies: ({}) => ({
      queue: "sqs-lambda-demo",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            POWERTOOLS_SERVICE_NAME: "sqs-lambda-demo",
          },
        },
        FunctionName: "sqs-lambda-demo",
        Handler: "app.lambda_handler",
        Runtime: "python3.9",
      },
    }),
    dependencies: ({}) => ({
      role: "sqs_lambda_demo_functionrole",
    }),
  },
  {
    type: "EventSourceMapping",
    group: "Lambda",
    properties: ({}) => ({
      BatchSize: 10,
      MaximumBatchingWindowInSeconds: 0,
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sqs-lambda-demo",
      sqsQueue: "sqs-lambda-demo",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sqs-lambda-demo",
    }),
  },
];
