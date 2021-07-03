---
id: Route53Domain
title: Route53 Domains
---

Provides a Route53 Domain.

## Example

By using a _route53 domain_ as a dependency to an _hostedZone_, the nameservers returns by the hosted zone will be used to update the route53 domain's nameserver.

```js
const domainName = "mydomain.com";
const domain = await provider.route53Domain.useDomain({
  name: domainName,
});

const hostedZone = await provider.route53.makeHostedZone({
  name: `${domainName}.`,
  dependencies: { domain },
  properties: ({}) => ({}),
});
```

## Source Code Examples

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/iac.js)

## Used By

- [HostedZone](../Route53/Route53HostedZone)
