---
id: RouteTables
title: Route Tables
---

Provides a [Route Tables](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html)

```js
const vpc = await provider.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});
const ig = await provider.makeInternetGateway({
  name: "ig",
  dependencies: { vpc },
});

const subnet = await provider.makeSubnet({
  name: "subnet",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});
const rt = await provider.makeRouteTable({
  name: "rt",
  dependencies: { vpc, subnet, ig },
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-vpc/iac.js)

### Dependencies

- [Vpc](./Vpc)
- [Subnet](./Subnet)
- [InternetGateway](./InternetGateway)

### AWS CLI

List the route tables

```
aws ec2 describe-route-tables
```
