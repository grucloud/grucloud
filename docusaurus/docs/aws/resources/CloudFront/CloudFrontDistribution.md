---
id: CloudFrontDistribution
title: Distribution
---

Provides a Cloud Front distribution.

## CloudFront with a S3 bucket as origin

```js
const domainName = "your.domain.name.com";

const certificate = providerUsEast.makeCertificate({
  name: domainName,
});

const websiteBucket = provider.S3.makeBucket({
  name: `${domainName}-bucket`,
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

const distribution = provider.CloudFront.makeDistribution({
  name: `distribution-${domainName}`,
  dependencies: () => ({ websiteBucket, certificate }),
  properties: ({ dependencies }) => {
    return {
      PriceClass: "PriceClass_100",
      Comment: `${domainName}.s3.amazonaws.com`,
      Aliases: { Quantity: 1, Items: [domainName] },
      DefaultRootObject: "index.html",
      DefaultCacheBehavior: {
        TargetOriginId: `S3-${domainName}`,
        ViewerProtocolPolicy: "redirect-to-https",
        ForwardedValues: {
          Cookies: {
            Forward: "none",
          },
          QueryString: false,
        },
        MinTTL: 600,
        TrustedSigners: {
          Enabled: false,
          Quantity: 0,
          Items: [],
        },
      },
      Origins: {
        Items: [
          {
            DomainName: `${domainName}.s3.amazonaws.com`,
            Id: `S3-${domainName}`,
            S3OriginConfig: { OriginAccessIdentity: "" },
          },
        ],
        Quantity: 1,
      },
    };
  },
});
```

### Examples

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createDistributionWithTags-property)

### Cache Invalidation

When some S3 objects are updated during the _gc apply_ command, a [_createInvalidation_](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createInvalidation-property) call is made to invalide the cache to make sure the new version is available to the node edges.

### Dependencies

- [S3Bucket](../S3/S3Bucket)
- [Certificate](../ACM/AcmCertificate)
