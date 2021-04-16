---
id: AwsLoadBalancer
title: Load Balancer
---

Manage an AWS Load Balancer.

## Example:

### Load Balancer in a VPC

```js
const vpc = await provider.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const subnetA = await provider.makeSubnet({
  name: "subnetA",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});

const subnetB = await provider.makeSubnet({
  name: "subnetB",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.1.1/24",
  }),
});

const securityGroup = await provider.makeSecurityGroup({
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

const loadBalancer = await provider.makeLoadBalancer({
  name: "load-balancer",
  dependencies: {
    subnets: [subnetA, subnetA],
    securityGroups: [securityGroup],
  },
});
```

## Source Code

- [module AWS EKS]()

## Dependencies

- [SecurityGroup](../EC2/SecurityGroup.md)
- [Subnet](../EC2/Subnet.md)
