---
id: Route53HostedZone
title: Hosted Zone
---

Provides a Route53 Hosted Zone.

## Examples

### A Record

Add an A record to the hosted zone:

```js
const domainName = "your.domain.name.com";
hostedZone = await provider.makeHostedZone({
  name: `${hostedZoneName}.`,
  properties: () => ({
    RecordSet: [
      {
        Name: `${hostedZoneName}.`,
        ResourceRecords: [
          {
            Value: "192.0.2.44",
          },
        ],
        TTL: 60,
        Type: "A",
      },
    ],
  }),
});
```

### CNAME from a certificate

Verify a certificate with DNS validation by adding a CNAME record.

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
    const record = certificate.live?.DomainValidationOptions[0].ResourceRecord;
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

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createHostedZone-property)

## Dependencies

- [ACM Certificate](../ACM/AcmCertificate)
