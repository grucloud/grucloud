// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/lambda/LambdaLayerXRayStackStack-BucketNotificationsHandl-1XcDZ1JQT7M7",
  },
  {
    type: "Role",
    group: "IAM",
    name: "LambdaLayerXRayStackStack-BucketNotificationsHandl-L16QD0UXFZOK",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `lambda.amazonaws.com`,
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
                Action: "s3:PutBucketNotification",
                Resource: `*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName:
            "BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleDefaultPolicy2CF63D36",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "LambdaLayerXRayStackStack-Lambdarole1548FC71-4BIZWD58MRGT",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `lambda.amazonaws.com`,
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
                Action: "s3:GetObject",
                Resource: `arn:aws:s3:::paperino-thumbnail-upload-372/*`,
                Effect: "Allow",
              },
              {
                Action: "s3:PutObject",
                Resource: `arn:aws:s3:::paperino-thumbnail-upload-372-resized/*`,
                Effect: "Allow",
              },
              {
                Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
                Resource: `*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "LambdaroleDefaultPolicy289CE39D",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSXrayWriteOnlyAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AWSXrayWriteOnlyAccess",
        },
        {
          PolicyName: "AmazonS3ReadOnlyAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess",
        },
      ],
    }),
  },
  {
    type: "Layer",
    group: "Lambda",
    name: "xraylayerF67027DB",
    properties: ({}) => ({
      LayerName: "xraylayerF67027DB",
      Description: "Lambda Layer containing Xray SDK Python Library",
      CompatibleRuntimes: ["python3.7", "python3.8"],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "LambdaLayerXRayStackStack-BucketNotificationsHandl-1XcDZ1JQT7M7",
    properties: ({}) => ({
      Configuration: {
        Description:
          'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)',
        Handler: "index.handler",
        Runtime: "python3.7",
        Timeout: 300,
      },
    }),
    dependencies: () => ({
      role: "LambdaLayerXRayStackStack-BucketNotificationsHandl-L16QD0UXFZOK",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "xray-handler",
    properties: ({}) => ({
      Configuration: {
        Handler: "lambda-handler.lambda_handler",
        Runtime: "python3.8",
        TracingConfig: {
          Mode: "Active",
        },
      },
    }),
    dependencies: () => ({
      layers: ["xraylayerF67027DB"],
      role: "LambdaLayerXRayStackStack-Lambdarole1548FC71-4BIZWD58MRGT",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    name: "paperino-thumbnail-upload-372",
    properties: ({ config }) => ({
      NotificationConfiguration: {
        LambdaFunctionConfigurations: [
          {
            Id: "ZDFhNTQ1NWItMDI1My00MjFjLTg3OTEtNmEwZTc4NjhiZmM5",
            LambdaFunctionArn: `arn:aws:lambda:${
              config.region
            }:${config.accountId()}:function:xray-handler`,
            Events: ["s3:ObjectCreated:Put"],
          },
        ],
      },
    }),
    dependencies: () => ({
      lambdaFunction: "xray-handler",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    name: "paperino-thumbnail-upload-372-resized",
  },
];
