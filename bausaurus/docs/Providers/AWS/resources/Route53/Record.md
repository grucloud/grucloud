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

- [ACM Certificate](https://github.com/grucloud/grucloud/blob/main/examples/aws/ACM/certificate)
- [ApiGatewayV2 http-lambda](https://github.com/grucloud/grucloud/blob/main/examples/aws/ApiGatewayV2/http-lambda)
- [CloudFront Distribution](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https)
- [ElasticLoadBalancingV2 Alias record for a load balancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/ElasticLoadBalancingV2/load-balancer)
- [Alias record for a Cloudfront distribution](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https)
- [TXT record and hosted zone ](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/txt-record)
- [health-check simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/health-check)
- [A Record to an elastic IP address](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/dns-record-ip-address)
- [CognitoIdentityServiceProvider identity-provider](https://github.com/grucloud/grucloud/tree/main/examples/aws/CognitoIdentityServiceProvider/identity-provider)

## Properties

- [ChangeResourceRecordSetsCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route-53/interfaces/changeresourcerecordsetscommandinput.html)

## Dependencies

- [ACM Certificate](../ACM/Certificate)
- [ApiGatewayV2 DomainName](../ApiGatewayV2/DomainName.md)
- [CloudFront Distribution](../CloudFront/Distribution.md)
- [EC2 Elastic IP Address](../EC2/ElasticIpAddress.md)
- [EC2 Vpc Endpoint](../EC2/VpcEndpoint.md)
- [ElasticLoadBalancingV2 LoadBalancer](../ElasticLoadBalancingV2/LoadBalancer.md)
- [Route53 HostedZone](./HostedZone.md)
- [Route53 HealthCheck](./HealthCheck.md)

## List

```sh
gc l -t Route53::Record
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌───────────────────────────────────────────────────────────────────────────┐
│ 3 Route53::Record from aws                                                │
├───────────────────────────────────────────────────────────────────────────┤
│ name: record::NS::grucloud.org.                                           │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: grucloud.org.                                                     │
│   Type: NS                                                                │
│   TTL: 172800                                                             │
│   ResourceRecords:                                                        │
│     - Value: ns-39.awsdns-04.com.                                         │
│     - Value: ns-1621.awsdns-10.co.uk.                                     │
│     - Value: ns-1344.awsdns-40.org.                                       │
│     - Value: ns-793.awsdns-35.net.                                        │
│   HostedZoneId: Z0150486BN9SN0JQWCYZ                                      │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: record::SOA::grucloud.org.                                          │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: grucloud.org.                                                     │
│   Type: SOA                                                               │
│   TTL: 900                                                                │
│   ResourceRecords:                                                        │
│     - Value: ns-39.awsdns-04.com. awsdns-hostmaster.amazon.com. 1 7200 9… │
│   HostedZoneId: Z0150486BN9SN0JQWCYZ                                      │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: record::TXT::gcrun.grucloud.org.                                    │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Name: gcrun.grucloud.org.                                               │
│   Type: TXT                                                               │
│   TTL: 300                                                                │
│   ResourceRecords:                                                        │
│     - Value: "google-site-verification=DPVEQ54F8sKTj__itc4iAXA4my_hB-bzU… │
│   HostedZoneId: Z0150486BN9SN0JQWCYZ                                      │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├─────────────────┬────────────────────────────────────────────────────────┤
│ Route53::Record │ record::NS::grucloud.org.                              │
│                 │ record::SOA::grucloud.org.                             │
│                 │ record::TXT::gcrun.grucloud.org.                       │
└─────────────────┴────────────────────────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc l -t Route53::Record" executed in 6s, 105 MB
```
