---
id: AwsLoadBalancer
title: Load Balancer
---

Manage an AWS Load Balancer.

## Example:

### Load Balancer in a VPC

```js
const vpc = await provider.ec2.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const subnetA = await provider.ec2.makeSubnet({
  name: "subnetA",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});

const subnetB = await provider.ec2.makeSubnet({
  name: "subnetB",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.1.1/24",
  }),
});

const securityGroup = await provider.ec2.makeSecurityGroup({
  name: "security-group-balancer",
  dependencies: { vpc },
  properties: () => ({
    create: {
      Description: "Load Balancer Security Group",
    },
    ingress: {
      IpPermissions: [
        {
          FromPort: 80,
          IpProtocol: "tcp",
          IpRanges: [
            {
              CidrIp: "0.0.0.0/0",
            },
          ],
          Ipv6Ranges: [
            {
              CidrIpv6: "::/0",
            },
          ],
          ToPort: 80,
        },
      ],
    },
  }),
});

const loadBalancer = await provider.elb.makeLoadBalancer({
  name: "load-balancer",
  dependencies: {
    subnets: [subnetA, subnetA],
    securityGroups: [securityGroup],
  },
});
```

### Reference an existing Load Balancer

When using the _AWS Load Balancer Controller_ to create the load balancer & associated resources, there is the need to get a reference to this load balancer. _DNSName_ and _CanonicalHostedZoneId_ are 2 pieces of information required to create a DNS record which maps a DNS name to the load balancer DNS name.

```js
const clusterName = "cluster";
const domainName = "test-load-balancer.grucloud.org";

const loadBalancer = await provider.elb.useLoadBalancer({
  name: "load-balancer",
  filterLives: ({ items }) =>
    pipe([
      () => items,
      find(
        pipe([
          get("Tags"),
          find(
            and([
              eq(get("Key"), "elbv2.k8s.aws/cluster"),
              eq(get("Value"), clusterName),
            ])
          ),
        ])
      ),
      tap((lb) => {
        // log here
      }),
    ])(),
});

const hostedZone = await provider.route53.makeHostedZone({
  name: `${domainName}.`,
});

const loadBalancerRecord = await provider.route53.makeRecord({
  name: `dns-record-alias-load-balancer-${hostedZoneName}`,
  dependencies: { hostedZone, loadBalancer },
  properties: ({ dependencies }) => {
    const hostname = dependencies.loadBalancer.live?.DNSName;
    if (!hostname) {
      return {
        message: "loadBalancer not up yet",
        Type: "A",
        Name: hostedZone.name,
      };
    }
    return {
      Name: hostedZone.name,
      Type: "A",
      AliasTarget: {
        HostedZoneId: dependencies.loadBalancer?.live.CanonicalHostedZoneId,
        DNSName: `${hostname}.`,
        EvaluateTargetHealth: false,
      },
    };
  },
});
```

## Source Code

- [Load Balancer Module](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/load-balancer/iac.js)

## Dependencies

- [Subnet](../EC2/Subnet.md)
- [SecurityGroup](../EC2/SecurityGroup.md)

## List

```sh
gc l -t LoadBalancer
```

```sh
Listing resources on 2 providers: aws, k8s
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
✓ k8s
  ✓ Initialising
  ✓ Listing
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 1 LoadBalancer from aws                                                          │
├───────────────┬───────────────────────────────────────────────────────────┬──────┤
│ Name          │ Data                                                      │ Our  │
├───────────────┼───────────────────────────────────────────────────────────┼──────┤
│ load-balancer │ LoadBalancerArn: arn:aws:elasticloadbalancing:eu-west-2:… │ Yes  │
│               │ DNSName: load-balancer-298589237.eu-west-2.elb.amazonaws… │      │
│               │ CanonicalHostedZoneId: ZHURV8PSTC4K8                      │      │
│               │ CreatedTime: 2021-04-16T19:17:58.750Z                     │      │
│               │ LoadBalancerName: load-balancer                           │      │
│               │ Scheme: internet-facing                                   │      │
│               │ VpcId: vpc-03b8d521b703d6c46                              │      │
│               │ State:                                                    │      │
│               │   Code: active                                            │      │
│               │ Type: application                                         │      │
│               │ AvailabilityZones:                                        │      │
│               │   - ZoneName: eu-west-2a                                  │      │
│               │     SubnetId: subnet-053363a740a209ba8                    │      │
│               │     LoadBalancerAddresses: []                             │      │
│               │   - ZoneName: eu-west-2b                                  │      │
│               │     SubnetId: subnet-0a7a0a47b7130c01f                    │      │
│               │     LoadBalancerAddresses: []                             │      │
│               │ SecurityGroups:                                           │      │
│               │   - "sg-07601a1066ed23072"                                │      │
│               │ IpAddressType: ipv4                                       │      │
│               │ Tags:                                                     │      │
│               │   - Key: ManagedBy                                        │      │
│               │     Value: GruCloud                                       │      │
│               │   - Key: stage                                            │      │
│               │     Value: dev                                            │      │
│               │   - Key: projectName                                      │      │
│               │     Value: starhackit                                     │      │
│               │   - Key: CreatedByProvider                                │      │
│               │     Value: aws                                            │      │
│               │   - Key: Name                                             │      │
│               │     Value: load-balancer                                  │      │
│               │                                                           │      │
└───────────────┴───────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: k8s
┌─────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                             │
├────────────────────┬────────────────────────────────────────────────────────────┤
│ LoadBalancer       │ load-balancer                                              │
└────────────────────┴────────────────────────────────────────────────────────────┘
1 resource, 1 type, 2 providers
Command "gc l -t LoadBalancer" executed in 7s
```
