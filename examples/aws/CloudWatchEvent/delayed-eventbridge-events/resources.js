// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "EventBus",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Name: "MyCustomBus",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description:
        "Custom notification event when the user has been created 24 hours ago",
      EventPattern: {
        "detail-type": ["UserCreated24HoursAgo"],
        source: ["scheduler.notifications"],
      },
      Name: "DelayedEventbridgeEventsS-UserCreated24HoursAgoRul-BKG65XGQKZL4",
    }),
    dependencies: ({}) => ({
      eventBus: "MyCustomBus",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description: "Listen to UseCreated events",
      EventPattern: {
        "detail-type": ["UserCreated"],
        source: ["myapp.users"],
      },
      Name: "DelayedEventbridgeEventsSt-UserCreatedRuleFC26FD62-160JAIB2MZKKN",
    }),
    dependencies: ({}) => ({
      eventBus: "MyCustomBus",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "Target0",
    }),
    dependencies: ({}) => ({
      rule: "DelayedEventbridgeEventsS-UserCreated24HoursAgoRul-BKG65XGQKZL4",
      lambdaFunction:
        "DelayedEventbridgeEventsStac-emailcustomer9320FC53-43H2krKUIYGt",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "DelayedEventbridgeEventsS-emailcustomerServiceRole-35K5Y7777S3N",
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
    properties: ({}) => ({
      RoleName:
        "DelayedEventbridgeEventsS-processusercreatedServic-EP5MOXMQ4PPL",
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
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "iam:PassRole",
                  "scheduler:CreateSchedule",
                  "scheduler:CreateScheduleGroup",
                ],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "processusercreatedServiceRoleDefaultPolicy9DBB24AC",
        },
      ],
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
      RoleName:
        "DelayedEventbridgeEventsStac-schedulerrole9B80A9F3-11LTFZQSM80PO",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "scheduler.amazonaws.com",
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
                Action: "events:PutEvents",
                Resource: `arn:aws:events:${
                  config.region
                }:${config.accountId()}:event-bus/MyCustomBus`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "ScheduleToPutEvents",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ config }) => ({
      Configuration: {
        Environment: {
          Variables: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            EVENTBUS_ARN: `arn:aws:events:${
              config.region
            }:${config.accountId()}:event-bus/MyCustomBus`,
            SCHEDULE_ROLE_ARN: `arn:aws:iam::${config.accountId()}:role/DelayedEventbridgeEventsStac-schedulerrole9B80A9F3-11LTFZQSM80PO`,
          },
        },
        FunctionName:
          "DelayedEventbridgeEventsS-processusercreated8BB7C4-W6EX7D6aEebC",
        Handler: "index.handler",
        MemorySize: 1024,
        Runtime: "nodejs16.x",
        Timeout: 5,
      },
    }),
    dependencies: ({}) => ({
      role: "DelayedEventbridgeEventsS-processusercreatedServic-EP5MOXMQ4PPL",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
          },
        },
        FunctionName:
          "DelayedEventbridgeEventsStac-emailcustomer9320FC53-43H2krKUIYGt",
        Handler: "index.handler",
        MemorySize: 1024,
        Runtime: "nodejs16.x",
        Timeout: 5,
      },
    }),
    dependencies: ({}) => ({
      role: "DelayedEventbridgeEventsS-emailcustomerServiceRole-35K5Y7777S3N",
    }),
  },
];
