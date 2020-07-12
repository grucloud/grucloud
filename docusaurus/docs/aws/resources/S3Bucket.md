---
id: S3Bucket
title: S3 Bucket
---

Manages [S3 Buckets](https://docs.aws.amazon.com/s3/index.html)

```js
const s3Bucket = await provider.makeS3Bucket({
  name: "yourgloballyuniquebucketnamehere",
  properties: () => ({
    ACL: "private",
  }),
});
```

### Examples

- [simple example](https://github.com/FredericHeem/grucloud/blob/master/examples/aws/s3/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property)

### AWS CLI

List the S3 buckets for the current account:

```
aws s3 ls
```
