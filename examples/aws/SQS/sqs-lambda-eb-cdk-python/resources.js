// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description: "Trigger Lambda function every 2 minutes",
      Name: "SqsLambdaEbCdkStack-Rule4C995B7F-27P7UGLVJOBT",
      ScheduleExpression: "rate(2 minutes)",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "Target0",
    }),
    dependencies: ({}) => ({
      rule: "SqsLambdaEbCdkStack-Rule4C995B7F-27P7UGLVJOBT",
      lambdaFunction:
        "SqsLambdaEbCdkStack-MyLambdaFunction67CCA873-0GgdD060fFho",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "SqsLambdaEbCdkStack-MyLambdaFunctionServiceRole313-1OXQE0IUIGND8",
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
                  "sqs:ReceiveMessage",
                  "sqs:ChangeMessageVisibility",
                  "sqs:GetQueueUrl",
                  "sqs:DeleteMessage",
                  "sqs:GetQueueAttributes",
                ],
                Effect: "Allow",
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:SqsLambdaEbCdkStack-MyQueueE6CA6235-ifxHSq6AozrT`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "MyLambdaFunctionServiceRoleDefaultPolicy23555F9E",
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
            QUEUE_URL: `https://sqs.${
              config.region
            }.amazonaws.com/${config.accountId()}/SqsLambdaEbCdkStack-MyQueueE6CA6235-ifxHSq6AozrT`,
          },
        },
        FunctionName:
          "SqsLambdaEbCdkStack-MyLambdaFunction67CCA873-0GgdD060fFho",
        Handler: "submit_job.handler",
        Runtime: "python3.9",
      },
    }),
    dependencies: ({}) => ({
      role: "SqsLambdaEbCdkStack-MyLambdaFunctionServiceRole313-1OXQE0IUIGND8",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ config }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName:
            "SqsLambdaEbCdkStack-MyLambdaFunction67CCA873-0GgdD060fFho",
          Principal: "events.amazonaws.com",
          SourceArn: `arn:aws:events:${
            config.region
          }:${config.accountId()}:rule/SqsLambdaEbCdkStack-Rule4C995B7F-27P7UGLVJOBT`,
          StatementId:
            "SqsLambdaEbCdkStack-RuleAllowEventRuleSqsLambdaEbCdkStackMyLambdaFunction4CED594BB88F9-KT4R213JJUMN",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction:
        "SqsLambdaEbCdkStack-MyLambdaFunction67CCA873-0GgdD060fFho",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      Attributes: {
        VisibilityTimeout: "300",
      },
      QueueName: "SqsLambdaEbCdkStack-MyQueueE6CA6235-ifxHSq6AozrT",
    }),
  },
];
