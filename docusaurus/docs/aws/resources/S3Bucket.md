---
id: S3Bucket
title: S3 Bucket
---

Manages [S3 Buckets](https://docs.aws.amazon.com/s3/index.html)

## Bucket Attributes

### Basic

```js
const s3Bucket = await provider.makeS3Bucket({
  name: "yourgloballyuniquebucketnamehere",
  properties: () => ({}),
});
```

### Tags

```js
const s3Bucket = await provider.makeS3Bucket({
  name: "yourgloballyuniquebucketnamehere",
  properties: () => ({
    Tagging: {
      TagSet: [
        {
          Key: "Key1",
          Value: "Value1",
        },
        {
          Key: "Key2",
          Value: "Value2",
        },
      ],
    },
  }),
});
```

### Versioning

Enable or disable bucket versioning. See the [VersioningConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketVersioning-property)

```js
const s3Bucket = await provider.makeS3Bucket({
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

Set the S3 bucket as a website. See the
[WebsiteConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketWebsite-property) for a full list of supported options.

```js
const s3Bucket = await provider.makeS3Bucket({
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

### CORS

Set the CORS configurtion for this bucket . See the
[CORSConfiguration properties page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketCors-property) for a full list of supported options.

```js
await provider.makeS3Bucket({
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

### Logging

Enable logging of one bucket to another.

See [BucketLoggingStatus](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLogging-property) for as full list of properties.

> The destination bucket must have its _ACL_ set to _log-delivery-write_.

```js
const bucketLogDestination = `${bucketName}-log-destination`;
await provider.makeS3Bucket({
  name: bucketLogDestination,
  properties: () => ({
    ACL: "log-delivery-write",
  }),
});

await provider.makeS3Bucket({
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

## Examples Code

- [simple example](https://github.com/FredericHeem/grucloud/blob/master/examples/aws/s3/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property)

## AWS CLI

List the S3 buckets for the current account:

```
aws s3 ls
```
