---
id: S3Object
title: S3 Object
---

Manages a [S3 Object](https://docs.aws.amazon.com/s3/index.html)

## Bucket Attributes

### Basic

```js
const s3Bucket = provider.s3.makeBucket({
  name: `myBucket`,
  properties: () => ({}),
});

const s3Object = provider.s3.makeObject({
  name: `file-test`,
  dependencies: { bucket: s3Bucket },
  properties: () => ({
    ACL: "public-read",
    ContentType: "text/plain",
    ServerSideEncryption: "AES256",
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
    source: "examples/aws/s3/fixtures/testFile.txt",
  }),
});
```

## Example Code

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/s3/s3/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property)
