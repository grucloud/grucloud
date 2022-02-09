---
id: Domain
title: Domains
---

Provides a Route53 Domain.

## Example

By using a _route53 domain_ as a dependency to an _hostedZone_, the nameservers returns by the hosted zone will be used to update the route53 domain's nameserver.

```js
const domainName = "mydomain.com";

exports.createResources = () => [
  {
    type: "HostedZone",
    group: "Route53",
    name: `${domainName}.`,
    dependencies: () => ({
      domain: domainName,
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

## Source Code Examples

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/iac.js)

## Used By

- [HostedZone](../Route53/HostedZone.md)
