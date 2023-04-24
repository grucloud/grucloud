// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      name: "sam-app",
      schema: {
        openapi: "3.0.1",
        info: {
          title: "sam-app",
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
                }:${config.accountId()}:function:sam-app-ExampleLambdaFunction-EE7UB1WbNVKM/invocations`,
              },
            },
          },
        },
        components: {
          schemas: {},
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
      restApi: "sam-app",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Stage",
    }),
    dependencies: ({}) => ({
      restApi: "sam-app",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "stepfunctions/StateMachinetoAPIGW",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-ExampleLambdaFunctionRole-122WEVTCC5AAT",
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
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-StatesExecutionRole-WC0816L89GLE",
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
                Action: ["lambda:InvokeFunction"],
                Resource: `arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:sam-app-ExampleLambdaFunction-EE7UB1WbNVKM`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "LambdaExecute",
        },
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
          PolicyName: "LogPermissions",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-ExampleLambdaFunction-EE7UB1WbNVKM",
        Runtime: "nodejs12.x",
        Handler: "app.handler",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-ExampleLambdaFunctionRole-122WEVTCC5AAT",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-ExampleLambdaFunction-EE7UB1WbNVKM",
          Principal: "apigateway.amazonaws.com",
          StatementId:
            "sam-app-ExampleLambdaFunctionApiPermissionProd-FK2P8ZFX60IQ",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "sam-app",
            path: "live.arnv2",
          })}/*/GET/`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-ExampleLambdaFunction-EE7UB1WbNVKM",
      apiGatewayRestApis: ["sam-app"],
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({ getId }) => ({
      definition: {
        Comment:
          "A Retry example of the Amazon States Language using an AWS API GW Endpoint",
        StartAt: "invokeAPI",
        States: {
          invokeAPI: {
            Type: "Task",
            Resource: "arn:aws:states:::apigateway:invoke",
            Parameters: {
              ApiEndpoint: `${getId({
                type: "RestApi",
                group: "APIGateway",
                name: "sam-app",
                path: "live.endpoint",
              })}`,
              Method: "GET",
              Stage: "Prod",
              Path: "/",
              "RequestBody.$": "$",
              AuthType: "NO_AUTH",
            },
            Retry: [
              {
                ErrorEquals: ["States.TaskFailed"],
                IntervalSeconds: 15,
                MaxAttempts: 5,
                BackoffRate: 1.5,
              },
            ],
            End: true,
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
                name: "stepfunctions/StateMachinetoAPIGW",
              })}:*`,
            },
          },
        ],
        level: "ALL",
      },
      name: "StateMachinetoAPIGW-lEKu3kcbm19R",
    }),
    dependencies: ({}) => ({
      role: "sam-app-StatesExecutionRole-WC0816L89GLE",
      apiGatewayRestApis: ["sam-app"],
      logGroups: ["stepfunctions/StateMachinetoAPIGW"],
    }),
  },
];
