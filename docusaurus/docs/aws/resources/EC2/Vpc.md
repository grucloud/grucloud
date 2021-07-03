---
id: Vpc
title: Vpc
---

Provide a Virtual Private Cloud:

## Examples

### Simple Vpc

```js
const vpc = provider.ec2.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});
```

### Vpc with Tags

```js
const clusterName = "cluster";

const vpc = provider.ec2.makeVpc({
  name: "vpc-eks",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
    Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "shared" }],
  }),
});
```

### Vpc with DnsHostnames and DnsSupport

```js
const clusterName = "cluster";

const vpc = provider.ec2.makeVpc({
  name: "vpc",
  properties: () => ({
    DnsHostnames: true,
    DnsSupport: true,
    CidrBlock: "10.1.0.0/16",
  }),
});
```

## Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-vpc/iac.js#L13)
- [module vpc](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/vpc/iac.js)

## Used By

- [Subnet](./Subnet)
- [Security Group](./SecurityGroup)
- [Internet Gateway ](./InternetGateway)
