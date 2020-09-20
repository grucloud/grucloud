---
id: S3Object
title: S3 Object
---

Manages a [S3 Object](https://docs.aws.amazon.com/s3/index.html)

## Bucket Attributes

### Basic

```js
const s3Bucket = await provider.makeS3Bucket({
  name: `myBucket`,
  properties: () => ({}),
});

const s3Object = await provider.makeS3Object({
  name: `file-test`,
  dependencies: { bucket: s3Bucket },
  properties: () => ({
    ACL: "public-read",
    ContentType: "text/plain",
    ServerSideEncryption: "AES256",
    Tagging: "key1=value1&key2=value2",
    source: path.join(process.cwd(), "examples/aws/s3/fixtures/testFile.txt"),
  }),
});
```

## Example Code

- [simple example](https://github.com/FredericHeem/grucloud/blob/master/examples/aws/s3/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property)
