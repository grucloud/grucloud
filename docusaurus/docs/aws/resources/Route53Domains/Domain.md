---
id: Domain
title: Domains
---

Provides a Route53 Domain.

## Example

By using a _route53 domain_ as a dependency to an _hostedZone_, the nameservers returns by the hosted zone will be used to update the route53 domain's nameserver.

```js
const domainName = "mydomain.com";
provider.Route53Domains.useDomain({
  name: domainName,
});

provider.Route53.makeHostedZone({
  name: `${domainName}.`,
  dependencies: () => ({ domain: domainName }),
});
```

## Source Code Examples

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/iac.js)

## Used By

- [HostedZone](../Route53/HostedZone.md)
