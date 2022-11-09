// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description: "Sample Event for Glue terraform example",
      Name: "stf_trigger_rule",
      ScheduleExpression: "rate(10 minutes)",
      State: "ENABLED",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "terraform-20220713102240691900000003",
    }),
    dependencies: ({}) => ({
      rule: "stf_trigger_rule",
      role: "aws-events-invoke-StepFunction",
      sfnStateMachine: "aws-step-function-workflow",
    }),
  },
  {
    type: "Job",
    group: "Glue",
    properties: ({}) => ({
      Command: {
        Name: "glueetl",
        PythonVersion: "3",
        ScriptLocation:
          "s3://sample-bucket-glue-scripts-terraform-840541460064/glue_script.py",
      },
      DefaultArguments: {
        "--TempDir":
          "s3://sample-bucket-glue-scripts-terraform-840541460064/tmp/",
        "--job-bookmark-option": "job-bookmark-disable",
        "--job-language": "python",
      },
      Description: "AWS Glue Job terraform example",
      ExecutionProperty: {
        MaxConcurrentRuns: 5,
      },
      GlueVersion: "3.0",
      MaxRetries: 0,
      Name: "sample-glue-job-terraform",
      NumberOfWorkers: 2,
      Timeout: 2880,
      WorkerType: "G.1X",
    }),
    dependencies: ({}) => ({
      role: "sample-glue-role",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ getId }) => ({
      RoleName: "aws-events-invoke-StepFunction",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: ["events.amazonaws.com", "states.amazonaws.com"],
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
                Sid: "Stmt1647307985962",
                Action: ["states:StartExecution"],
                Effect: "Allow",
                Resource: `${getId({
                  type: "StateMachine",
                  group: "StepFunctions",
                  name: "aws-step-function-workflow",
                })}`,
              },
            ],
          },
          PolicyName: "state_execution_policy",
        },
      ],
    }),
    dependencies: ({}) => ({
      stateMachines: ["aws-step-function-workflow"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "aws-stf-role",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "StepFunctionAssumeRole",
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
                Action: [
                  "glue:StartJobRun",
                  "glue:GetJobRun",
                  "glue:GetJobRuns",
                  "glue:BatchStopJobRun",
                ],
                Effect: "Allow",
                Resource: `arn:aws:glue:${
                  config.region
                }:${config.accountId()}:job/sample-glue-job-terraform`,
              },
            ],
          },
          PolicyName: "aws-stf-policy",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sample-glue-role",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "glue.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AWSGlueServiceRole",
          PolicyArn: "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole",
        },
      ],
    }),
    dependencies: ({}) => ({
      policies: ["sample-glue-s3-access-policy"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "sample-glue-s3-access-policy",
      PolicyDocument: {
        Statement: [
          {
            Action: "s3:ListBucket",
            Effect: "Allow",
            Resource: `arn:aws:s3:::sample-bucket-glue-scripts-terraform-${config.accountId()}`,
            Sid: "",
          },
          {
            Action: ["s3:PutObject", "s3:GetObject"],
            Effect: "Allow",
            Resource: `arn:aws:s3:::sample-bucket-glue-scripts-terraform-${config.accountId()}/*`,
            Sid: "",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: `sample-bucket-glue-scripts-terraform-${config.accountId()}`,
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({}) => ({
      definition: {
        Comment:
          "A description of the sample glue job state machine using Terraform",
        StartAt: "Glue StartJobRun",
        States: {
          "Glue StartJobRun": {
            Type: "Task",
            Resource: "arn:aws:states:::glue:startJobRun.sync",
            Parameters: {
              JobName: "sample-glue-job-terraform",
              Arguments: {
                "--message":
                  "This is a message passed by the AWS Step Function",
              },
            },
            End: true,
          },
        },
      },
      name: "aws-step-function-workflow",
    }),
    dependencies: ({}) => ({
      role: "aws-stf-role",
    }),
  },
];
