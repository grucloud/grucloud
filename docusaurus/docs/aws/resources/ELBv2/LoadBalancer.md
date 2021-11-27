---
id: LoadBalancer
title: Load Balancer
---

Manage an AWS Load Balancer.

## Example:

### Load Balancer in a VPC

```js
provider.EC2.makeVpc({
  name: "vpc",
  properties: ({ config }) => ({
    CidrBlock: "192.168.0.0/16",
  }),
});

provider.EC2.makeSubnet({
  name: "subnet-a",
  properties: ({ config }) => ({
    CidrBlock: "192.168.0.0/19",
    AvailabilityZone: `${config.region}a`,
  }),
  dependencies: ({ resources }) => ({
    vpc: resources.EC2.Vpc["vpc"],
  }),
});

provider.EC2.makeSubnet({
  name: "subnet-b",
  properties: ({ config }) => ({
    CidrBlock: "192.168.32.0/19",
    AvailabilityZone: `${config.region}b`,
  }),
  dependencies: ({ resources }) => ({
    vpc: resources.EC2.Vpc["vpc"],
  }),
});

provider.EC2.useDefaultSecurityGroup({
  name: "sg-default-vpc",
  dependencies: ({ resources }) => ({
    vpc: resources.EC2.Vpc["vpc"],
  }),
});

provider.ELBv2.makeLoadBalancer({
  name: "load-balancer",
  properties: ({ config }) => ({
    Scheme: "internet-facing",
    Type: "application",
    IpAddressType: "ipv4",
  }),
  dependencies: ({ resources }) => ({
    subnets: [
      resources.EC2.Subnet["subnet-a"],
      resources.EC2.Subnet["subnet-b"],
    ],
    securityGroups: [resources.EC2.SecurityGroup["sg-default-vpc"]],
  }),
});
```

### Reference an existing Load Balancer

When using the _AWS Load Balancer Controller_ to create the load balancer & associated resources, there is the need to get a reference to this load balancer.

```js
const clusterName = "cluster";

provider.ELBv2.useLoadBalancer({
  name: "load-balancer",
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
});

provider.Route53.makeHostedZone({
  name: "grucloud.org.",
  dependencies: ({ resources }) => ({
    domain: resources.Route53Domains.Domain["grucloud.org"],
  }),
});

provider.Route53.makeRecord({
  dependencies: ({ resources }) => ({
    hostedZone: resources.Route53.HostedZone["grucloud.org."],
    loadBalancer: resources.ELBv2.LoadBalancer["load-balancer"],
  }),
});

provider.Route53Domains.useDomain({
  name: "grucloud.org",
});
```

## Source Code

- [Load Balancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/ELBv2/load-balancer/resources.js)

## Dependencies

- [Subnet](../EC2/Subnet.md)
- [SecurityGroup](../EC2/SecurityGroup.md)

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
│ 1 ELBv2::LoadBalancer from aws                                              │
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
│ ELBv2::LoadBalancer │ load-balancer                                        │
└─────────────────────┴──────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t LoadBalancer" executed in 6s
```
