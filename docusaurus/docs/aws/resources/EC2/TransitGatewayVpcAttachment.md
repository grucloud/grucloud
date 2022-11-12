---
id: TransitGatewayVpcAttachment
title: Transit Gateway Vpc Attachment
---

Provides a [Transit Gateway Vpc Attachment](https://console.aws.amazon.com/vpc/home#TransitGatewayAttachments:)

```js
exports.createResources = () => [
  {
    type: "TransitGatewayVpcAttachment",
    group: "EC2",
    name: "tgw-attachment",
    properties: ({}) => ({
      Options: {
        DnsSupport: "enable",
        Ipv6Support: "disable",
        ApplianceModeSupport: "disable",
      },
    }),
    dependencies: () => ({
      transitGateway: "transit-gateway",
      vpc: "vpc-default",
      subnets: ["subnet-default-a", "subnet-default-b"],
    }),
  },
];
```

### Examples

- [transit gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/TransitGateway/transit-gateway)
- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-inspection-vpc)

### Properties

- [CreateTransitGatewayCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createtransitgatewaycommandinput.html)

### Dependencies

- [Vpc](./Vpc.md)
- [TransitGateway](./TransitGateway.md)
- [Subnet](./Subnet.md)

### List

```sh
gc l -t TransitGatewayVpcAttachment
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────┐
│ 3 EC2::TransitGatewayVpcAttachment from aws                                │
├────────────────────────────────────────────────────────────────────────────┤
│ name: inspection-vpc-attachment                                            │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   TransitGatewayAttachmentId: tgw-attach-09e9dab7e54d8b064                 │
│   TransitGatewayId: tgw-0253874e089f68280                                  │
│   VpcId: vpc-0cff0121f1d6232bc                                             │
│   VpcOwnerId: 840541460064                                                 │
│   State: available                                                         │
│   SubnetIds:                                                               │
│     - "subnet-0b831f3df83c3390a"                                           │
│     - "subnet-0eb7135c9b4481de0"                                           │
│     - "subnet-06c03c52e4554dc14"                                           │
│   CreationTime: 2022-05-02T13:42:43.000Z                                   │
│   Options:                                                                 │
│     DnsSupport: enable                                                     │
│     Ipv6Support: disable                                                   │
│     ApplianceModeSupport: disable                                          │
│   Tags:                                                                    │
│     - Key: gc-created-by-provider                                          │
│       Value: aws                                                           │
│     - Key: gc-managed-by                                                   │
│       Value: grucloud                                                      │
│     - Key: gc-project-name                                                 │
│       Value: hub-and-spoke-with-inspection-vpc                             │
│     - Key: gc-stage                                                        │
│       Value: dev                                                           │
│     - Key: Name                                                            │
│       Value: inspection-vpc-attachment                                     │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ name: spoke-vpc-1-attachment                                               │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   TransitGatewayAttachmentId: tgw-attach-0c7311fbcb6e59751                 │
│   TransitGatewayId: tgw-0253874e089f68280                                  │
│   VpcId: vpc-088476e99380a49ac                                             │
│   VpcOwnerId: 840541460064                                                 │
│   State: available                                                         │
│   SubnetIds:                                                               │
│     - "subnet-0002aa299162984c1"                                           │
│     - "subnet-031cb5fec7ef11569"                                           │
│     - "subnet-0f29155b8f9949b52"                                           │
│   CreationTime: 2022-05-02T13:42:43.000Z                                   │
│   Options:                                                                 │
│     DnsSupport: enable                                                     │
│     Ipv6Support: disable                                                   │
│     ApplianceModeSupport: disable                                          │
│   Tags:                                                                    │
│     - Key: gc-created-by-provider                                          │
│       Value: aws                                                           │
│     - Key: gc-managed-by                                                   │
│       Value: grucloud                                                      │
│     - Key: gc-project-name                                                 │
│       Value: hub-and-spoke-with-inspection-vpc                             │
│     - Key: gc-stage                                                        │
│       Value: dev                                                           │
│     - Key: Name                                                            │
│       Value: spoke-vpc-1-attachment                                        │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ name: spoke-vpc-2-attachment                                               │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   TransitGatewayAttachmentId: tgw-attach-07bc0fede2f8ba00f                 │
│   TransitGatewayId: tgw-0253874e089f68280                                  │
│   VpcId: vpc-0b961f651f3eb5466                                             │
│   VpcOwnerId: 840541460064                                                 │
│   State: available                                                         │
│   SubnetIds:                                                               │
│     - "subnet-03abd54ea1f05c3ff"                                           │
│     - "subnet-094de92d30accece5"                                           │
│     - "subnet-06e894560f4bc6e99"                                           │
│   CreationTime: 2022-05-02T13:42:43.000Z                                   │
│   Options:                                                                 │
│     DnsSupport: enable                                                     │
│     Ipv6Support: disable                                                   │
│     ApplianceModeSupport: disable                                          │
│   Tags:                                                                    │
│     - Key: gc-created-by-provider                                          │
│       Value: aws                                                           │
│     - Key: gc-managed-by                                                   │
│       Value: grucloud                                                      │
│     - Key: gc-project-name                                                 │
│       Value: hub-and-spoke-with-inspection-vpc                             │
│     - Key: gc-stage                                                        │
│       Value: dev                                                           │
│     - Key: Name                                                            │
│       Value: spoke-vpc-2-attachment                                        │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────┐
│ aws                                                                       │
├──────────────────────────────────┬────────────────────────────────────────┤
│ EC2::TransitGatewayVpcAttachment │ inspection-vpc-attachment              │
│                                  │ spoke-vpc-1-attachment                 │
│                                  │ spoke-vpc-2-attachment                 │
└──────────────────────────────────┴────────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc l -t TransitGatewayVpcAttachment" executed in 4s, 136 MB
```
