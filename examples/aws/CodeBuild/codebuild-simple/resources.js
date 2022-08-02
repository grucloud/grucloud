// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Project",
    group: "CodeBuild",
    properties: ({}) => ({
      artifacts: {
        type: "NO_ARTIFACTS",
      },
      environment: {
        computeType: "BUILD_GENERAL1_SMALL",
        environmentVariables: [],
        image: "aws/codebuild/amazonlinux2-x86_64-standard:4.0",
        imagePullCredentialsType: "CODEBUILD",
        privilegedMode: true,
        type: "LINUX_CONTAINER",
      },
      logsConfig: {
        cloudWatchLogs: {
          status: "ENABLED",
        },
        s3Logs: {
          encryptionDisabled: false,
          status: "DISABLED",
        },
      },
      name: "my-project",
      source: {
        buildspec:
          "version: 0.2\n\nphases:\n  build:\n    commands:\n       - npm install\n",
        location: "https://github.com/grucloud/grucloud",
        reportBuildStatus: false,
        type: "GITHUB",
      },
      sourceVersion: "main",
    }),
    dependencies: ({}) => ({
      serviceRole: "codebuild-my-project-service-role",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "codebuild-my-project-service-role",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `codebuild.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({ config }) => ({
      policies: [`CodeBuildBasePolicy-my-project-${config.region}`],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: `CodeBuildBasePolicy-my-project-${config.region}`,
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/codebuild/my-project`,
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/codebuild/my-project:*`,
            ],
            Action: [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents",
            ],
          },
          {
            Effect: "Allow",
            Resource: [`arn:aws:s3:::codepipeline-${config.region}-*`],
            Action: [
              "s3:PutObject",
              "s3:GetObject",
              "s3:GetObjectVersion",
              "s3:GetBucketAcl",
              "s3:GetBucketLocation",
            ],
          },
          {
            Effect: "Allow",
            Action: [
              "codebuild:CreateReportGroup",
              "codebuild:CreateReport",
              "codebuild:UpdateReport",
              "codebuild:BatchPutTestCases",
              "codebuild:BatchPutCodeCoverages",
            ],
            Resource: [
              `arn:aws:codebuild:${
                config.region
              }:${config.accountId()}:report-group/my-project-*`,
            ],
          },
        ],
      },
      Path: "/service-role/",
      Description: "Policy used in trust relationship with CodeBuild",
    }),
  },
];
