// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "my-maintenance-window-role-policy",
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "ssm:SendCommand",
              "ssm:CancelCommand",
              "ssm:ListCommands",
              "ssm:ListCommandInvocations",
              "ssm:GetCommandInvocation",
              "ssm:GetAutomationExecution",
              "ssm:StartAutomationExecution",
              "ssm:ListTagsForResource",
              "ssm:GetParameters",
            ],
            Effect: "Allow",
            Resource: "*",
          },
          {
            Action: ["states:DescribeExecution", "states:StartExecution"],
            Effect: "Allow",
            Resource: [
              "arn:aws:states:*:*:execution:*:*",
              "arn:aws:states:*:*:stateMachine:*",
            ],
          },
          {
            Action: ["lambda:InvokeFunction"],
            Effect: "Allow",
            Resource: ["arn:aws:lambda:*:*:function:*"],
          },
          {
            Action: [
              "resource-groups:ListGroups",
              "resource-groups:ListGroupResources",
            ],
            Effect: "Allow",
            Resource: ["*"],
          },
          {
            Action: ["tag:GetResources"],
            Effect: "Allow",
            Resource: ["*"],
          },
          {
            Action: "iam:PassRole",
            Condition: {
              StringEquals: {
                "iam:PassedToService": ["ssm.amazonaws.com"],
              },
            },
            Effect: "Allow",
            Resource: "*",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "my-maintenance-window-role",
      Description: "Allows SSM to call AWS services on your behalf",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "ssm.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["my-maintenance-window-role-policy"],
    }),
  },
  {
    type: "MaintenanceWindow",
    group: "SSM",
    properties: ({}) => ({
      AllowUnassociatedTargets: false,
      Cutoff: 0,
      Duration: 3,
      Name: "my-maintenance-window",
      Schedule: "cron(0 */30 * * * ? *)",
    }),
  },
  {
    type: "MaintenanceWindowTarget",
    group: "SSM",
    properties: ({}) => ({
      Name: "my-target",
      ResourceType: "INSTANCE",
      Targets: [
        {
          Key: "tag:mykey",
          Values: ["myvalue"],
        },
      ],
    }),
    dependencies: ({}) => ({
      maintenanceWindow: "my-maintenance-window",
    }),
  },
  {
    type: "MaintenanceWindowTask",
    group: "SSM",
    properties: ({}) => ({
      Name: "RestartEC2Instance-task",
      Priority: 1,
      TaskArn: "AWS-RestartEC2Instance",
      TaskInvocationParameters: {
        Automation: {
          DocumentVersion: "$LATEST",
        },
      },
      TaskParameters: {},
      TaskType: "AUTOMATION",
    }),
    dependencies: ({}) => ({
      iamRoleService: "my-maintenance-window-role",
      maintenanceWindow: "my-maintenance-window",
    }),
  },
];
