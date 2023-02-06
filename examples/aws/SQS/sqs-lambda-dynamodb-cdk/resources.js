// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "CLIENT",
      AttributeDefinitions: [
        {
          AttributeName: "CLIENT-KEY",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "CLIENT-KEY",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "vsam-to-dynamo-SQSToDynamoFunctionServiceRole574AE-1UJ4RMVYBA5KC",
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
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "dynamodb:BatchWriteItem",
                  "dynamodb:PutItem",
                  "dynamodb:UpdateItem",
                  "dynamodb:DeleteItem",
                ],
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/CLIENT`,
                ],
                Effect: "Allow",
              },
              {
                Action: [
                  "sqs:ReceiveMessage",
                  "sqs:ChangeMessageVisibility",
                  "sqs:GetQueueUrl",
                  "sqs:DeleteMessage",
                  "sqs:GetQueueAttributes",
                ],
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:VsamToDynamoQueue`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "SQSToDynamoFunctionServiceRoleDefaultPolicy5FF3E785",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
    }),
    dependencies: ({}) => ({
      table: "CLIENT",
    }),
  },
  {
    type: "EventSourceMapping",
    group: "Lambda",
    dependencies: ({}) => ({
      lambdaFunction: "vsam-to-dynamo-SQSToDynamoFunction17164FFE-9HwjnbSRjKQt",
      sqsQueue: "VsamToDynamoQueue",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "vsam-to-dynamo-SQSToDynamoFunction17164FFE-9HwjnbSRjKQt",
        Handler: "insertRecord.handler",
        Runtime: "python3.9",
      },
    }),
    dependencies: ({}) => ({
      role: "vsam-to-dynamo-SQSToDynamoFunctionServiceRole574AE-1UJ4RMVYBA5KC",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      Attributes: {
        VisibilityTimeout: "300",
      },
      QueueName: "VsamToDynamoQueue",
    }),
  },
];
