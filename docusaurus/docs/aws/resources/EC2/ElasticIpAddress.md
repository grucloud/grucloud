---
id: ElasticIpAddress
title: Elastic Ip Address
---

Provides an [Elastic Ip Address](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html) to be associated to an EC2 instance

```js
const ip = provider.EC2.makeElasticIpAddress({
  name: "myip",
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/ec2/iac.js)
- [example with internet gateway and routing table](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/ec2-vpc/iac.js)

### Used By

- [EC2](./EC2)
- [NatGateway](./EC2)
