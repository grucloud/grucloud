---
id: AcmCertificate
title: Certificate
---

Provides an SSL certificate.

> Certificates for CloudFront must be created in the us-east-1 region only.

## Examples

### Create a certificate with DNS validation

```js
const domainName = "your.domain.name.com";

const certificate = await provider.makeCertificate({
  name: domainName,
  properties: () => ({}),
});

const hostedZone = await provider.makeHostedZone({
  name: `${domainName}.`,
  dependencies: { certificate },
  properties: ({ dependencies: { certificate } }) => {
    const domainValidationOption = certificate.live?.DomainValidationOptions[0];
    const record = domainValidationOption?.ResourceRecord;
    if (domainValidationOption) {
      assert(
        record,
        `missing record in DomainValidationOptions, certificate ${JSON.stringify(
          certificate.live
        )}`
      );
    }
    return {
      RecordSet: [
        {
          Name: record?.Name,
          ResourceRecords: [
            {
              Value: record?.Value,
            },
          ],
          TTL: 300,
          Type: "CNAME",
        },
      ],
    };
  },
});
```

## Source Code Examples

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#requestCertificate-property)

## UsedBy

- [HostedZone](../Route53/Route53HostedZone)
