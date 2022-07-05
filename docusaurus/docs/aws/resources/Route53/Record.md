---
id: Record
title: Record
---

Provides a single [Route53 Record](https://console.aws.amazon.com/route53/v2/home#Dashboard)

## Examples

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

### TXT record

Let's add TXT record to verify a domain ownership:

```js
exports.createResources = () => [
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
    properties: ({}) => ({
      Name: "gcrun.grucloud.org.",
      Type: "TXT",
      TTL: 300,
      ResourceRecords: [
        {
          Value:
            '"google-site-verification=ZXCVBNMF8sKTj__itc4iAXA4my_hB-bzUlCFGHJK"',
        },
      ],
    }),
    dependencies: () => ({
      hostedZone: "grucloud.org.",
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

### A record from an elastic IP address

Ads a IPv4 A record from an elastic IP address

```js
exports.createResources = () => [
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "myip",
  },
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
    properties: ({ getId }) => ({
      Name: "grucloud.org.",
      Type: "A",
      TTL: 300,
      ResourceRecords: [
        {
          Value: getId({
            type: "ElasticIpAddress",
            group: "EC2",
            name: "myip",
            path: "live.PublicIp",
          }),
        },
      ],
    }),
    dependencies: () => ({
      hostedZone: "grucloud.org.",
      elasticIpAddress: "myip",
    }),
  },
];
```

### Alias for a CloudFront Distribution

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

- [Alias record for a load balancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/ELBv2/load-balancer/resources.js)
- [Aliad record for a Cloudfront distribution](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/resources.js)
- [TXT record and hosted zone ](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/txt-record/resources.js)
- [A Record to an elastic IP address](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/dns-record-ip-address/resources.js)

## Properties

- [ChangeResourceRecordSetsCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route-53/interfaces/changeresourcerecordsetscommandinput.html)

## Dependencies

- [Route53 HostedZone](./HostedZone)
- [HealthCheck](./HealthCheck.md)
- [LoadBalancer](../ELBv2/LoadBalancer.md)
- [Certificate](../ACM/Certificate)
- [ApiGatewayV2 DomainName](../ApiGatewayV2/DomainName.md)
- [CloudFront Distribution](../CloudFront/Distribution.md)
- [Elastic IP Address](../EC2/ElasticIpAddress.md)

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
