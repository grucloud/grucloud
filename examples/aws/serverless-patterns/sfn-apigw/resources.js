// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    name: "sam-app",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      schema: {
        openapi: "3.0.1",
        info: {
          title: "sam-app",
          version: "1",
        },
        paths: {
          "/": {
            get: {
              responses: {},
              "x-amazon-apigateway-integration": {
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "AWS_PROXY",
                uri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:sam-app-ExampleLambdaFunction-DjN0ovBJ6PsT/invocations`,
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
    properties: ({}) => ({ stageName: "Prod" }),
    dependencies: ({}) => ({
      restApi: "sam-app",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({ stageName: "Stage" }),
    dependencies: ({}) => ({
      restApi: "sam-app",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "stepfunctions/StateMachinetoAPIGW",
  },
  {
    type: "Role",
    group: "IAM",
    name: "sam-app-ExampleLambdaFunctionRole-10XK3921W9OPT",
    properties: ({}) => ({
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
    type: "Role",
    group: "IAM",
    name: "sam-app-StatesExecutionRole-VZMKU2P2QBYH",
    properties: ({ config }) => ({
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
                }:${config.accountId()}:function:sam-app-ExampleLambdaFunction-DjN0ovBJ6PsT`,
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
                Resource: `*`,
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
    name: "sam-app-ExampleLambdaFunction-DjN0ovBJ6PsT",
    properties: ({}) => ({
      Configuration: {
        Handler: "app.handler",
        Runtime: "nodejs12.x",
      },
      Tags: {
        "lambda:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-ExampleLambdaFunctionRole-10XK3921W9OPT",
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    name: "StateMachinetoAPIGW-uB4wAPaxm1sp",
    properties: ({ config, getId }) => ({
      definition: {
        Comment:
          "A Retry example of the Amazon States Language using an AWS API GW Endpoint",
        StartAt: "invokeAPI",
        States: {
          invokeAPI: {
            Type: "Task",
            Resource: `arn:aws:states:::apigateway:invoke`,
            Parameters: {
              ApiEndpoint: `60lo2hkcu3.execute-api.${config.region}.amazonaws.com`,
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
      tags: [
        {
          key: "stateMachine:createdBy",
          value: "SAM",
        },
      ],
    }),
    dependencies: ({}) => ({
      role: "sam-app-StatesExecutionRole-VZMKU2P2QBYH",
      logGroups: ["stepfunctions/StateMachinetoAPIGW"],
    }),
  },
];
