// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "stepfunctions/StateMachine",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "sam-app-orders",
      AttributeDefinitions: [
        {
          AttributeName: "Id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "Id",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ getId }) => ({
      RoleName: "sam-app-EnrichmentStateMachineRole-VHHJR3QAFHSP",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "states.amazonaws.com",
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
                Action: ["cloudwatch:*", "logs:*"],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "CloudWatchLogs",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "dynamodb:GetItem",
                  "dynamodb:Scan",
                  "dynamodb:Query",
                  "dynamodb:BatchGetItem",
                  "dynamodb:DescribeTable",
                ],
                Resource: `${getId({
                  type: "Table",
                  group: "DynamoDB",
                  name: "sam-app-orders",
                })}`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "DynamoDBWrite",
        },
      ],
    }),
    dependencies: ({}) => ({
      table: "sam-app-orders",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config, getId }) => ({
      RoleName: "sam-app-PipeRole-HY6EHVTRSCJE",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "pipes.amazonaws.com",
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
                Action: ["states:StartExecution", "states:StartSyncExecution"],
                Resource: `${getId({
                  type: "StateMachine",
                  group: "StepFunctions",
                  name: "EnrichmentStateMachine-qfZFOX1lZ2S6",
                })}`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "EnrichmentPolicy",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "sqs:ReceiveMessage",
                  "sqs:DeleteMessage",
                  "sqs:GetQueueAttributes",
                ],
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:sam-app-source-queue`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "SourcePolicy",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["lambda:InvokeFunction"],
                Resource: `arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:sam-app-target-lambda`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "TargetPolicy",
        },
      ],
    }),
    dependencies: ({}) => ({
      queue: "sam-app-source-queue",
      stateMachines: ["EnrichmentStateMachine-qfZFOX1lZ2S6"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-TargetRole-J97H5E26J5AT",
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
      Tags: [
        {
          Key: "lambda:createdBy",
          Value: "SAM",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-target-lambda",
        Handler: "index.handler",
        Runtime: "nodejs16.x",
        Timeout: 15,
      },
      Tags: {
        "lambda:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-TargetRole-J97H5E26J5AT",
    }),
  },
  {
    type: "Pipe",
    group: "Pipes",
    properties: ({}) => ({
      Description:
        "Pipe that connects SQS to Lambda with Enrichment from Step Functions",
      Name: "sam-app-sqs-lambda",
      SourceParameters: {
        SqsQueueParameters: {
          BatchSize: 1,
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "sam-app-PipeRole-HY6EHVTRSCJE",
      sourceSQSQueue: "sam-app-source-queue",
      enrichmentStepFunctionsStateMachine:
        "EnrichmentStateMachine-qfZFOX1lZ2S6",
      targetLambdaFunction: "sam-app-target-lambda",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-source-queue",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-SourceQueueDLQ-yjrSLFwMCnw1",
    }),
  },
  {
    type: "QueueRedrivePolicy",
    group: "SQS",
    properties: ({}) => ({
      Attributes: {
        RedrivePolicy: {
          maxReceiveCount: 5,
        },
      },
    }),
    dependencies: ({}) => ({
      sqsQueue: "sam-app-source-queue",
      sqsDeadLetterQueue: "sam-app-SourceQueueDLQ-yjrSLFwMCnw1",
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({ getId }) => ({
      definition: {
        Comment: "A description of my state machine",
        StartAt: "Transform SQS message into JSON",
        States: {
          "Transform SQS message into JSON": {
            Type: "Pass",
            Next: "Get Order from DB",
            Parameters: {
              "data.$": "States.StringToJson($.[0].body)",
            },
          },
          "Get Order from DB": {
            Type: "Task",
            Resource: "arn:aws:states:::dynamodb:getItem",
            Parameters: {
              TableName: "sam-app-orders",
              Key: {
                Id: {
                  "S.$": "$.data.order_id",
                },
              },
            },
            Next: "Verify item",
          },
          "Verify item": {
            Type: "Choice",
            Choices: [
              {
                Variable: "$.Item",
                IsPresent: true,
                Comment: "Item Found",
                Next: "Format result for target",
              },
            ],
            Default: "Nothing returned",
            Comment: "Item not found",
          },
          "Format result for target": {
            Type: "Pass",
            End: true,
            Parameters: [
              {
                "Item.$": "$.Item",
              },
            ],
          },
          "Nothing returned": {
            Type: "Pass",
            End: true,
            Result: [],
            Comment: "Not found",
          },
        },
      },
      loggingConfiguration: {
        destinations: [
          {
            cloudWatchLogsLogGroup: {
              logGroupArn: `${getId({
                type: "LogGroup",
                group: "CloudWatchLogs",
                name: "stepfunctions/StateMachine",
              })}:*`,
            },
          },
        ],
        includeExecutionData: true,
        level: "ALL",
      },
      name: "EnrichmentStateMachine-qfZFOX1lZ2S6",
      type: "EXPRESS",
      tags: [
        {
          key: "stateMachine:createdBy",
          value: "SAM",
        },
      ],
    }),
    dependencies: ({}) => ({
      role: "sam-app-EnrichmentStateMachineRole-VHHJR3QAFHSP",
      logGroups: ["stepfunctions/StateMachine"],
    }),
  },
];
