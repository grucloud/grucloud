---
id: Vpc
title: Vpc
---

Provide a Virtual Private Cloud:

## Examples

### Simple Vpc

```js
exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
];
```

### Vpc with Tags

```js
const clusterName = "cluster";

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
      Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "shared" }],
    }),
  },
];
```

### Vpc with DnsHostnames and DnsSupport

```js
exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "Vpc",
    properties: ({}) => ({
      DnsHostnames: true,
      DnsSupport: true,
      CidrBlock: "10.1.0.0/16",
    }),
  },
];

const vpc = provider.EC2.makeVpc({
  name: "vpc",
  properties: () => ({
    DnsHostnames: true,
    DnsSupport: true,
    CidrBlock: "10.1.0.0/16",
  }),
});
```

## Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/ec2-vpc/resources.js)

## Used By

- [Subnet](./Subnet.md)
- [Security Group](./SecurityGroup.md)
- [Internet Gateway ](./InternetGateway.md)
