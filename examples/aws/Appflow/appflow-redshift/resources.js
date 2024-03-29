// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Flow",
    group: "Appflow",
    properties: ({}) => ({
      destinationFlowConfigList: [
        {
          connectorProfileName: "connection-redshift",
          connectorType: "Redshift",
          destinationConnectorProperties: {
            Redshift: {
              errorHandlingConfig: {
                failOnFirstDestinationError: true,
              },
              intermediateBucketName: "gc-appflow-redshift",
              object: "information_schema.triggers",
            },
          },
        },
      ],
      flowName: "flow-redshift",
      schemaVersion: 1,
      sourceFlowConfig: {
        connectorType: "S3",
        sourceConnectorProperties: {
          S3: {
            bucketName: "gc-appflow-redshift",
            bucketPrefix: "in",
            s3InputFormatConfig: {
              s3InputFileType: "CSV",
            },
          },
        },
      },
      tasks: [
        {
          connectorOperator: {
            S3: "PROJECTION",
          },
          sourceFields: ["value"],
          taskProperties: {},
          taskType: "Filter",
        },
        {
          connectorOperator: {
            S3: "NO_OP",
          },
          destinationField: "action_order",
          sourceFields: ["value"],
          taskProperties: {
            DESTINATION_DATA_TYPE: "integer",
            SOURCE_DATA_TYPE: "string",
          },
          taskType: "Map",
        },
      ],
      triggerConfig: {
        triggerType: "OnDemand",
      },
    }),
    dependencies: ({}) => ({
      connectorProfileDestinations: ["connection-redshift"],
      s3BucketSource: "gc-appflow-redshift",
    }),
  },
  {
    type: "ConnectorProfile",
    group: "Appflow",
    properties: ({ getId }) => ({
      connectionMode: "Public",
      connectorProfileName: "connection-redshift",
      connectorType: "Redshift",
      connectorProfileConfig: {
        connectorProfileProperties: {
          Redshift: {
            bucketName: "gc-appflow-redshift",
            roleArn: `${getId({
              type: "Role",
              group: "IAM",
              name: "role-redshift-read-s3",
            })}`,
          },
        },
        connectorProfileCredentials: {
          Redshift: {
            username: process.env.CONNECTION_REDSHIFT_REDSHIFT_USERNAME,
            password: process.env.CONNECTION_REDSHIFT_REDSHIFT_PASSWORD,
          },
        },
      },
    }),
    dependencies: ({}) => ({
      iamRoleRedshift: "role-redshift-read-s3",
      s3BucketRedshift: "gc-appflow-redshift",
    }),
  },
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::vpc-default::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "role-appflow-redshift",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "Statement1",
            Effect: "Allow",
            Principal: {
              Service: "appflow.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["policy-appflow-to-redshift"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "role-redshift-read-s3",
      Description:
        "Allows Redshift clusters to call AWS services on your behalf.",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "redshift.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonS3ReadOnlyAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess",
        },
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "policy-appflow-to-redshift",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "DataAPIPermissions",
            Effect: "Allow",
            Action: [
              "redshift-data:ExecuteStatement",
              "redshift-data:GetStatementResult",
              "redshift-data:DescribeStatement",
            ],
            Resource: "*",
          },
          {
            Sid: "GetCredentialsForAPIUser",
            Effect: "Allow",
            Action: "redshift:GetClusterCredentials",
            Resource: [
              "arn:aws:redshift:*:*:dbname:*/*",
              "arn:aws:redshift:*:*:dbuser:*/*",
            ],
          },
          {
            Sid: "GetCredentialsForServerless",
            Effect: "Allow",
            Action: "redshift-serverless:GetCredentials",
            Resource: "*",
            Condition: {
              StringLike: {
                "aws:ResourceTag/RedshiftDataFullAccess": "*",
              },
            },
          },
          {
            Sid: "DenyCreateAPIUser",
            Effect: "Deny",
            Action: "redshift:CreateClusterUser",
            Resource: ["arn:aws:redshift:*:*:dbuser:*/*"],
          },
          {
            Sid: "ServiceLinkedRole",
            Effect: "Allow",
            Action: "iam:CreateServiceLinkedRole",
            Resource:
              "arn:aws:iam::*:role/aws-service-role/redshift-data.amazonaws.com/AWSServiceRoleForRedshift",
            Condition: {
              StringLike: {
                "iam:AWSServiceName": "redshift-data.amazonaws.com",
              },
            },
          },
        ],
      },
      Path: "/",
    }),
  },
  {
    type: "Cluster",
    group: "Redshift",
    properties: ({}) => ({
      ClusterIdentifier: "redshift-cluster-1",
      NodeType: "dc2.large",
      MasterUsername: "awsuser",
      DBName: "dev",
      ClusterParameterGroups: [
        {
          ParameterGroupName: "default.redshift-1.0",
        },
      ],
      ClusterSubnetGroupName: "default",
      PreferredMaintenanceWindow: "mon:07:00-mon:07:30",
      EnhancedVpcRouting: false,
      ClusterType: "single-node",
      MasterUserPassword: process.env.REDSHIFT_CLUSTER_1_MASTER_USER_PASSWORD,
    }),
    dependencies: ({}) => ({
      vpcSecurityGroups: ["sg::vpc-default::default"],
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: "gc-appflow-redshift",
      Policy: {
        Version: "2008-10-17",
        Statement: [
          {
            Sid: "AllowAppFlowSourceActions",
            Effect: "Allow",
            Principal: {
              Service: "appflow.amazonaws.com",
            },
            Action: ["s3:ListBucket", "s3:GetObject"],
            Resource: [
              "arn:aws:s3:::gc-appflow-redshift",
              "arn:aws:s3:::gc-appflow-redshift/*",
            ],
            Condition: {
              StringEquals: {
                "aws:SourceAccount": `${config.accountId()}`,
              },
            },
          },
          {
            Sid: "AllowAppFlowDestinationActions",
            Effect: "Allow",
            Principal: {
              Service: "appflow.amazonaws.com",
            },
            Action: [
              "s3:PutObject",
              "s3:AbortMultipartUpload",
              "s3:ListMultipartUploadParts",
              "s3:ListBucketMultipartUploads",
              "s3:GetBucketAcl",
              "s3:PutObjectAcl",
            ],
            Resource: [
              "arn:aws:s3:::gc-appflow-redshift",
              "arn:aws:s3:::gc-appflow-redshift/*",
            ],
            Condition: {
              StringEquals: {
                "aws:SourceAccount": `${config.accountId()}`,
              },
            },
          },
        ],
      },
    }),
  },
];
