---
id: Distribution
title: Distribution
---

Provides a Cloud Front distribution.

## CloudFront with a S3 bucket as origin

```js
exports.createResources = () => [
  {
    type: "Distribution",
    group: "CloudFront",
    name: "E2P10W0URYHQV",
    properties: ({ getId }) => ({
      PriceClass: "PriceClass_100",
      Aliases: {
        Quantity: 1,
        Items: [
          getId({
            type: "Certificate",
            group: "ACM",
            name: "cloudfront-demo.grucloud.org",
            path: "name",
          }),
        ],
      },
      DefaultRootObject: "index.html",
      DefaultCacheBehavior: {
        TargetOriginId: `${getId({
          type: "Bucket",
          group: "S3",
          name: "cloudfront-demo.grucloud.org",
          path: "name",
        })}.s3.us-east-1.amazonaws.com`,
        TrustedSigners: {
          Enabled: false,
          Quantity: 0,
          Items: [],
        },
        TrustedKeyGroups: {
          Enabled: false,
          Quantity: 0,
          Items: [],
        },
        ViewerProtocolPolicy: "redirect-to-https",
        AllowedMethods: {
          Quantity: 2,
          Items: ["HEAD", "GET"],
          CachedMethods: {
            Quantity: 2,
            Items: ["HEAD", "GET"],
          },
        },
        SmoothStreaming: false,
        Compress: true,
        LambdaFunctionAssociations: {
          Quantity: 0,
          Items: [],
        },
        FunctionAssociations: {
          Quantity: 0,
          Items: [],
        },
        FieldLevelEncryptionId: "",
        CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
      },
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: `${getId({
              type: "Bucket",
              group: "S3",
              name: "cloudfront-demo.grucloud.org",
              path: "name",
            })}.s3.us-east-1.amazonaws.com`,
            DomainName: `${getId({
              type: "Bucket",
              group: "S3",
              name: "cloudfront-demo.grucloud.org",
              path: "name",
            })}.s3.us-east-1.amazonaws.com`,
            OriginPath: "",
            CustomHeaders: {
              Quantity: 0,
              Items: [],
            },
            S3OriginConfig: {
              OriginAccessIdentity: `origin-access-identity/cloudfront/${getId({
                type: "OriginAccessIdentity",
                group: "CloudFront",
                name: "access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.com",
              })}`,
            },
            ConnectionAttempts: 3,
            ConnectionTimeout: 10,
            OriginShield: {
              Enabled: false,
            },
          },
        ],
      },
      Restrictions: {
        GeoRestriction: {
          RestrictionType: "none",
          Quantity: 0,
          Items: [],
        },
      },
      Comment: "",
      Logging: {
        Enabled: false,
        IncludeCookies: false,
        Bucket: "",
        Prefix: "",
      },
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: () => ({
      buckets: ["cloudfront-demo.grucloud.org"],
      certificate: "cloudfront-demo.grucloud.org",
      originAccessIdentities: [
        "access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.com",
      ],
    }),
  },
];
```

### Examples

