// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "An Amazon API Gateway WebSocket API and an AWS Lambda function.",
      Name: "sam-app",
      ProtocolType: "WEBSOCKET",
      RouteSelectionExpression: "$request.body.action",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      DefaultRouteSettings: {
        DataTraceEnabled: false,
        LoggingLevel: "OFF",
      },
      Description: "Prod Stage",
      StageName: "prod",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      Description: "OnConnect Integration",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PassthroughBehavior: "WHEN_NO_MATCH",
      PayloadFormatVersion: "1.0",
      RequestTemplates: {},
      TimeoutInMillis: 29000,
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      lambdaFunction: "sam-app-onconnect-function",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      Description: "OnDisconnect Integration",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PassthroughBehavior: "WHEN_NO_MATCH",
      PayloadFormatVersion: "1.0",
      RequestTemplates: {},
      TimeoutInMillis: 29000,
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      lambdaFunction: "sam-app-ondisconnect-function",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      Description: "Post Integration",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PassthroughBehavior: "WHEN_NO_MATCH",
      PayloadFormatVersion: "1.0",
      RequestTemplates: {},
      TimeoutInMillis: 29000,
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      lambdaFunction: "sam-app-post-function",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      OperationName: "OnConnectRoute",
      RouteKey: "$connect",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      integration: "integration::sam-app::sam-app-onconnect-function",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      OperationName: "OnDisconnectRoute",
      RouteKey: "$disconnect",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      integration: "integration::sam-app::sam-app-ondisconnect-function",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      OperationName: "PostRoute",
      RouteKey: "post",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      integration: "integration::sam-app::sam-app-post-function",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    dependencies: ({}) => ({
      api: "sam-app",
      stage: "prod",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    name: "sam-app-websocket_connections",
    properties: ({}) => ({
      AttributeDefinitions: [
        {
          AttributeName: "connectionId",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "connectionId",
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
    name: "sam-app-OnConnectLambdaFunctionRole-BWZIV6IR9OMV",
    properties: ({ getId }) => ({
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
                  "dynamodb:GetItem",
                  "dynamodb:DeleteItem",
                  "dynamodb:PutItem",
                  "dynamodb:Scan",
                  "dynamodb:Query",
                  "dynamodb:UpdateItem",
                  "dynamodb:BatchWriteItem",
                  "dynamodb:BatchGetItem",
                  "dynamodb:DescribeTable",
                  "dynamodb:ConditionCheckItem",
                ],
                Resource: [
                  `${getId({
                    type: "Table",
                    group: "DynamoDB",
                    name: "sam-app-websocket_connections",
                  })}`,
                  `${getId({
                    type: "Table",
                    group: "DynamoDB",
                    name: "sam-app-websocket_connections",
                  })}/index/*`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "OnConnectLambdaFunctionRolePolicy0",
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
      table: "sam-app-websocket_connections",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "sam-app-OnDisconnectLambdaFunctionRole-1K1VHGSO99JHS",
    properties: ({ getId }) => ({
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
                  "dynamodb:GetItem",
                  "dynamodb:DeleteItem",
                  "dynamodb:PutItem",
                  "dynamodb:Scan",
                  "dynamodb:Query",
                  "dynamodb:UpdateItem",
                  "dynamodb:BatchWriteItem",
                  "dynamodb:BatchGetItem",
                  "dynamodb:DescribeTable",
                  "dynamodb:ConditionCheckItem",
                ],
                Resource: [
                  `${getId({
                    type: "Table",
                    group: "DynamoDB",
                    name: "sam-app-websocket_connections",
                  })}`,
                  `${getId({
                    type: "Table",
                    group: "DynamoDB",
                    name: "sam-app-websocket_connections",
                  })}/index/*`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "OnDisconnectLambdaFunctionRolePolicy0",
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
      table: "sam-app-websocket_connections",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "sam-app-PostLambdaFunctionRole-1DAT8LSZH0D2Y",
    properties: ({ config, getId }) => ({
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
                  "dynamodb:GetItem",
                  "dynamodb:DeleteItem",
                  "dynamodb:PutItem",
                  "dynamodb:Scan",
                  "dynamodb:Query",
                  "dynamodb:UpdateItem",
                  "dynamodb:BatchWriteItem",
                  "dynamodb:BatchGetItem",
                  "dynamodb:DescribeTable",
                  "dynamodb:ConditionCheckItem",
                ],
                Resource: [
                  `${getId({
                    type: "Table",
                    group: "DynamoDB",
                    name: "sam-app-websocket_connections",
                  })}`,
                  `${getId({
                    type: "Table",
                    group: "DynamoDB",
                    name: "sam-app-websocket_connections",
                  })}/index/*`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "PostLambdaFunctionRolePolicy0",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: ["execute-api:ManageConnections"],
                Resource: [
                  `arn:aws:execute-api:${
                    config.region
                  }:${config.accountId()}:0oc15ekvc4/*`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "PostLambdaFunctionRolePolicy1",
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
      table: "sam-app-websocket_connections",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "sam-app-onconnect-function",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            TABLE_NAME: `sam-app-websocket_connections`,
          },
        },
        Handler: "onconnect.handler",
        MemorySize: 256,
        Runtime: "nodejs14.x",
        Timeout: 15,
      },
      Tags: {
        "lambda:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-OnConnectLambdaFunctionRole-BWZIV6IR9OMV",
      dynamoDbTable: "sam-app-websocket_connections",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "sam-app-ondisconnect-function",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            TABLE_NAME: `sam-app-websocket_connections`,
          },
        },
        Handler: "ondisconnect.handler",
        MemorySize: 256,
        Runtime: "nodejs14.x",
        Timeout: 15,
      },
      Tags: {
        "lambda:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-OnDisconnectLambdaFunctionRole-1K1VHGSO99JHS",
      dynamoDbTable: "sam-app-websocket_connections",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "sam-app-post-function",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            TABLE_NAME: `sam-app-websocket_connections`,
          },
        },
        Handler: "post.handler",
        MemorySize: 256,
        Runtime: "nodejs14.x",
        Timeout: 15,
      },
      Tags: {
        "lambda:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-PostLambdaFunctionRole-1DAT8LSZH0D2Y",
      dynamoDbTable: "sam-app-websocket_connections",
    }),
  },
];
