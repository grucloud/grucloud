---
id: HealthCheck
title: Health Check
---

Provides [Route53 Health Check](https://console.aws.amazon.com/route53/healthchecks/home#)

## Examples

### HTTP check

```js
exports.createResources = () => [
  {
    type: "HealthCheck",
    group: "Route53",
    properties: ({}) => ({
      HealthCheckConfig: {
        Port: 80,
        Type: "HTTP",
        FullyQualifiedDomainName: "healthcheck.grucloud.org",
      },
      HealthCheckVersion: 1,
    }),
  },
];
```

## Source Code Examples

- [health-check simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/health-check)
- [aws-samples aws-route53-recovery-control-config](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/aws-route53-recovery-control-config)

## Properties

- [CreateHealthCheckCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route-53/interfaces/createhealthcheckcommandinput.html)

## Dependencies

- [CloudWatch Metric Alarm](../CloudWatch/MetricAlarm.md)
- [Route53RecoveryControlConfig Routing Control](../Route53RecoveryControlConfig/RoutingControl.md)

## Used By

- [Route53 Record](./Record.md)
- [CloudWatch Alarm](../CloudWatch/MetricAlarm.md)

## List

List the route53 health checks with the **Route53::HealthCheck** filter:

```sh
gc list -t Route53::HealthCheck
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────┐
│ 1 Route53::HealthCheck from aws                                       │
├───────────────────────────────────────────────────────────────────────┤
│ name: heathcheck::HTTP::healthcheck.grucloud.org                      │
│ managedByUs: Yes                                                      │
│ live:                                                                 │
│   Id: d367787b-ade5-4e32-a2d5-a689f5ddd615                            │
│   CallerReference: grucloud-d7f1133e-80d4-46a0-9dbf-a2e836f94dc2      │
│   HealthCheckConfig:                                                  │
│     Port: 80                                                          │
│     Type: HTTP                                                        │
│     FullyQualifiedDomainName: healthcheck.grucloud.org                │
│     RequestInterval: 30                                               │
│     FailureThreshold: 3                                               │
│     MeasureLatency: false                                             │
│     Inverted: false                                                   │
│     Disabled: false                                                   │
│     EnableSNI: false                                                  │
│   HealthCheckVersion: 1                                               │
│   Tags:                                                               │
│     - Key: gc-created-by-provider                                     │
│       Value: aws                                                      │
│     - Key: gc-managed-by                                              │
│       Value: grucloud                                                 │
│     - Key: gc-project-name                                            │
│       Value: health-check                                             │
│     - Key: gc-stage                                                   │
│       Value: dev                                                      │
│     - Key: Name                                                       │
│       Value: heathcheck::HTTP::healthcheck.grucloud.org               │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────┐
│ aws                                                                  │
├──────────────────────┬───────────────────────────────────────────────┤
│ Route53::HealthCheck │ heathcheck::HTTP::healthcheck.grucloud.org    │
└──────────────────────┴───────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t HealthCheck" executed in 9s, 110 MB

```
