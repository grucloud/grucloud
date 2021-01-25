---
id: Route53HostedZone
title: Hosted Zone
---

Provides a Route53 Hosted Zone.

Add one or more records with the [Route53 Record](./Route53Record) resource.

## Examples

### Simple HostedZone

Create a HostedZone with a Route53Domain as a dependency to update automatically the DNS servers.

```js
const domainName = "your.domain.name.com";

const domain = await provider.useRoute53Domain({
  name: domainName,
});

const hostedZoneName = `${domainName}.`;
const hostedZone = await provider.makeHostedZone({
  name: hostedZoneName,
  dependencies: { domain },
  properties: ({}) => ({}),
});
```

## Source Code Examples

- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/iac.js)
- [starhack.it](https://github.com/FredericHeem/starhackit/blob/master/deploy/grucloud-aws/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createHostedZone-property)

## Dependencies

- [Route53 Domain](../Route53Domain/Route53Domain)

## Used By

- [Route53 Record](./Route53Record)
