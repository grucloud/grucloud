---
id: InternetGateway
title: Internet Gateway
---

Provides an [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)

```js
const ig = await provider.makeInternetGateway({
  name: "ig",
});
```

### Examples

- [simple example](https://github.com/FredericHeem/grucloud/blob/master/examples/aws/iac.js)

### Dependencies

- [Vpc](./Vpc)

### AWS CLI

List the internet Gateways

```
aws ec2 describe-internet-gateways
```
