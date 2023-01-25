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
      TableName: "SampleTable",
      AttributeDefinitions: [
        {
          AttributeName: "PK",
          AttributeType: "S",
        },
        {
          AttributeName: "SK",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "PK",
          KeyType: "HASH",
        },
        {
          AttributeName: "SK",
          KeyType: "RANGE",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      StreamSpecification: {
        StreamEnabled: true,
        StreamViewType: "NEW_IMAGE",
      },
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-EnrichmentStateMachineRole-1CSLFSVO8ZHVT",
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
                Action: [
                  "logs:CreateLogDelivery",
                  "logs:GetLogDelivery",
                  "logs:UpdateLogDelivery",
                  "logs:DeleteLogDelivery",
                  "logs:ListLogDeliveries",
                  "logs:PutResourcePolicy",
                  "logs:DescribeResourcePolicies",
                  "logs:DescribeLogGroups",
                ],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "CloudWatchLogs",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config, getId }) => ({
      RoleName: "sam-app-PipeRole-3TWYQY17M651",
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
                  name: "EnrichmentStateMachine-uACOjGX6Zbhn",
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
                  "dynamodb:DescribeStream",
                  "dynamodb:GetRecords",
                  "dynamodb:GetShardIterator",
                  "dynamodb:ListStreams",
                ],
                Resource: `${getId({
                  type: "Table",
                  group: "DynamoDB",
                  name: "SampleTable",
                  path: "live.LatestStreamArn",
                })}`,
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
      table: "SampleTable",
      stateMachines: ["EnrichmentStateMachine-uACOjGX6Zbhn"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-TargetRole-PV9BQWKMZUCP",
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
        Architectures: ["arm64"],
        FunctionName: "sam-app-target-lambda",
        Handler: "lambda_function.lambda_handler",
        Runtime: "python3.9",
        Timeout: 15,
      },
      Tags: {
        "lambda:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-TargetRole-PV9BQWKMZUCP",
    }),
  },
  {
    type: "Pipe",
    group: "Pipes",
    properties: ({}) => ({
      Description:
        "Pipe to connect DynamoDB Stream to AWS Lambda with filtering and enrichment",
      EnrichmentParameters: {
        InputTemplate:
          '{ "PK": <$.dynamodb.NewImage.PK.S>, "SK": <$.dynamodb.NewImage.SK.S> }',
      },
      Name: "ddb-to-lambda-enrichment",
      SourceParameters: {
        DynamoDBStreamParameters: {
          BatchSize: 1,
          StartingPosition: "LATEST",
        },
        FilterCriteria: {
          Filters: [
            {
              Pattern: {
                eventName: ["INSERT"],
                dynamodb: {
                  NewImage: {
                    messageId: {
                      S: [
                        {
                          exists: true,
                        },
                      ],
                    },
                    PK: {
                      S: [
                        {
                          prefix: "Message#",
                        },
                      ],
                    },
                    SK: {
                      S: [
                        {
                          prefix: "Channel#",
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "sam-app-PipeRole-3TWYQY17M651",
      sourceDynamoDB: "SampleTable",
      enrichmentStepFunctionsStateMachine:
        "EnrichmentStateMachine-uACOjGX6Zbhn",
      targetLambdaFunction: "sam-app-target-lambda",
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({ getId }) => ({
      definition: {
        Comment: "A description of my state machine",
        StartAt: "Wait",
        States: {
          Wait: {
            Type: "Wait",
            Seconds: 30,
            Next: "Success",
          },
          Success: {
            Type: "Succeed",
            Comment: "This is working as expected",
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
      name: "EnrichmentStateMachine-uACOjGX6Zbhn",
      type: "EXPRESS",
      tags: [
        {
          key: "stateMachine:createdBy",
          value: "SAM",
        },
      ],
    }),
    dependencies: ({}) => ({
      role: "sam-app-EnrichmentStateMachineRole-1CSLFSVO8ZHVT",
      logGroups: ["stepfunctions/StateMachine"],
    }),
  },
];
