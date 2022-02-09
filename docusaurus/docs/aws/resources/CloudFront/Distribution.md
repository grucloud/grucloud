---
id: Distribution
title: Distribution
---

Provides a Cloud Front distribution.

## CloudFront with a S3 bucket as origin

```js
exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    name: "dev.cloudfront.aws.test.grucloud.org",
  },
  {
    type: "Distribution",
    group: "CloudFront",
    name: "distribution-cloudfront.aws.test.grucloud.org-dev",
    properties: ({}) => ({
      PriceClass: "PriceClass_100",
      Aliases: {
        Quantity: 1,
        Items: ["dev.cloudfront.aws.test.grucloud.org"],
      },
      DefaultRootObject: "index.html",
      DefaultCacheBehavior: {
        TargetOriginId: "S3-cloudfront.aws.test.grucloud.org-dev",
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
        Compress: false,
        LambdaFunctionAssociations: {
          Quantity: 0,
          Items: [],
        },
        FunctionAssociations: {
          Quantity: 0,
          Items: [],
        },
        FieldLevelEncryptionId: "",
        ForwardedValues: {
          QueryString: false,
          Cookies: {
            Forward: "none",
          },
          Headers: {
            Quantity: 0,
            Items: [],
          },
          QueryStringCacheKeys: {
            Quantity: 0,
            Items: [],
          },
        },
        MinTTL: 600,
        DefaultTTL: 86400,
        MaxTTL: 31536000,
      },
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: "S3-cloudfront.aws.test.grucloud.org-dev",
            DomainName: "cloudfront.aws.test.grucloud.org-dev.s3.amazonaws.com",
            OriginPath: "",
            CustomHeaders: {
              Quantity: 0,
              Items: [],
            },
            S3OriginConfig: {
              OriginAccessIdentity: "",
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
      Comment: "cloudfront.aws.test.grucloud.org-dev.s3.amazonaws.com",
      Logging: {
        Enabled: false,
        IncludeCookies: false,
        Bucket: "",
        Prefix: "",
      },
    }),
    dependencies: () => ({
      bucket: "cloudfront.aws.test.grucloud.org-dev",
      certificate: "dev.cloudfront.aws.test.grucloud.org",
    }),
  },
];
```

### Examples

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createDistributionWithTags-property)

### Cache Invalidation

When some S3 objects are updated during the _gc apply_ command, a [_createInvalidation_](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createInvalidation-property) call is made to invalide the cache to make sure the new version is available to the node edges.

### Dependencies

- [S3Bucket](../S3/Bucket.md)
- [Certificate](../ACM/Certificate.md)
