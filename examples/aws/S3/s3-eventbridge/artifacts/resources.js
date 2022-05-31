// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Trail",
    group: "CloudTrail",
    name: "CloudTrailForS3ImagePushEvents",
    properties: ({ config }) => ({
      HasInsightSelectors: false,
      HomeRegion: config.region,
      IncludeGlobalServiceEvents: true,
      IsMultiRegionTrail: true,
      IsOrganizationTrail: false,
    }),
    dependencies: ({}) => ({
      bucket: "grucloud-s3-event-bridge-logs",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    name: "sam-app-S3NewImageEvent-W0968CSQOUFJ",
    properties: ({}) => ({
      Description:
        "This rule will trigger lambda when an image is uploaded into S3",
      EventPattern: {
        "detail-type": ["AWS API Call via CloudTrail"],
        source: ["aws.s3"],
        detail: {
          eventSource: ["s3.amazonaws.com"],
          requestParameters: {
            bucketName: ["grucloud-s3-event-bridge-images"],
          },
          eventName: ["PutObject", "CopyObject", "CompleteMultipartUpload"],
        },
      },
      State: "ENABLED",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "S3NewImageEvent",
    }),
    dependencies: ({}) => ({
      rule: "sam-app-S3NewImageEvent-W0968CSQOUFJ",
      sqsQueue: "sam-app-NewImageEventQueue-DGEXqRa9ZM4Z",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    name: "grucloud-s3-event-bridge-images",
    properties: ({}) => ({
      Policy: {
        Version: "2008-10-17",
        Statement: [
          {
            Effect: "Deny",
            Principal: "*",
            Action: "s3:*",
            Resource: [
              `arn:aws:s3:::grucloud-s3-event-bridge-images/*`,
              `arn:aws:s3:::grucloud-s3-event-bridge-images`,
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
    name: "grucloud-s3-event-bridge-logs",
    properties: ({ config }) => ({
      Policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "AllowHTTPSOnlyAccessToS3",
            Effect: "Deny",
            Principal: "*",
            Action: "s3:*",
            Resource: [
              `arn:aws:s3:::grucloud-s3-event-bridge-logs/*`,
              `arn:aws:s3:::grucloud-s3-event-bridge-logs`,
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
            Resource: `arn:aws:s3:::grucloud-s3-event-bridge-logs`,
          },
          {
            Sid: "AllowCloudTrailToWriteToBucket",
            Effect: "Allow",
            Principal: {
              Service: "cloudtrail.amazonaws.com",
            },
            Action: "s3:PutObject",
            Resource: `arn:aws:s3:::grucloud-s3-event-bridge-logs/AWSLogs/${config.accountId()}/*`,
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
    name: "sam-app-NewImageEventQueue-DGEXqRa9ZM4Z",
    properties: ({ config }) => ({
      Attributes: {
        Policy: {
          Version: "2008-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                Service: `events.amazonaws.com`,
              },
              Action: "SQS:SendMessage",
              Resource: `arn:aws:sqs:${
                config.region
              }:${config.accountId()}:sam-app-NewImageEventQueue-DGEXqRa9ZM4Z`,
            },
          ],
        },
      },
    }),
  },
];
