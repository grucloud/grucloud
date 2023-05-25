// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "sam-app-DynamoDBTable-1WVU6LKKNMND3",
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
    }),
  },
  {
    type: "KinesisStreamingDestination",
    group: "DynamoDB",
    dependencies: ({}) => ({
      table: "sam-app-DynamoDBTable-1WVU6LKKNMND3",
      kinesisStream: "sam-app-KinesisStream-i22fijDM7MAY",
    }),
  },
  {
    type: "Stream",
    group: "Kinesis",
    properties: ({}) => ({
      StreamName: "sam-app-KinesisStream-i22fijDM7MAY",
      ShardCount: 2,
    }),
  },
];