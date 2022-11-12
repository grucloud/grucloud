---
id: TransitGatewayRouteTablePropagation
title: Transit Gateway Route Table Propagation
---

Provides a [Transit Gateway Route Table Propagation](https://console.aws.amazon.com/vpc/home?#TransitGatewayRouteTables:)

```js
exports.createResources = () => [
  {
    type: "TransitGatewayRouteTablePropagation",
    group: "EC2",
    dependencies: ({}) => ({
      transitGatewayRouteTable: "tgw-rtb-transit-gateway-default",
      transitGatewayVpcAttachment: "tgw-attachment",
    }),
  },
];
```

### Examples

- [transit gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/TransitGateway/transit-gateway)
- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-inspection-vpc)

### Properties

- [EnableTransitGatewayRouteTablePropagationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/enabletransitgatewayroutetablepropagationcommandinput.html)

### Dependencies

- [TransitGatewayRouteTable](./TransitGatewayRouteTable.md)
- [TransitGatewayVpcAttachment](./TransitGatewayVpcAttachment.md)

### List

```sh
gc l -t EC2::TransitGatewayRouteTablePropagation
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::TransitGatewayRouteTablePropagation from aws                                   │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ name: tgw-rtb-propagation::tgw-rtb--default::tgw-attachment                           │
│ managedByUs: NO                                                                       │
│ live:                                                                                 │
│   TransitGatewayAttachmentId: tgw-attach-0865ac1d33efd76d4                            │
│   ResourceId: vpc-faff3987                                                            │
│   ResourceType: vpc                                                                   │
│   State: enabled                                                                      │
│   TransitGatewayRouteTableId: tgw-rtb-0fa5835e5b05a23a7                               │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                  │
├──────────────────────────────────────────┬───────────────────────────────────────────┤
│ EC2::TransitGatewayRouteTablePropagation │ tgw-rtb-propagation::tgw-rtb--default::t… │
└──────────────────────────────────────────┴───────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::TransitGatewayRouteTablePropagation" executed in 8s, 178 MB
```
