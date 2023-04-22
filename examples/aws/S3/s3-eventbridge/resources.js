// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Trail",
    group: "CloudTrail",
    properties: ({ config }) => ({
      EventSelectors: [
        {
          DataResources: [
            {
              Type: "AWS::S3::Object",
              Values: ["arn:aws:s3:::gc-s3-eventbridge/"],
            },
          ],
          ExcludeManagementEventSources: [],
          IncludeManagementEvents: true,
          ReadWriteType: "WriteOnly",
        },
      ],
      HomeRegion: config.region,
      IncludeGlobalServiceEvents: true,
      IsMultiRegionTrail: true,
      IsOrganizationTrail: false,
      Name: "CloudTrailForS3ImagePushEvents",
    }),
    dependencies: ({}) => ({
      bucket: "gc-s3-eventbridge-cloudtrail",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description:
        "This rule will trigger lambda when an image is uploaded into S3",
      EventPattern: {
        "detail-type": ["AWS API Call via CloudTrail"],
        source: ["aws.s3"],
        detail: {
          eventSource: ["s3.amazonaws.com"],
          requestParameters: {
            bucketName: ["gc-s3-eventbridge"],
          },
          eventName: ["PutObject", "CopyObject", "CompleteMultipartUpload"],
        },
      },
      Name: "sam-app-S3NewImageEvent-WQBVMJ27U1IW",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "S3NewImageEvent",
    }),
    dependencies: ({}) => ({
      rule: "sam-app-S3NewImageEvent-WQBVMJ27U1IW",
      sqsQueue: "sam-app-NewImageEventQueue-xg4G9e9EBenI",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-s3-eventbridge",
      Policy: {
        Version: "2008-10-17",
        Statement: [
          {
            Effect: "Deny",
            Principal: "*",
            Action: "s3:*",
            Resource: [
              "arn:aws:s3:::gc-s3-eventbridge/*",
              "arn:aws:s3:::gc-s3-eventbridge",
            ],
            Condition: {
              Bool: {
                "aws:SecureTransport": "false",
              },
            },
          },
        ],
      },
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: "gc-s3-eventbridge-cloudtrail",
      Policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "AllowHTTPSOnlyAccessToS3",
            Effect: "Deny",
            Principal: "*",
            Action: "s3:*",
            Resource: [
              "arn:aws:s3:::gc-s3-eventbridge-cloudtrail/*",
              "arn:aws:s3:::gc-s3-eventbridge-cloudtrail",
            ],
            Condition: {
              Bool: {
                "aws:SecureTransport": "false",
              },
            },
          },
          {
            Sid: "AllowCheckingForPermissionsOnCloudTrailBucket",
            Effect: "Allow",
            Principal: {
              Service: "cloudtrail.amazonaws.com",
            },
            Action: "s3:GetBucketAcl",
            Resource: "arn:aws:s3:::gc-s3-eventbridge-cloudtrail",
          },
          {
            Sid: "AllowCloudTrailToWriteToBucket",
            Effect: "Allow",
            Principal: {
              Service: "cloudtrail.amazonaws.com",
            },
            Action: "s3:PutObject",
            Resource: `arn:aws:s3:::gc-s3-eventbridge-cloudtrail/AWSLogs/${config.accountId()}/*`,
            Condition: {
              StringEquals: {
                "s3:x-amz-acl": "bucket-owner-full-control",
              },
            },
          },
        ],
      },
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({ config }) => ({
      Attributes: {
        Policy: {
          Version: "2008-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                Service: "events.amazonaws.com",
              },
              Action: "SQS:SendMessage",
              Resource: `arn:aws:sqs:${
                config.region
              }:${config.accountId()}:sam-app-NewImageEventQueue-xg4G9e9EBenI`,
            },
          ],
        },
      },
      QueueName: "sam-app-NewImageEventQueue-xg4G9e9EBenI",
    }),
  },
];
