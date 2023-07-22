---
id: OriginAccessIdentity
title: Origin Access Identity
---

Provides a Cloud Front Origin Access Identity.

## Origin Access Identity example

```js
exports.createResources = () => [
  {
    type: "OriginAccessIdentity",
    group: "CloudFront",
    name: "access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.com",
  },
];
```

## Examples

- [cloudfront distribution with origin access identity](https://github.com/grucloud/grucloud/blob/main/examples/aws/CloudFront/cloudfront-distribution/resources.js)

### Properties

- [CreateCloudFrontOriginAccessIdentityCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudfront/interfaces/createcloudfrontoriginaccessidentitycommandinput.html)

## Used By

- [CloudFront Distribution](./Distribution.md)
- [S3 Bucket](../S3/Bucket.md)

## List

List only the origin access identity with the `OriginAccessIdentity` type:

```sh
gc list -t OriginAccessIdentity
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 2 CloudFront::OriginAccessIdentity from aws                                       │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.com     │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   Id: E28BR2NCM61ACC                                                              │
│   S3CanonicalUserId: 150ac3256f69b06608714032dad52eb86811e42a3190b86e4c708a5f3d3… │
│   Comment: access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.c… │
│                                                                                   │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.com     │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   Id: E2D1PSO5NWDAJ5                                                              │
│   S3CanonicalUserId: c52dc3a79c25203c847580ea5aad220c68fc6b263d7365971e7bf020799… │
│   Comment: access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.c… │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├──────────────────────────────────┬───────────────────────────────────────────────┤
│ CloudFront::OriginAccessIdentity │ access-identity-cloudfront-demo.grucloud.org… │
│                                  │ access-identity-cloudfront-demo.grucloud.org… │
└──────────────────────────────────┴───────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t OriginAccessIdentity" executed in 2s
```
