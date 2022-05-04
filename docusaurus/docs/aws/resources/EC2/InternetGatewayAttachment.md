---
id: InternetGatewayAttachment
title: Internet Gateway Attachment
---

Provides an [Internet Gateway Attachment](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)

```js
exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "192.168.0.0/16",
    }),
  },
  {
    type: "InternetGateway",
    group: "EC2",
    name: "internet-gateway",
  },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: () => ({
      vpc: "vpc",
      internetGateway: "internet-gateway",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc)

### Dependencies

- [Vpc](./Vpc.md)
- [InternetGateway](./InternetGateway.md)

## Listing

List only the internet gateway with the _InternetGateway_ filter:

```sh
gc l -t EC2::InternetGatewayAttachment
```

```txt

```
