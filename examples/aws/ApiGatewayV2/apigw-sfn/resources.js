// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      CorsConfiguration: {
        AllowCredentials: false,
        AllowMethods: ["*"],
        AllowOrigins: ["*"],
        MaxAge: 0,
      },
      Name: "processFormExample",
      Tags: {
        "httpapi:createdBy": "SAM",
      },
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "Automatic deployment triggered by changes to the Api configuration",
      AutoDeployed: true,
    }),
    dependencies: ({}) => ({
      api: "processFormExample",
      stage: "processFormExample::$default",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({ config }) => ({
      ConnectionType: "INTERNET",
      IntegrationSubtype: "StepFunctions-StartSyncExecution",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "1.0",
      RequestParameters: {
        Input: "$request.body",
        StateMachineArn: `arn:aws:states:${
          config.region
        }:${config.accountId()}:stateMachine:StateMachineExpressSync-2CoJnh1wm0fA`,
      },
    }),
    dependencies: ({}) => ({
      api: "processFormExample",
      role: "sam-app-HttpApiRole-JUJJQ0MR8S77",
      stepFunctionsStateMachine: "StateMachineExpressSync-2CoJnh1wm0fA",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteKey: "POST /",
    }),
    dependencies: ({}) => ({
      api: "processFormExample",
      integration:
        "integration::processFormExample::StateMachineExpressSync-2CoJnh1wm0fA",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      AutoDeploy: true,
      StageName: "$default",
      Tags: {
        "httpapi:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      api: "processFormExample",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "stepfunctions/StateMachineExpressSync",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-HttpApiRole-JUJJQ0MR8S77",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
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
                Action: "states:StartSyncExecution",
                Resource: `arn:aws:states:${
                  config.region
                }:${config.accountId()}:stateMachine:StateMachineExpressSync-2CoJnh1wm0fA`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "AllowSFNExec",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-StateMachineExpressSyncRole-C5B9KAPO70UU",
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
                Action: ["cloudwatch:*", "logs:*"],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "StateMachineExpressSyncRolePolicy0",
        },
      ],
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({ getId }) => ({
      definition: {
        Comment:
          "A Hello World example demonstrating various state types of the Amazon States Language",
        StartAt: "Pass",
        States: {
          Pass: {
            Comment:
              "A Pass state passes its input to its output, without performing work. Pass states are useful when constructing and debugging state machines.",
            Type: "Pass",
            Next: "Hello World example?",
          },
          "Hello World example?": {
            Comment:
              "A Choice state adds branching logic to a state machine. Choice rules can implement 16 different comparison operators, and can be combined using And, Or, and Not",
            Type: "Choice",
            Choices: [
              {
                Variable: "$.IsHelloWorldExample",
                StringEquals: "Yes",
                Next: "Yes",
              },
              {
                Variable: "$.IsHelloWorldExample",
                StringEquals: "No",
                Next: "No",
              },
            ],
            Default: "No",
          },
          Yes: {
            Type: "Pass",
            Next: "Wait 3 sec",
          },
          No: {
            Type: "Fail",
            Cause: "Not Hello World",
          },
          "Wait 3 sec": {
            Comment:
              "A Wait state delays the state machine from continuing for a specified time.",
            Type: "Wait",
            Seconds: 3,
            Next: "Parallel State",
          },
          "Parallel State": {
            Comment:
              "A Parallel state can be used to create parallel branches of execution in your state machine.",
            Type: "Parallel",
            Next: "Hello World",
            Branches: [
              {
                StartAt: "Hello",
                States: {
                  Hello: {
                    Type: "Pass",
                    End: true,
                  },
                },
              },
              {
                StartAt: "World",
                States: {
                  World: {
                    Type: "Pass",
                    End: true,
                  },
                },
              },
            ],
          },
          "Hello World": {
            Type: "Pass",
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
                name: "stepfunctions/StateMachineExpressSync",
              })}:*`,
            },
          },
        ],
        level: "ALL",
      },
      name: "StateMachineExpressSync-2CoJnh1wm0fA",
      type: "EXPRESS",
    }),
    dependencies: ({}) => ({
      role: "sam-app-StateMachineExpressSyncRole-C5B9KAPO70UU",
      logGroups: ["stepfunctions/StateMachineExpressSync"],
    }),
  },
];
