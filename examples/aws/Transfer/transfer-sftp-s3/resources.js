// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "AWSTransferLoggingAccess",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "transfer.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSTransferLoggingAccess",
          PolicyName: "AWSTransferLoggingAccess",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "role-transfer",
      Description: "Allow AWS Transfer to call AWS services on your behalf.",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "transfer.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn: "arn:aws:iam::aws:policy/AmazonS3FullAccess",
          PolicyName: "AmazonS3FullAccess",
        },
      ],
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-transfer-s3",
    }),
  },
  {
    type: "Server",
    group: "Transfer",
    properties: ({ getId }) => ({
      Domain: "S3",
      EndpointType: "PUBLIC",
      IdentityProviderType: "SERVICE_MANAGED",
      Protocols: ["SFTP"],
      WorkflowDetails: {
        OnUpload: [
          {
            ExecutionRole: `${getId({
              type: "Role",
              group: "IAM",
              name: "role-transfer",
            })}`,
            WorkflowId: `${getId({
              type: "Workflow",
              group: "Transfer",
              name: "my-workflow",
            })}`,
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      iamRoleLogging: "AWSTransferLoggingAccess",
      workflows: ["my-workflow"],
    }),
  },
  {
    type: "User",
    group: "Transfer",
    properties: ({}) => ({
      HomeDirectory: "/gc-transfer-s3/my-user",
      HomeDirectoryType: "PATH",
      UserName: "my-user",
    }),
    dependencies: ({}) => ({
      iamRole: "role-transfer",
      server: "S3::PUBLIC",
      s3Bucket: "gc-transfer-s3",
    }),
  },
  {
    type: "Workflow",
    group: "Transfer",
    properties: ({}) => ({
      Description: "my-workflow",
      OnExceptionSteps: [],
      Steps: [
        {
          TagStepDetails: {
            Name: "tag",
            SourceFileLocation: "${previous.file}",
            Tags: [
              {
                Key: "mytag",
                Value: "mykey",
              },
            ],
          },
          Type: "TAG",
        },
      ],
    }),
  },
];
