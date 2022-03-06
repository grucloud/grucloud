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

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/resources.js)

- [cloudfront distribution with origin access identity](https://github.com/grucloud/grucloud/blob/main/examples/aws/CloudFront/cloudfront-distribution/resources.js)

### Properties

- [CreateDistributionWithTagsCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudfront/interfaces/createdistributionwithtagscommandinput.html)

### Cache Invalidation

When some S3 objects are updated during the _gc apply_ command, a [_createInvalidation_](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createInvalidation-property) call is made to invalide the cache to make sure the new version is available to the node edges.

### Dependencies

- [S3 Bucket](../S3/Bucket.md)
- [Certificate](../ACM/Certificate.md)
- [OriginAccessIdentity](./OriginAccessIdentity.md)
