---
id: Object
title: Object
---

Manages a [S3 Object](https://docs.aws.amazon.com/s3/index.html)

## Bucket Attributes

### Basic

```js
exports.createResources = () => [
  { type: "Bucket", group: "S3", name: "grucloud-simple-bucket" },
  {
    type: "Object",
    group: "S3",
    name: "grucloud-simple-file-test",
    properties: ({}) => ({
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
    dependencies: () => ({
      bucket: "grucloud-simple-bucket",
    }),
  },
];
```

## Example Code

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/s3/s3/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property)
