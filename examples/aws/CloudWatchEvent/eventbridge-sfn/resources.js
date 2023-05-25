// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      EventPattern: {
        detail: {
          state: ["running", "stopped", "terminated"],
        },
        source: ["aws.ec2"],
      },
      Name: "sam-app-EC2StateWatcherStateChange-17JX9UWJE1I41",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "EC2StateWatcherStateChangeStepFunctionsTarget",
      InputPath: "$.detail",
    }),
    dependencies: ({}) => ({
      rule: "sam-app-EC2StateWatcherStateChange-17JX9UWJE1I41",
      role: "sam-app-EC2StateWatcherStateChangeRole-3KZ97C4BFJT8",
      sfnStateMachine: "EC2StateWatcher-LPWmHPO6SyX7",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "sam-app-EC2StateWatcherLogs-zzRI1XupoU12",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-EC2StateWatcherRole-14262CQY6KMMT",
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
            Statement: [
              {
                Action: ["logs:*"],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "EC2StateWatcherRolePolicy0",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-EC2StateWatcherStateChangeRole-3KZ97C4BFJT8",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "events.amazonaws.com",
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
                Action: "states:StartExecution",
                Resource: `arn:aws:states:${
                  config.region
                }:${config.accountId()}:stateMachine:EC2StateWatcher-LPWmHPO6SyX7`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "EC2StateWatcherStateChangeRoleStartExecutionPolicy",
        },
      ],
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({ getId }) => ({
      definition: {
        StartAt: "What Happened?",
        States: {
          "It's Gone": {
            End: true,
            Type: "Pass",
          },
          "It's Running": {
            End: true,
            Type: "Pass",
          },
          "It's Stopped": {
            End: true,
            Type: "Pass",
          },
          "What Happened?": {
            Choices: [
              {
                Next: "It's Running",
                StringEquals: "running",
                Variable: "$.state",
              },
              {
                Next: "It's Stopped",
                StringEquals: "stopped",
                Variable: "$.state",
              },
              {
                Next: "It's Gone",
                StringEquals: "terminated",
                Variable: "$.state",
              },
            ],
            Type: "Choice",
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
                name: "sam-app-EC2StateWatcherLogs-zzRI1XupoU12",
              })}:*`,
            },
          },
        ],
        level: "ERROR",
      },
      name: "EC2StateWatcher-LPWmHPO6SyX7",
    }),
    dependencies: ({}) => ({
      role: "sam-app-EC2StateWatcherRole-14262CQY6KMMT",
      logGroups: ["sam-app-EC2StateWatcherLogs-zzRI1XupoU12"],
    }),
  },
];