// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "my-table",
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
      BillingMode: "PAY_PER_REQUEST",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-MyStateMachineExecutionRole-ZVCE4J344HAN",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `states.${config.region}.amazonaws.com`,
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
                Action: ["dynamodb:PutItem", "dynamodb:GetItem"],
                Resource: `arn:aws:dynamodb:${
                  config.region
                }:${config.accountId()}:table/my-table`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "DDBPolicy",
        },
      ],
    }),
    dependencies: ({}) => ({
      table: "my-table",
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({}) => ({
      definition: {
        StartAt: "SendToDDB",
        States: {
          ReadFromDDB: {
            End: true,
            OutputPath: "$.output_from_ddb_get.Item",
            Parameters: {
              Key: {
                "id.$": "$.id",
              },
              TableName: "my-table",
            },
            Resource: "arn:aws:states:::dynamodb:getItem",
            ResultPath: "$.output_from_ddb_get",
            Type: "Task",
          },
          SendToDDB: {
            Next: "ReadFromDDB",
            Parameters: {
              Item: {
                "description.$": "States.Format('Hello, my id is {}.', $.id)",
                "id.$": "$.id",
              },
              TableName: "my-table",
            },
            Resource: "arn:aws:states:::dynamodb:putItem",
            ResultPath: "$.output_from_ddb_put",
            Type: "Task",
          },
        },
      },
      name: "StateMachinetoDDB-OZxx41bNDei3",
      tags: [
        {
          key: "stateMachine:createdBy",
          value: "SAM",
        },
      ],
    }),
    dependencies: ({}) => ({
      role: "sam-app-MyStateMachineExecutionRole-ZVCE4J344HAN",
    }),
  },
];
