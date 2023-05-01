// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Authorizer",
    group: "APIGateway",
    name: "LambdaAuthorizerToken",
    readOnly: true,
    properties: ({ config }) => ({
      authorizerUri: `arn:aws:apigateway:${
        config.region
      }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
        config.region
      }:${config.accountId()}:function:sam-app-TokenAuthorizerFunction-gI6jKEKAM1f5/invocations`,
      authType: "custom",
      identitySource: "method.request.header.Authorization",
      name: "LambdaAuthorizerToken",
      type: "TOKEN",
    }),
    dependencies: ({}) => ({
      restApi: "apigw-lambda-authorizer",
    }),
  },
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      description: "Lambda Token Authorizer REST API demo",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      name: "apigw-lambda-authorizer",
      schema: {
        openapi: "3.0.1",
        info: {
          description: "Lambda Token Authorizer REST API demo",
          title: "apigw-lambda-authorizer",
          version: "1",
        },
        paths: {
          "/": {
            get: {
              "x-amazon-apigateway-auth": {
                type: "CUSTOM",
              },
              security: [
                {
                  LambdaAuthorizerToken: [],
                },
              ],
              "x-amazon-apigateway-integration": {
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "AWS_PROXY",
                uri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:sam-app-AppFunction-GCg7wu2MTQor/invocations`,
              },
            },
          },
        },
        components: {
          securitySchemes: {
            LambdaAuthorizerToken: {
              type: "apiKey",
              name: "Authorization",
              in: "header",
              "x-amazon-apigateway-authtype": "custom",
              "x-amazon-apigateway-authorizer": {
                type: "TOKEN",
                authorizerUri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:sam-app-TokenAuthorizerFunction-gI6jKEKAM1f5/invocations`,
                identitySource: "method.request.header.Authorization",
              },
            },
          },
          schemas: {
            Empty: {
              title: "Empty Schema",
              type: "object",
            },
            Error: {
              title: "Error Schema",
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      deployment: {
        stageName: "Prod",
      },
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Prod",
    }),
    dependencies: ({}) => ({
      restApi: "apigw-lambda-authorizer",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-AppFunctionRole-1X1Q8LI42XT4E",
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
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
          PolicyName: "AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-TokenAuthorizerFunctionRole-1C4MB81Y5P9AI",
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
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-AppFunction-GCg7wu2MTQor",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-AppFunctionRole-1X1Q8LI42XT4E",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-TokenAuthorizerFunction-gI6jKEKAM1f5",
        Handler: "tokenauthorizer.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-TokenAuthorizerFunctionRole-1C4MB81Y5P9AI",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-AppFunction-GCg7wu2MTQor",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "apigw-lambda-authorizer",
            path: "live.arnv2",
          })}/*/GET/`,
          StatementId: "sam-app-AppFunctionPermission-1T1OTJVCQINVH",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-AppFunction-GCg7wu2MTQor",
      apiGatewayRestApis: ["apigw-lambda-authorizer"],
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-TokenAuthorizerFunction-gI6jKEKAM1f5",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "Authorizer",
            group: "APIGateway",
            name: "LambdaAuthorizerToken",
            path: "live.arn",
          })}`,
          StatementId:
            "sam-app-TokenAuthorizerFunctionPermission-1ST3GRY9FYCGC",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-TokenAuthorizerFunction-gI6jKEKAM1f5",
      apiGatewayAuthorizers: ["LambdaAuthorizerToken"],
      apiGatewayRestApis: ["apigw-lambda-authorizer"],
    }),
  },
];
