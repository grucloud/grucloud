---
id: Route53Record
title: Route53 Record
---

Provides a single [Route53 Record](https://console.aws.amazon.com/route53/v2/home#Dashboard)

## Examples

### A Record

Add an A record to the hosted zone:

```js
const domainName = "your.domain.name.com";

const domain = provider.route53Domain.useDomain({
  name: domainName,
});

const hostedZoneName = `${domainName}.`;
const hostedZone = provider.route53.makeHostedZone({
  name: hostedZoneName,
  dependencies: { domain },
  properties: ({}) => ({}),
});

const recordA = provider.route53.makeRecord({
  name: `${hostedZoneName}-ipv4`,
  dependencies: { hostedZone, eip },
  properties: ({ dependencies: { eip } }) => {
    return {
      Name: hostedZoneName,
      Type: "A",
      ResourceRecords: [
        {
          Value: eip.live?.PublicIp,
        },
      ],
      TTL: 60,
    };
  },
});
```

### CNAME from a certificate

Verify a certificate with DNS validation by adding a CNAME record.

```js
const domainName = "your.domain.name.com";

const domain = provider.route53Domain.useDomain({
  name: domainName,
});

const hostedZone = provider.route53.makeHostedZone({
  name: `${domainName}.`,
  dependencies: { domain },
  properties: ({}) => ({}),
});

const recordValidation = provider.route53.makeRecord({
  name: `validation-${domainName}.`,
  dependencies: { hostedZone, certificate },
  properties: ({ dependencies: { certificate } }) => {
    const domainValidationOption =
      certificate?.live?.DomainValidationOptions[0];
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
      Name: record?.Name,
      ResourceRecords: [
        {
          Value: record?.Value,
        },
      ],
      TTL: 300,
      Type: "CNAME",
    };
  },
});
```

## Source Code Examples

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/iac.js)
- [starhack.it](https://github.com/FredericHeem/starhackit/blob/master/deploy/grucloud-aws/iac.js)
- [TXT record and hosted zone ](https://github.com/grucloud/grucloud/blob/main/examples/aws/route53/dns-validation-record-txt/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeResourceRecordSets-property)

## Dependencies

- [Route53 HostedZone](./Route53HostedZone)

## List

```txt
┌────────────────────────────────────────────────────────────────────────────┐
│ 3 route53::Record from aws                                                 │
├────────────────────┬────────────────────────────────────────────────┬──────┤
│ Name               │ Data                                           │ Our  │
├────────────────────┼────────────────────────────────────────────────┼──────┤
│ grucloud.org.::NS  │ Name: grucloud.org.                            │ Yes  │
│                    │ Type: NS                                       │      │
│                    │ TTL: 172800                                    │      │
│                    │ ResourceRecords:                               │      │
│                    │   - Value: ns-1907.awsdns-46.co.uk.            │      │
│                    │   - Value: ns-15.awsdns-01.com.                │      │
│                    │   - Value: ns-1423.awsdns-49.org.              │      │
│                    │   - Value: ns-514.awsdns-00.net.               │      │
│                    │ HostedZoneId: /hostedzone/Z0064831PNCGMBFQ0H7Y │      │
│                    │                                                │      │
├────────────────────┼────────────────────────────────────────────────┼──────┤
│ grucloud.org.::SOA │ Name: grucloud.org.                            │ Yes  │
│                    │ Type: SOA                                      │      │
│                    │ TTL: 900                                       │      │
│                    │ ResourceRecords:                               │      │
│                    │   - Value: ns-1907.awsdns-46.co.uk. awsdns-ho… │      │
│                    │ HostedZoneId: /hostedzone/Z0064831PNCGMBFQ0H7Y │      │
│                    │                                                │      │
├────────────────────┼────────────────────────────────────────────────┼──────┤
│ txt.grucloud.org.  │ Name: grucloud.org.                            │ Yes  │
│                    │ Type: TXT                                      │      │
│                    │ TTL: 60                                        │      │
│                    │ ResourceRecords:                               │      │
│                    │   - Value: "google-site-verification=q_tZuuK8… │      │
│                    │ Tags:                                          │      │
│                    │   - Key: gc-managed-by                         │      │
│                    │     Value: grucloud                            │      │
│                    │   - Key: gc-project-name                       │      │
│                    │     Value: @grucloud/example-aws-route53-dns-… │      │
│                    │   - Key: gc-stage                              │      │
│                    │     Value: dev                                 │      │
│                    │   - Key: gc-record-txt.grucloud.org.           │      │
│                    │     Value: grucloud.org.::TXT                  │      │
│                    │   - Key: gc-created-by-provider                │      │
│                    │     Value: aws                                 │      │
│                    │   - Key: Name                                  │      │
│                    │     Value: grucloud.org.                       │      │
│                    │ HostedZoneId: /hostedzone/Z0064831PNCGMBFQ0H7Y │      │
│                    │ namespace:                                     │      │
│                    │                                                │      │
└────────────────────┴────────────────────────────────────────────────┴──────┘
```
