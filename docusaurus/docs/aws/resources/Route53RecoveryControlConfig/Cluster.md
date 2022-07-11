---
id: Cluster
title: Cluster
---

Provides [Route53 Recovery Control Config Cluster](https://us-west-2.console.aws.amazon.com/route53recovery/home#/recovery-control/clusters)

## Examples

```js
exports.createResources = () => [
  {
    type: "Cluster",
    group: "Route53RecoveryControlConfig",
    properties: ({}) => ({
      ClusterName: "cluster",
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53RecoveryControlConfig/route53-recovery-control-config)

## Properties

- [CreateClusterCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53-recovery-control-config/interfaces/createclustercommandinput.html)

## Dependencies

## Used By

- [Control Panel](./ControlPanel.md)

## List

List the endpoints with the **Route53RecoveryControlConfig::Cluster** filter:

```sh
gc list -t Route53RecoveryControlConfig::Cluster
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 Route53RecoveryControlConfig::Cluster from aws                          │
├───────────────────────────────────────────────────────────────────────────┤
│ name: cluster                                                             │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   ClusterName: cluster                                                    │
│   ClusterArn: arn:aws:route53-recovery-control::840541460064:cluster/47e… │
│   ClusterEndpoints:                                                       │
│     - Endpoint: https://d0c9a257.route53-recovery-cluster.us-east-1.amaz… │
│       Region: us-east-1                                                   │
│     - Endpoint: https://ad904966.route53-recovery-cluster.ap-northeast-1… │
│       Region: ap-northeast-1                                              │
│     - Endpoint: https://c38f3392.route53-recovery-cluster.eu-west-1.amaz… │
│       Region: eu-west-1                                                   │
│     - Endpoint: https://a590916a.route53-recovery-cluster.ap-southeast-2… │
│       Region: ap-southeast-2                                              │
│     - Endpoint: https://8b3244b0.route53-recovery-cluster.us-west-2.amaz… │
│       Region: us-west-2                                                   │
│   Status: DEPLOYED                                                        │
│   Tags:                                                                   │
│     gc-managed-by: grucloud                                               │
│     gc-project-name: route53-recovery-control-config                      │
│     gc-stage: dev                                                         │
│     gc-created-by-provider: aws                                           │
│     Name: cluster                                                         │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├───────────────────────────────────────┬──────────────────────────────────┤
│ Route53RecoveryControlConfig::Cluster │ cluster                          │
└───────────────────────────────────────┴──────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t Route53RecoveryControlConfig::Cluster" executed in 5s, 114 MB

```
