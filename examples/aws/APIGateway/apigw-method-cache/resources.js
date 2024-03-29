// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      description: "Cached Method REST API demo",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      name: "apigw-method-cache",
      schema: {
        openapi: "3.0.1",
        info: {
          description: "Cached Method REST API demo",
          title: "apigw-method-cache",
          version: "1",
        },
        paths: {
          "/": {
            get: {
              "x-amazon-apigateway-integration": {
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "AWS_PROXY",
                uri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:sam-app-AppFunction-7j5bVYnPFtwj/invocations`,
              },
            },
          },
        },
        components: {
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
      cacheClusterEnabled: true,
      cacheClusterSize: "0.5",
      methodSettings: {
        "~1/GET": {
          cacheDataEncrypted: false,
          cacheTtlInSeconds: 10,
          cachingEnabled: true,
          dataTraceEnabled: false,
          metricsEnabled: false,
          requireAuthorizationForCacheControl: true,
          throttlingBurstLimit: 5000,
          throttlingRateLimit: 10000,
          unauthorizedCacheControlHeaderStrategy:
            "SUCCEED_WITH_RESPONSE_HEADER",
        },
      },
      stageName: "Prod",
    }),
    dependencies: ({}) => ({
      restApi: "apigw-method-cache",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-AppFunctionRole-1G5NUC70DOWW5",
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
        FunctionName: "sam-app-AppFunction-7j5bVYnPFtwj",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-AppFunctionRole-1G5NUC70DOWW5",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-AppFunction-7j5bVYnPFtwj",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "apigw-method-cache",
            path: "live.arnv2",
          })}/*/GET/`,
          StatementId: "sam-app-AppFunctionPermission-MRV4P2GAJQM1",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-AppFunction-7j5bVYnPFtwj",
      apiGatewayRestApis: ["apigw-method-cache"],
    }),
  },
];
