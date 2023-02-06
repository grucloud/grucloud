// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "robust-gelding",
      tags: {
        Module: "step_function",
        Pattern: "terraform-lambda-sfn",
      },
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "crucial-bass-lambda",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Tags: [
        {
          Key: "Module",
          Value: "lambda_function",
        },
        {
          Key: "Pattern",
          Value: "terraform-s3-object-lambda",
        },
      ],
    }),
    dependencies: ({}) => ({
      policies: ["crucial-bass-lambda-inline", "crucial-bass-lambda-logs"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "robust-gelding",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: `states.${config.region}.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Tags: [
        {
          Key: "Module",
          Value: "step_function",
        },
        {
          Key: "Pattern",
          Value: "terraform-lambda-sfn",
        },
      ],
    }),
    dependencies: ({}) => ({
      policies: [
        "robust-gelding-lambda",
        "robust-gelding-logs",
        "robust-gelding-xray",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "robust-gelding-lambda",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Tags: [
        {
          Key: "Module",
          Value: "lambda_function",
        },
        {
          Key: "Pattern",
          Value: "terraform-lambda-sfn",
        },
      ],
    }),
    dependencies: ({}) => ({
      policies: ["robust-gelding-lambda-inline", "robust-gelding-lambda-logs"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "crucial-bass-lambda-inline",
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "s3:PutObjectAcl",
              "s3:PutObject",
              "s3:PutLifecycleConfiguration",
              "s3:ListBucket",
              "s3:GetObjectVersion",
              "s3:GetObject",
              "s3:GetLifecycleConfiguration",
              "s3:GetBucketLocation",
              "s3:DeleteObject",
            ],
            Effect: "Allow",
            Resource: [
              "arn:aws:s3:::crucial-bass-bucket/*",
              "arn:aws:s3:::crucial-bass-bucket",
            ],
            Sid: "s3crud",
          },
          {
            Action: "s3-object-lambda:WriteGetObjectResponse",
            Effect: "Allow",
            Resource: "*",
            Sid: "s3objectlambda",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
      Tags: [
        {
          Key: "Module",
          Value: "lambda_function",
        },
        {
          Key: "Pattern",
          Value: "terraform-s3-object-lambda",
        },
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "crucial-bass-lambda-logs",
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "logs:PutLogEvents",
              "logs:CreateLogStream",
              "logs:CreateLogGroup",
            ],
            Effect: "Allow",
            Resource: [
              `arn:aws:logs:eu-west-1:${config.accountId()}:log-group:/aws/lambda/crucial-bass-lambda:*:*`,
              `arn:aws:logs:eu-west-1:${config.accountId()}:log-group:/aws/lambda/crucial-bass-lambda:*`,
            ],
            Sid: "",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
      Tags: [
        {
          Key: "Module",
          Value: "lambda_function",
        },
        {
          Key: "Pattern",
          Value: "terraform-s3-object-lambda",
        },
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "robust-gelding-lambda",
      PolicyDocument: {
        Statement: [
          {
            Action: "lambda:InvokeFunction",
            Effect: "Allow",
            Resource: `arn:aws:lambda:${
              config.region
            }:${config.accountId()}:function:robust-gelding-lambda`,
            Sid: "lambdaLambda",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
      Tags: [
        {
          Key: "Module",
          Value: "step_function",
        },
        {
          Key: "Pattern",
          Value: "terraform-lambda-sfn",
        },
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "robust-gelding-lambda-inline",
      PolicyDocument: {
        Statement: [
          {
            Action: "states:StartExecution",
            Effect: "Allow",
            Resource: `arn:aws:states:${
              config.region
            }:${config.accountId()}:stateMachine:robust-gelding`,
            Sid: "stepfunction",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
      Tags: [
        {
          Key: "Module",
          Value: "lambda_function",
        },
        {
          Key: "Pattern",
          Value: "terraform-lambda-sfn",
        },
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "robust-gelding-lambda-logs",
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "logs:PutLogEvents",
              "logs:CreateLogStream",
              "logs:CreateLogGroup",
            ],
            Effect: "Allow",
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/lambda/robust-gelding-lambda:*:*`,
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/lambda/robust-gelding-lambda:*`,
            ],
            Sid: "",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
      Tags: [
        {
          Key: "Module",
          Value: "lambda_function",
        },
        {
          Key: "Pattern",
          Value: "terraform-lambda-sfn",
        },
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "robust-gelding-logs",
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "logs:UpdateLogDelivery",
              "logs:PutResourcePolicy",
              "logs:ListLogDeliveries",
              "logs:GetLogDelivery",
              "logs:DescribeResourcePolicies",
              "logs:DescribeLogGroups",
              "logs:DeleteLogDelivery",
              "logs:CreateLogDelivery",
            ],
            Effect: "Allow",
            Resource: "*",
            Sid: "",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
      Tags: [
        {
          Key: "Module",
          Value: "step_function",
        },
        {
          Key: "Pattern",
          Value: "terraform-lambda-sfn",
        },
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "robust-gelding-xray",
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "xray:PutTraceSegments",
              "xray:PutTelemetryRecords",
              "xray:GetSamplingTargets",
              "xray:GetSamplingRules",
            ],
            Effect: "Allow",
            Resource: "*",
            Sid: "xrayXray",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
      Tags: [
        {
          Key: "Module",
          Value: "step_function",
        },
        {
          Key: "Pattern",
          Value: "terraform-lambda-sfn",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ config }) => ({
      Configuration: {
        Description: "My awesome lambda function",
        Environment: {
          Variables: {
            SFN_ARN: `arn:aws:states:${
              config.region
            }:${config.accountId()}:stateMachine:robust-gelding`,
          },
        },
        FunctionName: "robust-gelding-lambda",
        Handler: "LambdaFunction.lambda_handler",
        Runtime: "python3.8",
      },
      Tags: {
        Pattern: "terraform-lambda-sfn",
        Module: "lambda_function",
      },
    }),
    dependencies: ({}) => ({
      role: "robust-gelding-lambda",
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({ getId }) => ({
      definition: {
        Comment: "State Machine example with various state types",
        StartAt: "Pass State",
        States: {
          "Pass State": {
            Comment:
              "A Pass state passes its input to its output, without performing work. Pass states are useful when constructing and debugging state machines.",
            Type: "Pass",
            Next: "Wait State",
          },
          "Wait State": {
            Comment:
              "A Wait state delays the state machine from continuing for a specified time. You can choose either a relative time, specified in seconds from when the state begins, or an absolute end time, specified as a timestamp.",
            Type: "Wait",
            Seconds: 3,
            Next: "Choice State",
          },
          "Choice State": {
            Comment: "A Choice state adds branching logic to a state machine.",
            Type: "Choice",
            Choices: [
              {
                Variable: "$.Choice",
                StringEquals: "A",
                Next: "Succeed State",
              },
              {
                Variable: "$.Choice",
                StringEquals: "B",
                Next: "Parallel State",
              },
            ],
            Default: "Error Handling State",
          },
          "Parallel State": {
            Comment:
              "A Parallel state can be used to create parallel branches of execution in your state machine.",
            Type: "Parallel",
            Next: "Succeed State",
            Branches: [
              {
                StartAt: "Branch 1",
                States: {
                  "Branch 1": {
                    Type: "Pass",
                    Parameters: {
                      "comment.$":
                        "States.Format('Branch 1 Processing of Choice {}', $.Choice)",
                    },
                    End: true,
                  },
                },
              },
              {
                StartAt: "Branch 2",
                States: {
                  "Branch 2": {
                    Type: "Pass",
                    Parameters: {
                      "comment.$":
                        "States.Format('Branch 2 Processing of Choice {}', $.Choice)",
                    },
                    End: true,
                  },
                },
              },
            ],
          },
          "Succeed State": {
            Type: "Succeed",
            Comment:
              "A Succeed state stops an execution successfully. The Succeed state is a useful target for Choice state branches that don't do anything but stop the execution.",
          },
          "Error Handling State": {
            Type: "Pass",
            Parameters: {
              "error.$": "States.Format('{} is an invalid Choice.',$.Choice)",
            },
            Next: "Fail State",
          },
          "Fail State": {
            Type: "Fail",
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
                name: "robust-gelding",
              })}:*`,
            },
          },
        ],
        includeExecutionData: true,
        level: "ALL",
      },
      name: "robust-gelding",
      tracingConfiguration: {
        enabled: true,
      },
      tags: [
        {
          key: "Module",
          value: "step_function",
        },
        {
          key: "Pattern",
          value: "terraform-lambda-sfn",
        },
      ],
    }),
    dependencies: ({}) => ({
      role: "robust-gelding",
      logGroups: ["robust-gelding"],
    }),
  },
];
