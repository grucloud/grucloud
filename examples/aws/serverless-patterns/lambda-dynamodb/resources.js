// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "sam-app-DynamoTable-1TM3ILOZ1A36J",
      AttributeDefinitions: [
        {
          AttributeName: "ID",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "ID",
          KeyType: "HASH",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ getId }) => ({
      RoleName: "sam-app-LambdaPutDynamoDBRole-1JME1YWZ5JTDV",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `lambda.amazonaws.com`,
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
                  "dynamodb:PutItem",
                  "dynamodb:UpdateItem",
                  "dynamodb:BatchWriteItem",
                ],
                Resource: [
                  `${getId({
                    type: "Table",
                    group: "DynamoDB",
                    name: "sam-app-DynamoTable-1TM3ILOZ1A36J",
                  })}`,
                  `${getId({
                    type: "Table",
                    group: "DynamoDB",
                    name: "sam-app-DynamoTable-1TM3ILOZ1A36J",
                  })}/index/*`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "LambdaPutDynamoDBRolePolicy0",
        },
      ],
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
    dependencies: ({}) => ({
      table: "sam-app-DynamoTable-1TM3ILOZ1A36J",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            DatabaseTable: `sam-app-DynamoTable-1TM3ILOZ1A36J`,
          },
        },
        FunctionName: "sam-app-LambdaPutDynamoDB-sV19pC5rYHdK",
        Handler: "app.handler",
        Runtime: "nodejs12.x",
      },
      Tags: {
        "lambda:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-LambdaPutDynamoDBRole-1JME1YWZ5JTDV",
      dynamoDbTables: ["sam-app-DynamoTable-1TM3ILOZ1A36J"],
    }),
  },
];
