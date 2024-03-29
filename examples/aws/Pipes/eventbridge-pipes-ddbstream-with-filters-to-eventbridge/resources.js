// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "EventBus",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Name: "sam-app-bus",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "sam-app-orders",
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      StreamSpecification: {
        StreamEnabled: true,
        StreamViewType: "NEW_AND_OLD_IMAGES",
      },
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config, getId }) => ({
      RoleName: "sam-app-PipeRole-19SXRFUEF1TVT",
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
            Statement: [
              {
                Action: [
                  "dynamodb:DescribeStream",
                  "dynamodb:GetRecords",
                  "dynamodb:GetShardIterator",
                  "dynamodb:ListStreams",
                ],
                Effect: "Allow",
                Resource: `${getId({
                  type: "Table",
                  group: "DynamoDB",
                  name: "sam-app-orders",
                  path: "live.LatestStreamArn",
                })}`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "sam-app-source-policy",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: ["events:PutEvents"],
                Effect: "Allow",
                Resource: `arn:aws:events:${
                  config.region
                }:${config.accountId()}:event-bus/sam-app-bus`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "sam-app-target-policy",
        },
      ],
    }),
    dependencies: ({}) => ({
      dynamoDbTables: ["sam-app-orders"],
    }),
  },
  {
    type: "Pipe",
    group: "Pipes",
    properties: ({ config }) => ({
      Description:
        "Pipes to connect to DDB stream listening only for insert changes",
      Name: "sam-app-order-created",
      SourceParameters: {
        DynamoDBStreamParameters: {
          BatchSize: 1,
          DeadLetterConfig: {
            Arn: `arn:aws:sqs:${
              config.region
            }:${config.accountId()}:sam-app-pipe-dlq`,
          },
          StartingPosition: "LATEST",
        },
        FilterCriteria: {
          Filters: [
            {
              Pattern: {
                eventName: ["INSERT"],
              },
            },
          ],
        },
      },
      TargetParameters: {
        EventBridgeEventBusParameters: {
          DetailType: "OrderCreated",
          Source: "myapp.orders",
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "sam-app-PipeRole-19SXRFUEF1TVT",
      sourceDynamoDB: "sam-app-orders",
      sqsQueueDeadLetter: "sam-app-pipe-dlq",
      targetCloudWatchEventsEventBus: "sam-app-bus",
    }),
  },
  {
    type: "Pipe",
    group: "Pipes",
    properties: ({ config }) => ({
      Description:
        "Pipes to connect to DDB stream listening only for modify changes",
      Name: "sam-app-order-updated",
      SourceParameters: {
        DynamoDBStreamParameters: {
          BatchSize: 1,
          DeadLetterConfig: {
            Arn: `arn:aws:sqs:${
              config.region
            }:${config.accountId()}:sam-app-pipe-dlq`,
          },
          StartingPosition: "LATEST",
        },
        FilterCriteria: {
          Filters: [
            {
              Pattern: {
                eventName: ["MODIFY"],
              },
            },
          ],
        },
      },
      TargetParameters: {
        EventBridgeEventBusParameters: {
          DetailType: "OrderUpdated",
          Source: "myapp.orders",
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "sam-app-PipeRole-19SXRFUEF1TVT",
      sourceDynamoDB: "sam-app-orders",
      sqsQueueDeadLetter: "sam-app-pipe-dlq",
      targetCloudWatchEventsEventBus: "sam-app-bus",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-pipe-dlq",
    }),
  },
];
