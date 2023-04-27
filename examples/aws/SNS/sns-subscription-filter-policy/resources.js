// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "/aws/kinesisfirehose/PUT-HTP-4G0uP",
    }),
  },
  {
    type: "DeliveryStream",
    group: "Firehose",
    properties: ({ config, getId }) => ({
      DeliveryStreamName: "PUT-HTP-4G0uP",
      DeliveryStreamType: "DirectPut",
      HttpEndpointDestinationConfiguration: {
        BufferingHints: {
          IntervalInSeconds: 60,
          SizeInMBs: 5,
        },
        CloudWatchLoggingOptions: {
          Enabled: true,
          LogGroupName: "/aws/kinesisfirehose/PUT-HTP-4G0uP",
          LogStreamName: "DestinationDelivery",
        },
        EndpointConfiguration: {
          Name: "HTTP endpoint",
          Url: "https://grucloud.org",
        },
        RequestConfiguration: {
          CommonAttributes: [],
          ContentEncoding: "NONE",
        },
        RetryOptions: {
          DurationInSeconds: 300,
        },
        RoleARN: `${getId({
          type: "Role",
          group: "IAM",
          name: `KinesisFirehoseServiceRole-PUT-HTP-4G0uP-${config.region}-1669418375212`,
        })}`,
        S3BackupMode: "FailedDataOnly",
        S3Configuration: {
          BucketARN: "arn:aws:s3:::gc-deliverystream-sns",
          BufferingHints: {
            IntervalInSeconds: 300,
            SizeInMBs: 5,
          },
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: "/aws/kinesisfirehose/PUT-HTP-4G0uP",
            LogStreamName: "BackupDelivery",
          },
          CompressionFormat: "UNCOMPRESSED",
          EncryptionConfiguration: {
            NoEncryptionConfig: "NoEncryption",
          },
          ErrorOutputPrefix: "",
          Prefix: "",
          RoleARN: `${getId({
            type: "Role",
            group: "IAM",
            name: `KinesisFirehoseServiceRole-PUT-HTP-4G0uP-${config.region}-1669418375212`,
          })}`,
        },
      },
    }),
    dependencies: ({ config }) => ({
      roles: [
        `KinesisFirehoseServiceRole-PUT-HTP-4G0uP-${config.region}-1669418375212`,
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: `KinesisFirehoseServicePolicy-PUT-HTP-4G0uP-${config.region}`,
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "glue:GetTable",
              "glue:GetTableVersion",
              "glue:GetTableVersions",
            ],
            Effect: "Allow",
            Resource: [
              `arn:aws:glue:${config.region}:${config.accountId()}:catalog`,
              `arn:aws:glue:${
                config.region
              }:${config.accountId()}:database/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
              `arn:aws:glue:${
                config.region
              }:${config.accountId()}:table/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
            Sid: "",
          },
          {
            Action: [
              "kafka:GetBootstrapBrokers",
              "kafka:DescribeCluster",
              "kafka:DescribeClusterV2",
              "kafka-cluster:Connect",
            ],
            Effect: "Allow",
            Resource: `arn:aws:kafka:${
              config.region
            }:${config.accountId()}:cluster/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            Sid: "",
          },
          {
            Action: [
              "kafka-cluster:DescribeTopic",
              "kafka-cluster:DescribeTopicDynamicConfiguration",
              "kafka-cluster:ReadData",
            ],
            Effect: "Allow",
            Resource: `arn:aws:kafka:${
              config.region
            }:${config.accountId()}:topic/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            Sid: "",
          },
          {
            Action: ["kafka-cluster:DescribeGroup"],
            Effect: "Allow",
            Resource: `arn:aws:kafka:${
              config.region
            }:${config.accountId()}:group/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/*`,
            Sid: "",
          },
          {
            Action: ["glue:GetSchemaByDefinition"],
            Effect: "Allow",
            Resource: [
              `arn:aws:glue:${config.region}:${config.accountId()}:registry/*`,
              `arn:aws:glue:${config.region}:${config.accountId()}:schema/*`,
            ],
            Sid: "",
          },
          {
            Action: ["glue:GetSchemaVersion"],
            Effect: "Allow",
            Resource: ["*"],
            Sid: "",
          },
          {
            Action: [
              "s3:AbortMultipartUpload",
              "s3:GetBucketLocation",
              "s3:GetObject",
              "s3:ListBucket",
              "s3:ListBucketMultipartUploads",
              "s3:PutObject",
            ],
            Effect: "Allow",
            Resource: [
              "arn:aws:s3:::gc-deliverystream-sns",
              "arn:aws:s3:::gc-deliverystream-sns/*",
            ],
            Sid: "",
          },
          {
            Action: [
              "lambda:InvokeFunction",
              "lambda:GetFunctionConfiguration",
            ],
            Effect: "Allow",
            Resource: `arn:aws:lambda:${
              config.region
            }:${config.accountId()}:function:%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            Sid: "",
          },
          {
            Action: ["kms:GenerateDataKey", "kms:Decrypt"],
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
            Effect: "Allow",
            Resource: [
              `arn:aws:kms:${
                config.region
              }:${config.accountId()}:key/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
          },
          {
            Action: ["logs:PutLogEvents"],
            Effect: "Allow",
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/kinesisfirehose/PUT-HTP-4G0uP:log-stream:*`,
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%:log-stream:*`,
            ],
            Sid: "",
          },
          {
            Action: [
              "kinesis:DescribeStream",
              "kinesis:GetShardIterator",
              "kinesis:GetRecords",
              "kinesis:ListShards",
            ],
            Effect: "Allow",
            Resource: `arn:aws:kinesis:${
              config.region
            }:${config.accountId()}:stream/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            Sid: "",
          },
          {
            Action: ["kms:Decrypt"],
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
            Effect: "Allow",
            Resource: [
              `arn:aws:kms:${
                config.region
              }:${config.accountId()}:key/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: `KinesisFirehoseServiceRole-PUT-HTP-4G0uP-${config.region}-1669418375212`,
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
      policies: [`KinesisFirehoseServicePolicy-PUT-HTP-4G0uP-${config.region}`],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "role-sns-to-firehose",
      Description: "Allows SNS to call CloudWatch Logs on your behalf.",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "sns.amazonaws.com",
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
                  "firehose:DescribeDeliveryStream",
                  "firehose:ListDeliveryStreams",
                  "firehose:ListTagsForDeliveryStream",
                  "firehose:PutRecord",
                  "firehose:PutRecordBatch",
                ],
                Resource: ["*"],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "firehose",
        },
      ],
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-deliverystream-sns",
    }),
  },
  { type: "Topic", group: "SNS", name: "my-topic" },
  {
    type: "Subscription",
    group: "SNS",
    properties: ({}) => ({
      Attributes: {
        FilterPolicy: {
          website: ["medium"],
        },
        FilterPolicyScope: "MessageAttributes",
      },
    }),
    dependencies: ({}) => ({
      snsTopic: "my-topic",
      subscriptionRole: "role-sns-to-firehose",
      firehoseDeliveryStream: "PUT-HTP-4G0uP",
    }),
  },
];