- [HTTPS static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/resources.js)
- [Cloudfront distribution with origin access identity](https://github.com/grucloud/grucloud/blob/main/examples/aws/CloudFront/cloudfront-distribution/resources.js)
- [WebACL with CloudFront](https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-cloudfront)

### Properties

- [CreateDistributionWithTagsCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudfront/interfaces/createdistributionwithtagscommandinput.html)

### Cache Invalidation

When some S3 objects are updated during the _gc apply_ command, a [_createInvalidation_](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createInvalidation-property) call is made to invalide the cache to make sure the new version is available to the node edges.

### Dependencies

- [S3 Bucket](../S3/Bucket.md)
- [Certificate](../ACM/Certificate.md)
- [OriginAccessIdentity](./OriginAccessIdentity.md)
- [WAFv2 WebACLCloudFront](../WAFv2/WebACLCloudFront.md)

### Used By

- [Route53 Record](../Route53/Record.md)

### List

```
gc l -t CloudFront::Distribution
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ 1 CloudFront::Distribution from aws                                                   │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ name: S3-cloudfront.aws.test.grucloud.org                                             │
│ managedByUs: Yes                                                                      │
│ live:                                                                                 │
│   CallerReference: grucloud-192515cd-c5f0-42cc-93a2-1c1b249abb11                      │
│   Aliases:                                                                            │
│     Quantity: 1                                                                       │
│     Items:                                                                            │
│       - "cloudfront.aws.test.grucloud.org"                                            │
│   DefaultRootObject: index.html                                                       │
│   Origins:                                                                            │
│     Quantity: 1                                                                       │
│     Items:                                                                            │
│       - Id: S3-cloudfront.aws.test.grucloud.org                                       │
│         DomainName: cloudfront.aws.test.grucloud.org.s3.amazonaws.com                 │
│         OriginPath:                                                                   │
│         CustomHeaders:                                                                │
│           Quantity: 0                                                                 │
│         S3OriginConfig:                                                               │
│           OriginAccessIdentity:                                                       │
│         ConnectionAttempts: 3                                                         │
│         ConnectionTimeout: 10                                                         │
│         OriginShield:                                                                 │
│           Enabled: false                                                              │
│   OriginGroups:                                                                       │
│     Quantity: 0                                                                       │
│   DefaultCacheBehavior:                                                               │
│     TargetOriginId: S3-cloudfront.aws.test.grucloud.org                               │
│     TrustedSigners:                                                                   │
│       Enabled: false                                                                  │
│       Quantity: 0                                                                     │
│     TrustedKeyGroups:                                                                 │
│       Enabled: false                                                                  │
│       Quantity: 0                                                                     │
│     ViewerProtocolPolicy: redirect-to-https                                           │
│     AllowedMethods:                                                                   │
│       Quantity: 2                                                                     │
│       Items:                                                                          │
│         - "HEAD"                                                                      │
│         - "GET"                                                                       │
│       CachedMethods:                                                                  │
│         Quantity: 2                                                                   │
│         Items:                                                                        │
│           - "HEAD"                                                                    │
│           - "GET"                                                                     │
│     SmoothStreaming: false                                                            │
│     Compress: false                                                                   │
│     LambdaFunctionAssociations:                                                       │
│       Quantity: 0                                                                     │
│     FunctionAssociations:                                                             │
│       Quantity: 0                                                                     │
│     FieldLevelEncryptionId:                                                           │
│     ForwardedValues:                                                                  │
│       QueryString: false                                                              │
│       Cookies:                                                                        │
│         Forward: none                                                                 │
│       Headers:                                                                        │
│         Quantity: 0                                                                   │
│       QueryStringCacheKeys:                                                           │
│         Quantity: 0                                                                   │
│     MinTTL: 600                                                                       │
│     DefaultTTL: 86400                                                                 │
│     MaxTTL: 31536000                                                                  │
│   CacheBehaviors:                                                                     │
│     Quantity: 0                                                                       │
│   CustomErrorResponses:                                                               │
│     Quantity: 0                                                                       │
│   Comment: cloudfront.aws.test.grucloud.org.s3.amazonaws.com                          │
│   Logging:                                                                            │
│     Enabled: false                                                                    │
│     IncludeCookies: false                                                             │
│     Bucket:                                                                           │
│     Prefix:                                                                           │
│   PriceClass: PriceClass_100                                                          │
│   Enabled: true                                                                       │
│   ViewerCertificate:                                                                  │
│     CloudFrontDefaultCertificate: false                                               │
│     ACMCertificateArn: arn:aws:acm:us-east-1:840541460064:certificate/40824773-1a98-… │
│     SSLSupportMethod: sni-only                                                        │
│     MinimumProtocolVersion: TLSv1.2_2019                                              │
│     Certificate: arn:aws:acm:us-east-1:840541460064:certificate/40824773-1a98-4f70-a… │
│     CertificateSource: acm                                                            │
│   Restrictions:                                                                       │
│     GeoRestriction:                                                                   │
│       RestrictionType: none                                                           │
│       Quantity: 0                                                                     │
│   WebACLId:                                                                           │
│   HttpVersion: http2                                                                  │
│   IsIPV6Enabled: true                                                                 │
│   Tags:                                                                               │
│     - Key: gc-created-by-provider                                                     │
│       Value: aws                                                                      │
│     - Key: gc-managed-by                                                              │
│       Value: grucloud                                                                 │
│     - Key: gc-project-name                                                            │
│       Value: @grucloud/example-aws-website-https                                      │
│     - Key: gc-stage                                                                   │
│       Value: dev                                                                      │
│     - Key: Name                                                                       │
│       Value: S3-cloudfront.aws.test.grucloud.org                                      │
│   Id: ENSP11JQNT4WY                                                                   │
│   ARN: arn:aws:cloudfront::840541460064:distribution/ENSP11JQNT4WY                    │
│   Status: Deployed                                                                    │
│   LastModifiedTime: 2022-08-05T11:28:58.586Z                                          │
│   DomainName: d2nnsefnqnrio6.cloudfront.net                                           │
│   AliasICPRecordals:                                                                  │
│     - CNAME: cloudfront.aws.test.grucloud.org                                         │
│       ICPRecordalStatus: APPROVED                                                     │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                  │
├──────────────────────────┬───────────────────────────────────────────────────────────┤
│ CloudFront::Distribution │ S3-cloudfront.aws.test.grucloud.org                       │
└──────────────────────────┴───────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CloudFront::Distribution" executed in 5s, 102 MB
```
