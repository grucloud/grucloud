---
id: AwsListenerRule
title: Listener Rule
---

Manage an [ELB Listener Rule](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html).

## Example

### HTTP to HTTPS rule

Provide a rule to redirect HTTP traffic to HTTPS.

```js
provider.ELBv2.makeRule({
  properties: ({ config }) => ({
    Priority: "1",
    Conditions: [
      {
        Field: "path-pattern",
        Values: ["/*"],
      },
    ],
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
  }),
  dependencies: ({ resources }) => ({
    listener: resources.ELBv2.Listener["listener::load-balancer::HTTP::80"],
  }),
});
```

### Forward to target group based on a path pattern

Forward traffic matching _/api/_ to the target group running the REST server.

```js
provider.ELBv2.makeRule({
  properties: ({ config }) => ({
    Priority: "1",
    Conditions: [
      {
        Field: "path-pattern",
        Values: ["/api/*"],
      },
    ],
  }),
  dependencies: ({ resources }) => ({
    listener: resources.ELBv2.Listener["listener::load-balancer::HTTPS::443"],
    targetGroup: resources.ELBv2.TargetGroup["target-group-rest"],
  }),
});
```

## Properties

- [ELBv2 createRule](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createRule-property)

## Source Code

- [Load Balancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/ELBv2/load-balancer/resources.js)

## Dependencies

- [Listener](./Listener.md)
- [TargetGroup](./TargetGroup.md)

## List

```sh
gc l -t ELBv2::Rule
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 9/9
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5 ELBv2::Rule from aws                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: rule-default-listener::load-balancer::HTTP::80::default               │
│ managedByUs: NO                                                             │
│ live:                                                                       │
│   RuleArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listener-ru… │
│   Priority: default                                                         │
│   Conditions: []                                                            │
│   Actions:                                                                  │
│     - Type: forward                                                         │
│       TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:… │
│       ForwardConfig:                                                        │
│         TargetGroups:                                                       │
│           - TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:8405414… │
│             Weight: 1                                                       │
│         TargetGroupStickinessConfig:                                        │
│           Enabled: false                                                    │
│   IsDefault: true                                                           │
│   ListenerArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listene… │
│   Tags: []                                                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: rule-default-listener::load-balancer::HTTPS::443::default             │
│ managedByUs: NO                                                             │
│ live:                                                                       │
│   RuleArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listener-ru… │
│   Priority: default                                                         │
│   Conditions: []                                                            │
│   Actions:                                                                  │
│     - Type: forward                                                         │
│       TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:… │
│       ForwardConfig:                                                        │
│         TargetGroups:                                                       │
│           - TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:8405414… │
│             Weight: 1                                                       │
│         TargetGroupStickinessConfig:                                        │
│           Enabled: false                                                    │
│   IsDefault: true                                                           │
│   ListenerArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listene… │
│   Tags: []                                                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: rule::listener::load-balancer::HTTP::80::1                            │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   RuleArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listener-ru… │
│   Priority: 1                                                               │
│   Conditions:                                                               │
│     - Field: path-pattern                                                   │
│       Values:                                                               │
│         - "/*"                                                              │
│       PathPatternConfig:                                                    │
│         Values:                                                             │
│           - "/*"                                                            │
│   Actions:                                                                  │
│     - Type: redirect                                                        │
│       Order: 1                                                              │
│       RedirectConfig:                                                       │
│         Protocol: HTTPS                                                     │
│         Port: 443                                                           │
│         Host: #{host}                                                       │
│         Path: /#{path}                                                      │
│         Query: #{query}                                                     │
│         StatusCode: HTTP_301                                                │
│   IsDefault: false                                                          │
│   ListenerArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listene… │
│   Tags:                                                                     │
│     - Key: gc-created-by-provider                                           │
│       Value: aws                                                            │
│     - Key: gc-managed-by                                                    │
│       Value: grucloud                                                       │
│     - Key: gc-project-name                                                  │
│       Value: @grucloud/example-aws-elbv2-loadbalancer                       │
│     - Key: gc-stage                                                         │
│       Value: dev                                                            │
│     - Key: Name                                                             │
│       Value: rule::listener::load-balancer::HTTP::80::1                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: rule::listener::load-balancer::HTTPS::443::1                          │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   RuleArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listener-ru… │
│   Priority: 1                                                               │
│   Conditions:                                                               │
│     - Field: path-pattern                                                   │
│       Values:                                                               │
│         - "/api/*"                                                          │
│       PathPatternConfig:                                                    │
│         Values:                                                             │
│           - "/api/*"                                                        │
│   Actions:                                                                  │
│     - Type: forward                                                         │
│       TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:… │
│       Order: 1                                                              │
│       ForwardConfig:                                                        │
│         TargetGroups:                                                       │
│           - TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:8405414… │
│             Weight: 1                                                       │
│         TargetGroupStickinessConfig:                                        │
│           Enabled: false                                                    │
│   IsDefault: false                                                          │
│   ListenerArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listene… │
│   Tags:                                                                     │
│     - Key: gc-created-by-provider                                           │
│       Value: aws                                                            │
│     - Key: gc-managed-by                                                    │
│       Value: grucloud                                                       │
│     - Key: gc-project-name                                                  │
│       Value: @grucloud/example-aws-elbv2-loadbalancer                       │
│     - Key: gc-stage                                                         │
│       Value: dev                                                            │
│     - Key: Name                                                             │
│       Value: rule::listener::load-balancer::HTTPS::443::1                   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: rule::listener::load-balancer::HTTPS::443::2                          │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   RuleArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listener-ru… │
│   Priority: 2                                                               │
│   Conditions:                                                               │
│     - Field: path-pattern                                                   │
│       Values:                                                               │
│         - "/*"                                                              │
│       PathPatternConfig:                                                    │
│         Values:                                                             │
│           - "/*"                                                            │
│   Actions:                                                                  │
│     - Type: forward                                                         │
│       TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:… │
│       Order: 1                                                              │
│       ForwardConfig:                                                        │
│         TargetGroups:                                                       │
│           - TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:8405414… │
│             Weight: 1                                                       │
│         TargetGroupStickinessConfig:                                        │
│           Enabled: false                                                    │
│   IsDefault: false                                                          │
│   ListenerArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listene… │
│   Tags:                                                                     │
│     - Key: gc-created-by-provider                                           │
│       Value: aws                                                            │
│     - Key: gc-managed-by                                                    │
│       Value: grucloud                                                       │
│     - Key: gc-project-name                                                  │
│       Value: @grucloud/example-aws-elbv2-loadbalancer                       │
│     - Key: gc-stage                                                         │
│       Value: dev                                                            │
│     - Key: Name                                                             │
│       Value: rule::listener::load-balancer::HTTPS::443::2                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                        │
├─────────────┬──────────────────────────────────────────────────────────────┤
│ ELBv2::Rule │ rule-default-listener::load-balancer::HTTP::80::default      │
│             │ rule-default-listener::load-balancer::HTTPS::443::default    │
│             │ rule::listener::load-balancer::HTTP::80::1                   │
│             │ rule::listener::load-balancer::HTTPS::443::1                 │
│             │ rule::listener::load-balancer::HTTPS::443::2                 │
└─────────────┴──────────────────────────────────────────────────────────────┘
5 resources, 1 type, 1 provider
Command "gc l -t ELBv2::Rule" executed in 10s
```
