---
id: S3Bucket
title: S3 Bucket
---

Manages [S3 Buckets](https://docs.aws.amazon.com/s3/index.html)

## Bucket Attributes

### Basic

```js
const s3Bucket = provider.s3.makeBucket({
  name: "yourgloballyuniquebucketnamehere",
  properties: () => ({}),
});
```

### Acceleration

Enable or disable the bucket acceleration.

See the [AccelerateConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketAccelerateConfiguration-property)

```js
const s3Accelerated = provider.s3.makeBucket({
  name: `yourgloballyuniquebucketnamehere`,
  properties: () => ({
    AccelerateConfiguration: {
      Status: "Enabled",
    },
  }),
});
```

### CORS

Set the CORS configuration for this bucket.

See the
[CORSConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketCors-property) for a full list of supported options.

```js
provider.s3.makeBucket({
  name: `yourgloballyuniquebucketnamehere `,
  properties: () => ({
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
});
```

### Encryption

Set the encryption configuration for this bucket.

See the
[ServerSideEncryptionConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketEncryption-property) for a full list of supported options.

```js
const s3Encryption = provider.s3.makeBucket({
  name: `yourgloballyuniquebucketnamehere`,
  properties: () => ({
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
});
```

### Lifecycle

Enable or disable the bucket lifecycle.

See the [LifecycleConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLifecycleConfiguration-property)

```js
const s3Lifecycle = provider.s3.makeBucket({
  name: `yourgloballyuniquebucketnamehere`,
  properties: () => ({
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
});
```

### Logging

Enable logging of one bucket to another.

See [BucketLoggingStatus](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLogging-property) for as full list of properties.

> The destination bucket must have its _ACL_ set to _log-delivery-write_.

```js
const bucketLogDestination = `yourgloballyuniquebucketnamehere-log-destination`;
provider.s3.makeBucket({
  name: bucketLogDestination,
  properties: () => ({
    ACL: "log-delivery-write",
  }),
});

provider.s3.makeBucket({
  name: `${bucketName}-logged`,
  properties: () => ({
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
});
```

### Notification

Set the notification configuration for this bucket.

See the
[NotificationConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketNotificationConfiguration-property) for a full list of supported options.

#### Notification for SNS

```js
const bucketName = "yourgloballyuniquebucketnamehere";
const topicId = "123456789012";

provider.s3.makeBucket({
  name: `yourgloballyuniquebucketnamehere-notification-configuration`,
  properties: () => ({
    NotificationConfiguration: {
      TopicConfigurations: [
        {
          Events: ["s3:ObjectCreated:*"],
          TopicArn: `arn:aws:sns:us-west-2:${topicId}:s3-notification-topic`,
        },
      ],
    },
  }),
});
```

#### Notification for Lambda Function

```js
const bucketName = "yourgloballyuniquebucketnamehere";
const lambdaFunctionArn = "123456789012";

provider.s3.makeBucket({
  name: `yourgloballyuniquebucketnamehere-notification-configuration`,
  properties: () => ({
    NotificationConfiguration: {
      LambdaFunctionConfigurations: [
        {
          Events: ["s3:ObjectCreated"],
          LambdaFunctionArn,
        },
      ],
    },
  }),
});
```

### Policy

Set the policy configuration for this bucket.

See the
[Policy properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketPolicy-property) for a full list of supported options.

```js
const bucketName = "yourgloballyuniquebucketnamehere";

const s3pPolicy = provider.s3.makeBucket({
  name: bucketName,
  properties: () => ({
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
});
```

### Replication

Set the replication configuration for this bucket.

See the
[ReplicationConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketReplication-property) for a full list of supported options.

```js
const bucketName = "yourgloballyuniquebucketnamehere";
const iamUser = "1233445";

const s3Replication = provider.s3.makeBucket({
  name: bucketName,
  properties: () => ({
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
});
```

### Request Payment

Set the request payment option for this bucket.

See the
[RequestPaymentConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketRequestPayment-property) for a full list of supported options.

```js
const s3RequestPayment = provider.s3.makeBucket({
  name: `yourgloballyuniquebucketnamehere`,
  properties: () => ({
    RequestPaymentConfiguration: { Payer: "Requester" },
  }),
});
```

### Tags

Set bucket tags.

```js
const s3Bucket = provider.s3.makeBucket({
  name: "yourgloballyuniquebucketnamehere",
  properties: () => ({
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
});
```

### Versioning

Enable or disable the bucket versioning.

See the [VersioningConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketVersioning-property)

```js
const s3Bucket = provider.s3.makeBucket({
  name: "yourgloballyuniquebucketnamehere",
  properties: () => ({
    VersioningConfiguration: {
      MFADelete: "Disabled",
      Status: "Enabled",
    },
  }),
});
```

### Static Website

Set the S3 bucket as a website.

See the
[WebsiteConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketWebsite-property) for a full list of supported options.

```js
const s3Bucket = provider.s3.makeBucket({
  name: "yourgloballyuniquebucketnamehere",
  properties: () => ({
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
});
```

## Examples Code

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/s3/s3/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property)

## AWS CLI

List the S3 buckets for the current account:

```
aws s3 ls
```

Remove the bucket and all its content:

```
aws s3 rb --force s3://yourbucketnamehere
```
