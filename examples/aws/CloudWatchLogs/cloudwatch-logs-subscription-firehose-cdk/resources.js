// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName:
        "CloudwatchLogsSubscriptionFirehoseCdkStack-MyLogGroup5C0DAD85-N6jOuDKdriqE",
      retentionInDays: 1,
    }),
  },
  {
    type: "SubscriptionFilter",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      distribution: "ByLogStream",
      filterName:
        "CloudwatchLogsSubscriptionFirehoseCdkStack-LogGroupSubscription-ejZpJfE1xHF9",
      filterPattern: "ERROR WARNING",
    }),
    dependencies: ({}) => ({
      cloudWatchLogGroup:
        "CloudwatchLogsSubscriptionFirehoseCdkStack-MyLogGroup5C0DAD85-N6jOuDKdriqE",
      role: "CloudwatchLogsSubscriptio-cwlogIngestionRoleBB48AA-1K8S821BZ8SSU",
      firehoseStream:
        "CloudwatchLogsSubscriptionFirehoseCdkStack-Firehose-Xn729ljrtKfj",
    }),
  },
  {
    type: "DeliveryStream",
    group: "Firehose",
    properties: ({ getId }) => ({
      DeliveryStreamName:
        "CloudwatchLogsSubscriptionFirehoseCdkStack-Firehose-Xn729ljrtKfj",
      DeliveryStreamType: "DirectPut",
      ExtendedS3DestinationConfiguration: {
        BucketARN:
          "arn:aws:s3:::cloudwatchlogssubscriptionfi-mylogsbucket57652dd1-5m0kw1cg40sd",
        BufferingHints: {
          IntervalInSeconds: 60,
          SizeInMBs: 1,
        },
        CompressionFormat: "UNCOMPRESSED",
        EncryptionConfiguration: {
          NoEncryptionConfig: "NoEncryption",
        },
        RoleARN: `${getId({
          type: "Role",
          group: "IAM",
          name: "CloudwatchLogsSubscription-DestinationRole715116B2-BPSLVTF4PWUW",
        })}`,
        S3BackupMode: "Disabled",
      },
    }),
    dependencies: ({}) => ({
      s3BucketDestination:
        "cloudwatchlogssubscriptionfi-mylogsbucket57652dd1-5m0kw1cg40sd",
      roles: [
        "CloudwatchLogsSubscription-DestinationRole715116B2-BPSLVTF4PWUW",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "CloudwatchLogsSubscriptio-cwlogIngestionRoleBB48AA-1K8S821BZ8SSU",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `logs.${config.region}.amazonaws.com`,
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
                Action: "firehose:*",
                Resource: `arn:aws:firehose:${
                  config.region
                }:${config.accountId()}:*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "putLogsPermissionB6C482B2",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "CloudwatchLogsSubscription-DestinationRole715116B2-BPSLVTF4PWUW",
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
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "s3:AbortMultipartUpload",
                  "s3:GetBucketLocation",
                  "s3:GetObject",
                  "s3:ListBucket",
                  "s3:ListBucketMultipartUploads",
                  "s3:PutObject",
                ],
                Resource: [
                  "arn:aws:s3:::cloudwatchlogssubscriptionfi-mylogsbucket57652dd1-5m0kw1cg40sd",
                  "arn:aws:s3:::cloudwatchlogssubscriptionfi-mylogsbucket57652dd1-5m0kw1cg40sd/*",
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "S3Permission2758DE19",
        },
      ],
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "cloudwatchlogssubscriptionfi-mylogsbucket57652dd1-5m0kw1cg40sd",
    }),
  },
];
