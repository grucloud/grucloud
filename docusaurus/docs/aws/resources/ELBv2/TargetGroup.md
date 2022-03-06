---
id: TargetGroup
title: Target Group
---

Manages an [ELB Target Group](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html).

A target group can be attached directly to an AutoScaling Group or an AutoScaling Group created by an EKS Node Group.

## Example

```js
exports.createResources = () => [
  {
    type: "TargetGroup",
    group: "ELBv2",
    name: "target-group-rest",
    properties: ({}) => ({
      Protocol: "HTTP",
      Port: 30020,
      HealthCheckProtocol: "HTTP",
      HealthCheckPort: "traffic-port",
      HealthCheckEnabled: true,
      HealthCheckIntervalSeconds: 30,
      HealthCheckTimeoutSeconds: 5,
      HealthyThresholdCount: 5,
      HealthCheckPath: "/api/v1/version",
      Matcher: {
        HttpCode: "200",
      },
      TargetType: "instance",
      ProtocolVersion: "HTTP1",
    }),
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
];
```

## Properties

The list of properties are the parameter of [CreateTargetGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elastic-load-balancing-v2/interfaces/createtargetgroupcommandinput.html)

## Source Code

- [Load Balancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/ELBv2/load-balancer/resources.js)

## Dependencies

- [VPC](../EC2/Vpc.md)
- [EKS NodeGroup](../EKS/NodeGroup.md)

## Used By

- [AutoScalingGroup](../AutoScaling/AutoScalingGroup.md)

## List

```sh
gc l -t TargetGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2 ELBv2::TargetGroup from aws                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: target-group-rest                                                     │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:targ… │
│   TargetGroupName: target-group-rest                                        │
│   Protocol: HTTP                                                            │
│   Port: 30020                                                               │
│   VpcId: vpc-055bc1b8bdcbd18ac                                              │
│   HealthCheckProtocol: HTTP                                                 │
│   HealthCheckPort: traffic-port                                             │
│   HealthCheckEnabled: true                                                  │
│   HealthCheckIntervalSeconds: 30                                            │
│   HealthCheckTimeoutSeconds: 5                                              │
│   HealthyThresholdCount: 5                                                  │
│   UnhealthyThresholdCount: 2                                                │
│   HealthCheckPath: /                                                        │
│   Matcher:                                                                  │
│     HttpCode: 200                                                           │
│   LoadBalancerArns:                                                         │
│     - "arn:aws:elasticloadbalancing:us-east-1:840541460064:loadbalancer/ap… │
│   TargetType: instance                                                      │
│   ProtocolVersion: HTTP1                                                    │
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
│       Value: target-group-rest                                              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: target-group-web                                                      │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:targ… │
│   TargetGroupName: target-group-web                                         │
│   Protocol: HTTP                                                            │
│   Port: 30010                                                               │
│   VpcId: vpc-055bc1b8bdcbd18ac                                              │
│   HealthCheckProtocol: HTTP                                                 │
│   HealthCheckPort: traffic-port                                             │
│   HealthCheckEnabled: true                                                  │
│   HealthCheckIntervalSeconds: 30                                            │
│   HealthCheckTimeoutSeconds: 5                                              │
│   HealthyThresholdCount: 5                                                  │
│   UnhealthyThresholdCount: 2                                                │
│   HealthCheckPath: /                                                        │
│   Matcher:                                                                  │
│     HttpCode: 200                                                           │
│   LoadBalancerArns:                                                         │
│     - "arn:aws:elasticloadbalancing:us-east-1:840541460064:loadbalancer/ap… │
│   TargetType: instance                                                      │
│   ProtocolVersion: HTTP1                                                    │
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
│       Value: target-group-web                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                        │
├────────────────────┬───────────────────────────────────────────────────────┤
│ ELBv2::TargetGroup │ target-group-rest                                     │
│                    │ target-group-web                                      │
└────────────────────┴───────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t TargetGroup" executed in 4s
```
