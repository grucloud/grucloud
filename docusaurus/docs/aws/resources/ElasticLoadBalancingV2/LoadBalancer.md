---
id: LoadBalancer
title: Load Balancer
---

Manage an [AWS Load Balancer](https://console.aws.amazon.com/ec2/v2/home?#LoadBalancers:).

## Example:

### Load Balancer in a VPC

```js
exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    name: "load-balancer",
    properties: ({}) => ({
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: () => ({
      subnets: ["SubnetPublicUSEAST1D", "SubnetPublicUSEAST1F"],
      securityGroups: ["load-balancer"],
    }),
  },
];
```

### Reference an existing Load Balancer

When using the _AWS Load Balancer Controller_ to create the load balancer & associated resources, there is the need to get a reference to this load balancer.

```js
const clusterName = "cluster";

exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    name: "load-balancer",
    readOnly: true,
    filterLives: ({ resources }) =>
      pipe([
        () => resources,
        find(
          pipe([
            get("live.Tags"),
            find(
              and([
                eq(get("Key"), "elbv2.k8s.aws/cluster"),
                eq(get("Value"), clusterName),
              ])
            ),
          ])
        ),
      ])(),
  },
];
```

## Source Code

- [Load Balancer simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/ElasticLoadBalancingV2/load-balancer)
- [code deploy ecs](https://github.com/grucloud/grucloud/blob/main/examples/aws/CodeDeploy/codedeploy-ecs)
- [EKS with load balancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/EKS/eks-load-balancer)
- [Route53 failover policy](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/routing-failover-policy)
- [serverless-patterns apigw-fargate-cdk](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/apigw-fargate-cdk)
- [serverless-patterns apigw-vpclink-pvt-alb](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb)
- [serverless-patterns fargate-aurora-serverless-cdk](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/fargate-aurora-serverless-cdk)
- [serverless-patterns fargate-eventbridge](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/fargate-eventbridge)
- [wafv2-loadbalancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-loadbalancer)

## Properties

The list of properties are defined in [CreateLoadBalancerCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elastic-load-balancing-v2/interfaces/createloadbalancercommandinput.html)

## Dependencies

- [Subnet](../EC2/Subnet.md)
- [SecurityGroup](../EC2/SecurityGroup.md)

## Used By

- [Route53 Record](../Route53/Record.md)

## List

```sh
gc l -t LoadBalancer
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 5/5
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1 ElasticLoadBalancingV2::LoadBalancer from aws                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: load-balancer                                                         │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   LoadBalancerArn: arn:aws:elasticloadbalancing:us-east-1:123456789123:loa… │
│   DNSName: load-balancer-742239368.us-east-1.elb.amazonaws.com              │
│   CanonicalHostedZoneId: Z35SXDOTRQ7X7K                                     │
│   CreatedTime: 2021-10-29T17:13:03.430Z                                     │
│   LoadBalancerName: load-balancer                                           │
│   Scheme: internet-facing                                                   │
│   VpcId: vpc-055bc1b8bdcbd18ac                                              │
│   State:                                                                    │
│     Code: active                                                            │
│   Type: application                                                         │
│   AvailabilityZones:                                                        │
│     - ZoneName: us-east-1a                                                  │
│       SubnetId: subnet-05ee2729854925587                                    │
│       LoadBalancerAddresses: []                                             │
│     - ZoneName: us-east-1b                                                  │
│       SubnetId: subnet-0ec0f9a0cec61d35b                                    │
│       LoadBalancerAddresses: []                                             │
│   SecurityGroups:                                                           │
│     - "sg-0111f30f176535b9d"                                                │
│   IpAddressType: ipv4                                                       │
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
│       Value: load-balancer                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                        │
├─────────────────────┬──────────────────────────────────────────────────────┤
│ ElasticLoadBalancingV2::LoadBalancer │ load-balancer                                        │
└─────────────────────┴──────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t LoadBalancer" executed in 6s
```
