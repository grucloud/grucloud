---
id: AwsListenerRule
title: Listener Rule
---

Manage an [ELB Listener Rule](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html).

## Example

### HTTP to HTTPS rule

Provide a rule to redirect HTTP traffic to HTTPS.

```js
const ruleHttp2Https = provider.elb.makeRule({
  name: "rule-httt2https",
  dependencies: {
    listener: listenerHttp,
  },
  properties: () => ({
    Actions: [
      {
        Type: "redirect",
        Order: 1,
        RedirectConfig: {
          Protocol: "HTTPS",
          Port: "443",
          Host: "#{host}",
          Path: "/#{path}",
          Query: "#{query}",
          StatusCode: "HTTP_301",
        },
      },
    ],
    Conditions: [
      {
        Field: "path-pattern",
        Values: ["/*"],
      },
    ],
    Priority: 1,
  }),
});
```

### Forward to target group based on a path pattern

Forward traffic matching _/api/_ to the target group running the REST server.

```js
const ruleHttps = provider.elb.makeRule({
  name: "rule-httt2https",
  dependencies: {
    listener: listeners.https,
    targetGroup: targetGroups.rest,
  },
  properties: () => ({
    Conditions: [
      {
        Field: "path-pattern",
        Values: ["/api/*"],
      },
    ],
    Priority: 10,
  }),
});
```

## Properties

- [ELBV2 createRule](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createRule-property)

## Source Code

- [Load Balancer Module](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/load-balancer/iac.js)

## Dependencies

- [Listener](./Listener.md)
- [TargetGroup](./TargetGroup.md)

## List

```sh
gc l -t ListenerRule
```

```sh

```
