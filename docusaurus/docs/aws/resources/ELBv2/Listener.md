---
id: AwsListener
title: Listener
---

Manage an [ELB Listener](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html).

## Example

### Http listener

```js
const vpc = await provider.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const listenerHttp = await provider.makeListener({
  name: config.elb.listeners.http.name,
  dependencies: {
    loadBalancer,
    targetGroups: [targetGroups.web],
  },
  properties: ({
    dependencies: {
      targetGroups: [targetGroup],
    },
  }) => ({
    Port: 80,
    Protocol: "HTTP",
    DefaultActions: [
      {
        TargetGroupArn: targetGroup?.live?.TargetGroupArn,
        Type: "forward",
      },
    ],
  }),
});
```

## Properties

The list of properties are the parameter of [createTargetGroup](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createTargetGroup-property)

## Source Code

## Dependencies

- [LoadBalancer](./LoadBalancer.md)
- [TargetGroup](./TargetGroup.md)
