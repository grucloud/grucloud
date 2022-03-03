---
id: ElasticIpAddress
title: Elastic Ip Address
---

Provides an [Elastic Ip Address](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html) to be associated to an EC2 instance

```js
exports.createResources = () => [
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "eip",
    properties: ({}) => ({
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
  },
];
```

### Properties

- [allocateAddress](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#allocateAddress-property)

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2/resources.js)
- [example with internet gateway and routing table](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc/resources.js)

### Used By

- [EC2](./Instance.md)
- [NatGateway](./NatGateway.md)
