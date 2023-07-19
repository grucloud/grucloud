---
id: Bucket
title: Bucket
---

Manages [S3 Buckets](https://docs.aws.amazon.com/s3/index.html)

## Bucket Attributes

### Basic

```js
exports.createResources = () => [
  { type: "Bucket", group: "S3", name: "yourgloballyuniquebucketnamehere" },
];
```

### Acceleration

Enable or disable the bucket acceleration.

See the [AccelerateConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putbucketaccelerateconfigurationcommandinput.html)

```js
exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: "yourgloballyuniquebucketnamehere",
      AccelerateConfiguration: {
        Status: "Enabled",
      },
    }),
  },
];
```

### CORS

Set the CORS configuration for this bucket.

See the
[CORSConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putbucketcorscommandinput.html) for a full list of supported options.

```js
exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: "yourgloballyuniquebucketnamehere",
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["Authorization"],
            AllowedMethods: ["GET"],
            AllowedOrigins: ["*"],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    }),
  },
];
```

### Encryption

Set the encryption configuration for this bucket.

See the
[ServerSideEncryptionConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putbucketencryptioncommandinput.html) for a full list of supported options.

```js
exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: "yourgloballyuniquebucketnamehere",
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
    }),
  },
];
```

### Lifecycle

Enable or disable the bucket lifecycle.

See the [LifecycleConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putbucketlifecycleconfigurationcommandinput.html)

```js
exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: "yourgloballyuniquebucketnamehere",
      LifecycleConfiguration: {
        Rules: [
          {
            Expiration: {
              Days: 3650,
            },
            Filter: {
              Prefix: "documents/",
            },
            ID: "TestOnly",
            Status: "Enabled",
            Transitions: [
              {
                Days: 365,
                StorageClass: "GLACIER",
              },
            ],
          },
        ],
      },
    }),
  },
];
```

### Logging

Enable logging of one bucket to another.

See [BucketLoggingStatus](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putbucketloggingcommandinput.html) for as full list of properties.

> The destination bucket must have its _ACL_ set to _log-delivery-write_.

```js
const bucketLogDestination = `yourgloballyuniquebucketnamehere-log-destination`;

exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: bucketLogDestination,
      ACL: "log-delivery-write",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: "yourgloballyuniquebucketnamehere",
      BucketLoggingStatus: {
        LoggingEnabled: {
          TargetBucket: bucketLogDestination,
          TargetPrefix: "MyBucketLogs/",
          TargetGrants: [
            {
              Grantee: {
                Type: "Group",
                URI: "http://acs.amazonaws.com/groups/global/AllUsers",
              },
              Permission: "READ",
            },
          ],
        },
      },
    }),
  },
];
```

### Notification

Set the notification configuration for this bucket.

See the
[NotificationConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putbucketnotificationconfigurationcommandinput.html) for a full list of supported options.

#### Notification for SNS

```js
const topicId = "123456789012";

exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: "yourgloballyuniquebucketnamehere",
      NotificationConfiguration: {
        TopicConfigurations: [
          {
            Events: ["s3:ObjectCreated:*"],
            TopicArn: `arn:aws:sns:us-west-2:${topicId}:s3-notification-topic`,
          },
        ],
      },
    }),
  },
];
```

#### Notification for Lambda Function

```js
const bucketName = "yourgloballyuniquebucketnamehere";
const lambdaFunctionArn = "123456789012";

exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: "yourgloballyuniquebucketnamehere",
      NotificationConfiguration: {
        LambdaFunctionConfigurations: [
          {
            Events: ["s3:ObjectCreated"],
            LambdaFunctionArn,
          },
        ],
      },
    }),
  },
];
```

### Policy

Set the policy configuration for this bucket.

See the
[Policy properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putbucketpolicycommandinput.html) for a full list of supported options.

```js
const bucketName = "yourgloballyuniquebucketnamehere";

exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: bucketName,
      Policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "IPAllow",
            Effect: "Deny",
            Principal: "*",
            Action: "s3:*",
            Resource: `arn:aws:s3:::${bucketName}/*`,
            Condition: {
              IpAddress: { "aws:SourceIp": "8.8.8.8/32" },
            },
          },
        ],
      },
    }),
  },
];
```

### Replication

Set the replication configuration for this bucket.

See the
[ReplicationConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putbucketreplicationcommandinput.html) for a full list of supported options.

```js
const bucketName = "yourgloballyuniquebucketnamehere";
const iamUser = "1233445";

exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: bucketName,
      ReplicationConfiguration: {
        Role: `arn:aws:iam::${iamUser}:role/examplerole`,
        Rules: [
          {
            Destination: {
              Bucket: "arn:aws:s3:::destinationbucket",
              StorageClass: "STANDARD",
            },
            Prefix: "",
            Status: "Enabled",
          },
        ],
      },
    }),
  },
];
```

### Request Payment

Set the request payment option for this bucket.

See the
[RequestPaymentConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putbucketrequestpaymentcommandinput.html) for a full list of supported options.

```js
exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",

    properties: () => ({
      Name: bucketName,
      RequestPaymentConfiguration: { Payer: "Requester" },
    }),
  },
];
```

### Tags

Set bucket tags.

```js
exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: bucketName,
      Tags: [
        {
          Key: "Key1",
          Value: "Value1",
        },
        {
          Key: "Key2",
          Value: "Value2",
        },
      ],
    }),
  },
];
```

### Versioning

Enable or disable the bucket versioning.

See the [VersioningConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putbucketversioningcommandinput.html)

```js
exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: bucketName,
      VersioningConfiguration: {
        MFADelete: "Disabled",
        Status: "Enabled",
      },
    }),
  },
];
```

### Static Website

Set the S3 bucket as a website.

See the
[WebsiteConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putbucketwebsitecommandinput.html) for a full list of supported options.

```js
exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: () => ({
      Name: bucketName,
      ACL: "public-read",
      WebsiteConfiguration: {
        ErrorDocument: {
          Key: "error.html",
        },
        IndexDocument: {
          Suffix: "index.html",
        },
      },
    }),
  },
];
```

## Examples Code

- [S3 simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/S3/s3/)
- [CodePipeline code-pipeline-ecr](https://github.com/grucloud/grucloud/tree/main/examples/aws/CodePipeline/code-pipeline-ecr)
- [CloudTrail simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudTrail/cloudtrail-simple)

## Properties

- [CreateBucketCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/createbucketcommandinput.html)

## Dependencies

- [Lambda Function](../Lambda/Function.md)
- [SNS Topic](../SNS/Topic.md)

## Used By

- [Backup Report Plan](../Backup/ReportPlan.md)
- [CloudFront Distribution](../CloudFront/Distribution.md)
- [CloudFront Origin Access Identity](../CloudFront/OriginAccessIdentity.md)
- [CloudFront Distribution](../CloudFront/Distribution.md)
- [CloudTrail Trail](../CloudTrail/Trail.md)
- [CodePipeline Pipeline](../CodePipeline/Pipeline.md)
- [Config Delivery Channel](../Config/DeliveryChannel.md)
- [Config Conformance Pack](../Config/ConformancePack.md)
- [EC2 Flow Logs](../EC2/FlowLogs.md)
- [GlobalAccelerator Accelerator](../GlobalAccelerator/Accelerator.md)
- [Lambda Function](../Lambda/Function.md)
- [MQ Broker](../MQ/Broker.md)
- [MSK ClusterV2](../MSK/ClusterV2.md)
- [NetworkFirewall Logging Configuration](../NetworkFirewall/LoggingConfiguration.md)

## List

```sh
gc l -t S3::Bucket
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 9 S3::Bucket from aws                                                     │
├───────────────────────────────────────────────────────────────────────────┤
│ name: grucloud-cors                                                       │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: grucloud-cors                                                     │
│   CreationDate: 2022-08-05T22:42:49.000Z                                  │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: @grucloud/example-aws-s3                                     │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: grucloud-cors                                                │
│   CORSConfiguration:                                                      │
│     CORSRules:                                                            │
│       -                                                                   │
│         AllowedHeaders:                                                   │
│           - "Authorization"                                               │
│         AllowedMethods:                                                   │
│           - "GET"                                                         │
│         AllowedOrigins:                                                   │
│           - "*"                                                           │
│         MaxAgeSeconds: 3000                                               │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: grucloud-encryption                                                 │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: grucloud-encryption                                               │
│   CreationDate: 2022-08-05T22:42:49.000Z                                  │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: @grucloud/example-aws-s3                                     │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: grucloud-encryption                                          │
│   ServerSideEncryptionConfiguration:                                      │
│     Rules:                                                                │
│       - ApplyServerSideEncryptionByDefault:                               │
│           SSEAlgorithm: AES256                                            │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: grucloud-lifecycleconfiguration                                     │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: grucloud-lifecycleconfiguration                                   │
│   CreationDate: 2022-08-05T22:42:49.000Z                                  │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: @grucloud/example-aws-s3                                     │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: grucloud-lifecycleconfiguration                              │
│   LifecycleConfiguration:                                                 │
│     Rules:                                                                │
│       - Expiration:                                                       │
│           Days: 3650                                                      │
│         ID: TestOnly                                                      │
│         Filter:                                                           │
│           Prefix: documents/                                              │
│         Status: Enabled                                                   │
│         Transitions:                                                      │
│           -                                                               │
│             Days: 365                                                     │
│             StorageClass: GLACIER                                         │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: grucloud-log-destination                                            │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: grucloud-log-destination                                          │
│   CreationDate: 2022-08-05T22:42:49.000Z                                  │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: @grucloud/example-aws-s3                                     │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: grucloud-log-destination                                     │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: grucloud-policy                                                     │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: grucloud-policy                                                   │
│   CreationDate: 2022-08-05T22:42:49.000Z                                  │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: @grucloud/example-aws-s3                                     │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: grucloud-policy                                              │
│   Policy:                                                                 │
│     Version: 2012-10-17                                                   │
│     Statement:                                                            │
│       - Sid: IPAllow                                                      │
│         Effect: Deny                                                      │
│         Principal: *                                                      │
│         Action: s3:*                                                      │
│         Resource: arn:aws:s3:::grucloud-policy/*                          │
│         Condition:                                                        │
│           IpAddress:                                                      │
│             aws:SourceIp: 8.8.8.8/32                                      │
│   PolicyStatus:                                                           │
│     IsPublic: false                                                       │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: grucloud-request-payment                                            │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: grucloud-request-payment                                          │
│   CreationDate: 2022-08-05T22:42:49.000Z                                  │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: @grucloud/example-aws-s3                                     │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: grucloud-request-payment                                     │
│   RequestPaymentConfiguration:                                            │
│     Payer: Requester                                                      │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: grucloud-tag                                                        │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: grucloud-tag                                                      │
│   CreationDate: 2022-08-05T22:42:49.000Z                                  │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: @grucloud/example-aws-s3                                     │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Key1                                                           │
│       Value: Value1                                                       │
│     - Key: Key2                                                           │
│       Value: Value2                                                       │
│     - Key: Name                                                           │
│       Value: grucloud-tag                                                 │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: grucloud-test-basic.txt                                             │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: grucloud-test-basic.txt                                           │
│   CreationDate: 2022-08-05T22:42:49.000Z                                  │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: @grucloud/example-aws-s3                                     │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: grucloud-test-basic.txt                                      │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: grucloud-website                                                    │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: grucloud-website                                                  │
│   CreationDate: 2022-08-05T22:42:49.000Z                                  │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: @grucloud/example-aws-s3                                     │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: grucloud-website                                             │
│   WebsiteConfiguration:                                                   │
│     ErrorDocument:                                                        │
│       Key: error.html                                                     │
│     IndexDocument:                                                        │
│       Suffix: index.html                                                  │
│   ACL: public-read                                                        │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├────────────┬─────────────────────────────────────────────────────────────┤
│ S3::Bucket │ grucloud-cors                                               │
│            │ grucloud-encryption                                         │
│            │ grucloud-lifecycleconfiguration                             │
│            │ grucloud-log-destination                                    │
│            │ grucloud-policy                                             │
│            │ grucloud-request-payment                                    │
│            │ grucloud-tag                                                │
│            │ grucloud-test-basic.txt                                     │
│            │ grucloud-website                                            │
└────────────┴─────────────────────────────────────────────────────────────┘
9 resources, 1 type, 1 provider
Command "gc l -t Bucket" executed in 17s, 97 MB
```

## AWS CLI

List the S3 buckets for the current account:

```
aws s3 ls
```

Remove the bucket and all its content:

```
aws s3 rb --force s3://yourbucketnamehere
```
