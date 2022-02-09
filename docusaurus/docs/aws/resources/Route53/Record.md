---
id: Record
title: Record
---

Provides a single [Route53 Record](https://console.aws.amazon.com/route53/v2/home#Dashboard)

## Examples

### A Record

Add an A record to the hosted zone:

```js
exports.createResources = () => [
  { type: "Certificate", group: "ACM", name: "grucloud.org" },
  {
    type: "HostedZone",
    group: "Route53",
    name: "grucloud.org.",
    dependencies: () => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: () => ({
      hostedZone: "grucloud.org.",
      eip: "eip",
    }),
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
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
];
```

### CNAME from a certificate

Verify a certificate with DNS validation by adding a CNAME record.

```js
exports.createResources = () => [
  { type: "Certificate", group: "ACM", name: "grucloud.org" },
  {
    type: "HostedZone",
    group: "Route53",
    name: "grucloud.org.",
    dependencies: () => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: () => ({
      hostedZone: "grucloud.org.",
      certificate: "grucloud.org",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
];
```

### Alias for CloudFront Distribution

Add an alias entry to the the CloudFront distribution domain name

```js
exports.createResources = () => [
  {
    type: "HostedZone",
    group: "Route53",
    name: "dev.cloudfront.aws.test.grucloud.org.",
    dependencies: () => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: () => ({
      hostedZone: "dev.cloudfront.aws.test.grucloud.org.",
      distribution: "distribution-cloudfront.aws.test.grucloud.org-dev",
    }),
  },
];
```

## Source Code Examples

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/iac.js)
- [starhack.it](https://github.com/FredericHeem/starhackit/blob/master/deploy/grucloud-aws/iac.js)
- [TXT record and hosted zone ](https://github.com/grucloud/grucloud/blob/main/examples/aws/route53/dns-validation-record-txt/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeResourceRecordSets-property)

## Dependencies

- [Route53 HostedZone](./HostedZone)
- [LoadBalancer](../ELBv2/LoadBalancer.md)
- [Certificate](../ACM/Certificate)
- [APIGateway DomainName](../APIGateway/DomainName.md)
- [ApiGatewayV2 DomainName](../ApiGatewayV2/DomainName.md)
- [CloudFront Distribution](../CloudFront/Distribution.md)

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
