---
id: AwsLoadBalancer
title: Load Balancer
---

Manage an AWS Load Balancer.

# Example:

## HTTP Load Balancer in a VPC

```js
const vpc = await provider.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const subnet = await provider.makeSubnet({
  name: "subnet",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});

const securityGroup = await provider.makeSecurityGroup({
  name: "securityGroup",
  dependencies: { vpc },
  properties: () => ({
    create: {
      Description: "Security Group SSH",
    },
    ingress: {
      IpPermissions: [
        {
          FromPort: 22,
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
          ToPort: 22,
        },
      ],
    },
  }),
});

const loadBalancer = await provider.makeLoadBalancer({
  name: "load-balancer",
  dependencies: { subnet, securityGroup },
  properties: () => ({
    Listeners: [
      {
        InstancePort: 80,
        InstanceProtocol: "HTTP",
        LoadBalancerPort: 80,
        Protocol: "HTTP",
      },
    ],
  }),
});
```

# Source Code

- [module AWS EKS]()

# Dependencies

- [SecurityGroup](../EC2/SecurityGroup.md)
- [Subnet](../EC2/Subnet.md)
- [SSL Certificate](../ACM/AcmCertificate.md)
- [Internet Gateway](../EC2/InternetGateway.md)
