// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "/aws/kinesisfirehose/delivery-stream-s3",
    }),
  },
  {
    type: "DeliveryStream",
    group: "Firehose",
    properties: ({ config, getId }) => ({
      DeliveryStreamName: "delivery-stream-s3",
      DeliveryStreamType: "DirectPut",
      ExtendedS3DestinationConfiguration: {
        BucketARN: "arn:aws:s3:::gc-firehose-destination",
        BufferingHints: {
          IntervalInSeconds: 300,
          SizeInMBs: 5,
        },
        CloudWatchLoggingOptions: {
          Enabled: true,
          LogGroupName: "/aws/kinesisfirehose/delivery-stream-s3",
          LogStreamName: "DestinationDelivery",
        },
        CompressionFormat: "UNCOMPRESSED",
        DataFormatConversionConfiguration: {
          Enabled: false,
        },
        EncryptionConfiguration: {
          NoEncryptionConfig: "NoEncryption",
        },
        ErrorOutputPrefix: "",
        Prefix: "",
        RoleARN: `${getId({
          type: "Role",
          group: "IAM",
          name: `KinesisFirehoseServiceRole-delivery-stre-${config.region}-1667077117902`,
        })}`,
        S3BackupMode: "Disabled",
      },
    }),
    dependencies: ({ config }) => ({
      s3BucketDestination: "gc-firehose-destination",
      roles: [
        `KinesisFirehoseServiceRole-delivery-stre-${config.region}-1667077117902`,
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: `KinesisFirehoseServiceRole-delivery-stre-${config.region}-1667077117902`,
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "firehose.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({ config }) => ({
      policies: [
        `KinesisFirehoseServicePolicy-delivery-stream-s3-${config.region}`,
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: `KinesisFirehoseServicePolicy-delivery-stream-s3-${config.region}`,
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "glue:GetTable",
              "glue:GetTableVersion",
              "glue:GetTableVersions",
            ],
            Resource: [
              `arn:aws:glue:${config.region}:${config.accountId()}:catalog`,
              `arn:aws:glue:${
                config.region
              }:${config.accountId()}:database/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
              `arn:aws:glue:${
                config.region
              }:${config.accountId()}:table/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "s3:AbortMultipartUpload",
              "s3:GetBucketLocation",
              "s3:GetObject",
              "s3:ListBucket",
              "s3:ListBucketMultipartUploads",
              "s3:PutObject",
            ],
            Resource: [
              "arn:aws:s3:::gc-firehose-destination",
              "arn:aws:s3:::gc-firehose-destination/*",
            ],
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "lambda:InvokeFunction",
              "lambda:GetFunctionConfiguration",
            ],
            Resource: `arn:aws:lambda:${
              config.region
            }:${config.accountId()}:function:%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
          },
          {
            Effect: "Allow",
            Action: ["kms:GenerateDataKey", "kms:Decrypt"],
            Resource: [
              `arn:aws:kms:${
                config.region
              }:${config.accountId()}:key/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
            Condition: {
              StringEquals: {
                "kms:ViaService": `s3.${config.region}.amazonaws.com`,
              },
              StringLike: {
                "kms:EncryptionContext:aws:s3:arn": [
                  "arn:aws:s3:::%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/*",
                  "arn:aws:s3:::%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%",
                ],
              },
            },
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: ["logs:PutLogEvents"],
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/kinesisfirehose/delivery-stream-s3:log-stream:*`,
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%:log-stream:*`,
            ],
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "kinesis:DescribeStream",
              "kinesis:GetShardIterator",
              "kinesis:GetRecords",
              "kinesis:ListShards",
            ],
            Resource: `arn:aws:kinesis:${
              config.region
            }:${config.accountId()}:stream/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
          },
          {
            Effect: "Allow",
            Action: ["kms:Decrypt"],
            Resource: [
              `arn:aws:kms:${
                config.region
              }:${config.accountId()}:key/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
            Condition: {
              StringEquals: {
                "kms:ViaService": `kinesis.${config.region}.amazonaws.com`,
              },
              StringLike: {
                "kms:EncryptionContext:aws:kinesis:arn": `arn:aws:kinesis:${
                  config.region
                }:${config.accountId()}:stream/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
              },
            },
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-firehose-destination",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-firehose-error",
    }),
  },
];
