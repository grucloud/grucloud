---
id: HostedZone
title: Hosted Zone
---

Provides a [Route53 Hosted Zone](https://console.aws.amazon.com/route53/v2/home#Dashboard)

Add one or more records with the [Route53 Record](./Record.md) resource.

## Examples

### Simple HostedZone

Create a HostedZone with a Route53Domain as a dependency to update automatically the DNS servers.

```js
const domainName = "mydomain.com";

exports.createResources = () => [
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: domainName,
    }),
    dependencies: ({}) => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: domainName,
    readOnly: true,
  },
];
```

### Private HostedZone

Create a private HostedZone associated to a VPC

```js
exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc-hostedzone",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "test.grucloud.org.",
    }),
    dependencies: ({}) => ({
      domain: "grucloud.org",
      vpc: "vpc-hostedzone",
    }),
  },
];
```

## Source Code Examples

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https)
- [A record and hosted zone ](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/dns-validation-record-txt)
- [private hosted zone associated with one VPC](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/hostedzone-private)

## Properties

- [CreateHostedZoneCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route-53/interfaces/createhostedzonecommandinput.html)

## Dependencies

- [Route53 Domain](../Route53Domains/Domain.md)
- [Vpc](../EC2/Vpc.md)

## Used By

- [Route53 Record](./Record.md)

## List

list the hosted zones with the **Route53::HostedZone** filter:

```sh
gc list -t Route53::HostedZone
```

```txt
┌─────────────────────────────────────────────────────────────────────────┐
│ 1 Route53::HostedZone from aws                                          │
├─────────────────────────────────────────────────────────────────────────┤
│ name: test.grucloud.org.                                                │
│ managedByUs: Yes                                                        │
│ live:                                                                   │
│   Id: /hostedzone/Z096960312EGF3ADWBJ12                                 │
│   Name: test.grucloud.org.                                              │
│   CallerReference: 64229059-7c56-488e-a785-924222770bfd                 │
│   Config:                                                               │
│     Comment:                                                            │
│     PrivateZone: true                                                   │
│   ResourceRecordSetCount: 2                                             │
│   Tags: []                                                              │
│   RecordSet:                                                            │
│     - Name: test.grucloud.org.                                          │
│       Type: NS                                                          │
│       TTL: 172800                                                       │
│       ResourceRecords:                                                  │
│         - Value: ns-1536.awsdns-00.co.uk.                               │
│         - Value: ns-0.awsdns-00.com.                                    │
│         - Value: ns-1024.awsdns-00.org.                                 │
│         - Value: ns-512.awsdns-00.net.                                  │
│     - Name: test.grucloud.org.                                          │
│       Type: SOA                                                         │
│       TTL: 900                                                          │
│       ResourceRecords:                                                  │
│         - Value: ns-1536.awsdns-00.co.uk. awsdns-hostmaster.amazon.com… │
│   VpcAssociations:                                                      │
│     - VPCId: vpc-09d82ceb6fcd32e22                                      │
│       Owner:                                                            │
│         OwningAccount: 840541460064                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

```
