---
id: TransitGatewayRouteTableAssociation
title: Transit Gateway Route Table Association
---

Provides a [Transit Gateway Route Table Association](https://console.aws.amazon.com/vpc/home?#TransitGatewayRouteTables:)

```js
exports.createResources = () => [
  {
    type: "TransitGatewayRouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      transitGatewayVpcAttachment: "tgw-attachment",
      transitGatewayRouteTable: "tgw-rtb-transit-gateway-default",
    }),
  },
];
```

### Examples

- [transit gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/TransitGateway/transit-gateway)
- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-inspection-vpc)

### Properties

- [CreateTransitGatewayRouteTableCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createtransitgatewayroutetablecommandinput.html)

### Dependencies

- [TransitGatewayVpcAttachment](./TransitGatewayVpcAttachment.md)
- [TransitGatewayRouteTable](./TransitGatewayRouteTable.md)

### List

```sh
gc l -t EC2::TransitGatewayRouteTableAssociation
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 3 EC2::TransitGatewayRouteTableAssociation from aws                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: inspection-vpc-attachment::Inspection_VPC_Route_Table                              │
│ managedByUs: Yes                                                                         │
│ live:                                                                                    │
│   TransitGatewayAttachmentId: tgw-attach-09e9dab7e54d8b064                               │
│   TransitGatewayRouteTableId: tgw-rtb-0b8c3178242478505                                  │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: spoke-vpc-1-attachment::Spoke_VPC_Route_Table                                      │
│ managedByUs: Yes                                                                         │
│ live:                                                                                    │
│   TransitGatewayAttachmentId: tgw-attach-0c7311fbcb6e59751                               │
│   TransitGatewayRouteTableId: tgw-rtb-00c4b3773b8d82089                                  │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: spoke-vpc-2-attachment::Spoke_VPC_Route_Table                                      │
│ managedByUs: Yes                                                                         │
│ live:                                                                                    │
│   TransitGatewayAttachmentId: tgw-attach-07bc0fede2f8ba00f                               │
│   TransitGatewayRouteTableId: tgw-rtb-00c4b3773b8d82089                                  │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                     │
├──────────────────────────────────────────┬──────────────────────────────────────────────┤
│ EC2::TransitGatewayRouteTableAssociation │ inspection-vpc-attachment::Inspection_VPC_R… │
│                                          │ spoke-vpc-1-attachment::Spoke_VPC_Route_Tab… │
│                                          │ spoke-vpc-2-attachment::Spoke_VPC_Route_Tab… │
└──────────────────────────────────────────┴──────────────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc l -t EC2::TransitGatewayRouteTableAssociation" executed in 6s, 165 MB
```
