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

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/Instance/ec2-vpc)
- [vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/vpc)

### Dependencies

- [Vpc](./Vpc.md)
- [InternetGateway](./InternetGateway.md)

## Listing

List only the internet gateway attachments with the `EC2::InternetGatewayAttachment` filter:

```sh
gc l -t EC2::InternetGatewayAttachment
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::InternetGatewayAttachment from aws                                                    │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: ig-attach::ig::vpc-ec2-example                                                         │
│ managedByUs: Yes                                                                             │
│ live:                                                                                        │
│   VpcId: vpc-0dcfae98aa5bd7705                                                               │
│   InternetGatewayId: igw-0e01961b98c435457                                                   │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├────────────────────────────────┬────────────────────────────────────────────────────────────┤
│ EC2::InternetGatewayAttachment │ ig-attach::ig::vpc-ec2-example                             │
└────────────────────────────────┴────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::InternetGatewayAttachment" executed in 7s, 105 MB
```
