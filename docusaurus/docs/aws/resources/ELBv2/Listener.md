---
id: Listener
title: Listener
---

Manage an [ELB Listener](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html).

## Example

### Http listener

```js
exports.createResources = () => [
  {
    type: "Listener",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Port: 80,
      Protocol: "HTTP",
    }),
    dependencies: () => ({
      loadBalancer: "load-balancer",
      targetGroup: "target-group-web",
    }),
  },
  {
    type: "Listener",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Port: 443,
      Protocol: "HTTPS",
    }),
    dependencies: () => ({
      loadBalancer: "load-balancer",
      targetGroup: "target-group-rest",
      certificate: "grucloud.org",
    }),
  },
];
```

## Properties

The list of properties are defined in [CreateListenerCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elastic-load-balancing-v2/interfaces/createlistenercommandinput.html)

## Source Code

- [Load Balancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/ELBv2/load-balancer/resources.js)

## Dependencies

- [LoadBalancer](./LoadBalancer.md)
- [TargetGroup](./TargetGroup.md)
- [Certificate](../ACM/Certificate.md)

## Used By

- [Api Gateway V2 Integration](../ApiGatewayV2/Integration.md)
- [CodeDeploy DeploymentGroup](../CodeDeployDeploymentGroup.md)

## List

```sh
gc l -t Listener
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 8/8
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2 ELBv2::Listener from aws                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: listener::load-balancer::HTTP::80                                     │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   ListenerArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listene… │
│   LoadBalancerArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:loa… │
│   Port: 80                                                                  │
│   Protocol: HTTP                                                            │
│   Certificates: []                                                          │
│   DefaultActions:                                                           │
│     - Type: forward                                                         │
│       TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:… │
│       ForwardConfig:                                                        │
│         TargetGroups:                                                       │
│           - TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:8405414… │
│             Weight: 1                                                       │
│         TargetGroupStickinessConfig:                                        │
│           Enabled: false                                                    │
│   AlpnPolicy: []                                                            │
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
│       Value: listener::load-balancer::HTTP::80                              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: listener::load-balancer::HTTPS::443                                   │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   ListenerArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:listene… │
│   LoadBalancerArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:loa… │
│   Port: 443                                                                 │
│   Protocol: HTTPS                                                           │
│   Certificates:                                                             │
│     - CertificateArn: arn:aws:acm:us-east-1:840541460064:certificate/bc419… │
│   SslPolicy: ELBSecurityPolicy-2016-08                                      │
│   DefaultActions:                                                           │
│     - Type: forward                                                         │
│       TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:… │
│       ForwardConfig:                                                        │
│         TargetGroups:                                                       │
│           - TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:8405414… │
│             Weight: 1                                                       │
│         TargetGroupStickinessConfig:                                        │
│           Enabled: false                                                    │
│   AlpnPolicy: []                                                            │
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
│       Value: listener::load-balancer::HTTPS::443                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                        │
├─────────────────┬──────────────────────────────────────────────────────────┤
│ ELBv2::Listener │ listener::load-balancer::HTTP::80                        │
│                 │ listener::load-balancer::HTTPS::443                      │
└─────────────────┴──────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t Listener" executed in 6s
```
