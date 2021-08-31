---
id: Route53HostedZone
title: Hosted Zone
---

Provides a [Route53 Hosted Zone](https://console.aws.amazon.com/route53/v2/home#Dashboard)

Add one or more records with the [Route53 Record](./Route53Record) resource.

## Examples

### Simple HostedZone

Create a HostedZone with a Route53Domain as a dependency to update automatically the DNS servers.

```js
const domainName = "your.domain.name.com";

const domain = provider.Route53Domain.useDomain({
  name: domainName,
});

const hostedZoneName = `${domainName}.`;
const hostedZone = provider.Route53.makeHostedZone({
  name: hostedZoneName,
  dependencies: { domain },
});
```

## Source Code Examples

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/iac.js)
- [starhack.it](https://github.com/FredericHeem/starhackit/blob/master/deploy/grucloud-aws/iac.js)
- [A record and hosted zone ](https://github.com/grucloud/grucloud/blob/main/examples/aws/route53/dns-validation-record-txt/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createHostedZone-property)

## Dependencies

- [Route53 Domain](../Route53Domain/Route53Domain)

## Used By

- [Route53 Record](./Route53Record)

## List

```txt
┌────────────────────────────────────────────────────────────────────────────┐
│ 1 route53::HostedZone from aws                                             │
├───────────────┬─────────────────────────────────────────────────────┬──────┤
│ Name          │ Data                                                │ Our  │
├───────────────┼─────────────────────────────────────────────────────┼──────┤
│ grucloud.org. │ Id: /hostedzone/Z0064831PNCGMBFQ0H7Y                │ Yes  │
│               │ Name: grucloud.org.                                 │      │
│               │ CallerReference: grucloud-Sun Jul 11 2021 23:25:48… │      │
│               │ Config:                                             │      │
│               │   PrivateZone: false                                │      │
│               │ ResourceRecordSetCount: 3                           │      │
│               │ RecordSet:                                          │      │
│               │   - Name: grucloud.org.                             │      │
│               │     Type: NS                                        │      │
│               │     TTL: 172800                                     │      │
│               │     ResourceRecords:                                │      │
│               │       - Value: ns-1907.awsdns-46.co.uk.             │      │
│               │       - Value: ns-15.awsdns-01.com.                 │      │
│               │       - Value: ns-1423.awsdns-49.org.               │      │
│               │       - Value: ns-514.awsdns-00.net.                │      │
│               │   - Name: grucloud.org.                             │      │
│               │     Type: SOA                                       │      │
│               │     TTL: 900                                        │      │
│               │     ResourceRecords:                                │      │
│               │       - Value: ns-1907.awsdns-46.co.uk. awsdns-hos… │      │
│               │   - Name: grucloud.org.                             │      │
│               │     Type: TXT                                       │      │
│               │     TTL: 60                                         │      │
│               │     ResourceRecords:                                │      │
│               │       - Value: "google-site-verification=q_tZuuK8O… │      │
│               │ Tags:                                               │      │
│               │   - Key: gc-managed-by                              │      │
│               │     Value: grucloud                                 │      │
│               │   - Key: gc-project-name                            │      │
│               │     Value: @grucloud/example-aws-route53-dns-valid… │      │
│               │   - Key: gc-stage                                   │      │
│               │     Value: dev                                      │      │
│               │   - Key: gc-record-txt.grucloud.org.                │      │
│               │     Value: grucloud.org.::TXT                       │      │
│               │   - Key: gc-created-by-provider                     │      │
│               │     Value: aws                                      │      │
│               │   - Key: Name                                       │      │
│               │     Value: grucloud.org.                            │      │
│               │                                                     │      │
└───────────────┴─────────────────────────────────────────────────────┴──────┘

```
