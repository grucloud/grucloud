---
id: ElasticIpAddress
title: Elastic Ip Address
---

Provides an [Elastic Ip Address](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html) to be associated to an EC2 instance

```js
const ip = await provider.makeElasticIpAddress({
  name: "myip",
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/master/examples/aws/ec2/iac.js)
- [example with internet gateway and routing table](https://github.com/grucloud/grucloud/blob/master/examples/aws/ec2-vpc/iac.js)

### Dependencies

- [EC2](./EC2)

### AWS CLI

List the elastic ip addresses:

```
aws ec2 describe-addresses
```
