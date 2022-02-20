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

## List

```sh
gc list -t S3::Object
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌──────────────────────────────────────────────────────────────┐
│ 1 S3::Object from aws                                        │
├──────────────────────────────────────────────────────────────┤
│ name: grucloud-simple-file-test                              │
│ managedByUs: Yes                                             │
│ live:                                                        │
│   Bucket: grucloud-simple-bucket                             │
│   Key: grucloud-simple-file-test                             │
│   AcceptRanges: bytes                                        │
│   LastModified: 2022-02-20T05:06:50.000Z                     │
│   ContentLength: 514                                         │
│   ETag: "68f33a6776c922dea487af22664ce7cf"                   │
│   ContentType: text/plain                                    │
│   ServerSideEncryption: AES256                               │
│   Metadata:                                                  │
│     md5hash: aPM6Z3bJIt6kh68iZkznzw==                        │
│   signedUrl: https://grucloud-simple-bucket.s3.amazonaws.co… │
│   Tags:                                                      │
│     - Key: gc-created-by-provider                            │
│       Value: aws                                             │
│     - Key: gc-managed-by                                     │
│       Value: grucloud                                        │
│     - Key: gc-namespace                                      │
│       Value: My namespace                                    │
│     - Key: gc-project-name                                   │
│       Value: @grucloud/example-aws-s3-simple                 │
│     - Key: gc-stage                                          │
│       Value: dev                                             │
│     - Key: Key1                                              │
│       Value: Value1                                          │
│     - Key: Key2                                              │
│       Value: Value2                                          │
│   ACL:                                                       │
│     Grants:                                                  │
│       - Grantee:                                             │
│           DisplayName: frederic.heem                         │
│           ID: b157b67b4c277b4513d6733cca65598e1394dbe399994… │
│           Type: CanonicalUser                                │
│         Permission: FULL_CONTROL                             │
│       - Grantee:                                             │
│           Type: Group                                        │
│           URI: http://acs.amazonaws.com/groups/global/AllUs… │
│         Permission: READ                                     │
│     Owner:                                                   │
│       DisplayName: frederic.heem                             │
│       ID: b157b67b4c277b4513d6733cca65598e1394dbe399994ea18… │
│                                                              │
└──────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────┐
│ aws                                                         │
├────────────┬────────────────────────────────────────────────┤
│ S3::Object │ grucloud-simple-file-test                      │
└────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t S3::Object" executed in 5s
```
