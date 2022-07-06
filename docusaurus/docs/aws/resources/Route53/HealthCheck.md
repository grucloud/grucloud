---
id: HealthCheck
title: Health Check
---

Provides [Route53 Health Check](https://console.aws.amazon.com/route53/healthchecks/home#)

## Examples

```js
exports.createResources = () => [];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53RecoveryReadiness/route53-recovery-readiness)

## Properties

- [CreateHealthCheckCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route-53/interfaces/createhealthcheckcommandinput.html)

## Dependencies

- [CloudWatch Metric Alarm](../CloudWatch/MetricAlarm.md)
- [Route53RecovertControlConfig Routing Control](../Route53RecovertControlConfig/RoutingControl.md)

## Used By

- [Record](./Record.md)

## List

List the endpoints with the **Route53::HealthCheck** filter:

```sh
gc list -t Route53::HealthCheck
```

```txt

```
