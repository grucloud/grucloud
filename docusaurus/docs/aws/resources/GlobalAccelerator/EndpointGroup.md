---
id: EndpointGroup
title: Endpoint Group
---

Manages a [GlobalAccelerator Endpoint Group](https://us-west-2.console.aws.amazon.com/globalaccelerator/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "EndpointGroup",
    group: "GlobalAccelerator",
    properties: ({ getId }) => ({
      EndpointConfigurations: [
        {
          ClientIPPreservationEnabled: true,
          EndpointId: `${getId({
            type: "LoadBalancer",
            group: "ElasticLoadBalancingV2",
            name: "my-alb",
          })}`,
          Weight: 128,
        },
      ],
      EndpointGroupRegion: "us-east-1",
      HealthCheckIntervalSeconds: 30,
      HealthCheckPort: 443,
      HealthCheckProtocol: "TCP",
      ThresholdCount: 3,
      TrafficDialPercentage: 100,
      AcceleratorName: "my-accelerator",
    }),
    dependencies: ({}) => ({
      listener: "my-accelerator::TCP::443::443",
      loadBalancers: ["my-alb"],
    }),
  },
];
```

## Properties

- [CreateEndpointGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-global-accelerator/interfaces/createendpointgroupcommandinput.html)

## Dependencies

- [GlobalAccelerator Listener](./Listener.md)
- [ElasticLoadBalancingV2 Load Balancer](../ElasticLoadBalancingV2/LoadBalancer.md)
- [EC2 Elastic Ip Address](../EC2/ElasticIpAddress.md)
- [EC2 Instance](../EC2/Instance.md)

## Used By

## Full Examples

- [global-accelerator load balancer](https://github.com/grucloud/grucloud/tree/main/examples/aws/GlobalAccelerator/global-accelerator-loadbalancer)
- [global-accelerator ip address](https://github.com/grucloud/grucloud/tree/main/examples/aws/GlobalAccelerator/global-accelerator-ip-address)
- [global-accelerator ec2 instance](https://github.com/grucloud/grucloud/tree/main/examples/aws/GlobalAccelerator/global-accelerator-ec2-instance)

## List

```sh
gc l -t GlobalAccelerator::EndpointGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 1 GlobalAccelerator::EndpointGroup from aws                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ name: my-accelerator::TCP::443::443::us-east-1                                  │
│ managedByUs: Yes                                                                │
│ live:                                                                           │
│   EndpointConfigurations:                                                       │
│     - ClientIPPreservationEnabled: true                                         │
│       EndpointId: arn:aws:elasticloadbalancing:us-east-1:840541460064:loadbala… │
│       HealthState: UNHEALTHY                                                    │
│       Weight: 128                                                               │
│   EndpointGroupArn: arn:aws:globalaccelerator::840541460064:accelerator/b5bca0… │
│   EndpointGroupRegion: us-east-1                                                │
│   HealthCheckIntervalSeconds: 30                                                │
│   HealthCheckPort: 443                                                          │
│   HealthCheckProtocol: TCP                                                      │
│   ThresholdCount: 3                                                             │
│   TrafficDialPercentage: 100                                                    │
│   ListenerArn: arn:aws:globalaccelerator::840541460064:accelerator/b5bca006-80… │
│   AcceleratorName: my-accelerator                                               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                            │
├──────────────────────────────────┬─────────────────────────────────────────────┤
│ GlobalAccelerator::EndpointGroup │ my-accelerator::TCP::443::443::us-east-1    │
└──────────────────────────────────┴─────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t GlobalAccelerator::EndpointGroup" executed in 7s, 99 MB
```
