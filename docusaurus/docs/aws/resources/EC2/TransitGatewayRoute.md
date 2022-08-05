---
id: TransitGatewayRoute
title: Transit Gateway Route
---

Provides a [Transit Gateway Route](https://console.aws.amazon.com/vpc/home?#TransitGatewayRouteTables:)

```js
exports.createResources = () => [
  {
    type: "TransitGatewayRoute",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      transitGatewayRouteTable: "tgw-rtb-transit-gateway-default",
      transitGatewayVpcAttachment: "tgw-attachment",
    }),
  },
];
```

### Examples

- [transit gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/transit-gateway)
- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/hub-and-spoke-with-inspection-vpc)

### Properties

- [CreateTransitGatewayRouteCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createtransitgatewayroutecommandinput.html)

### Dependencies

- [TransitGatewayVpcAttachment](./TransitGatewayVpcAttachment.md)
- [TransitGatewayRouteTable](./TransitGatewayRouteTable.md)

### List

```sh
gc l -t EC2::TransitGatewayRoute
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌───────────────────────────────────────────────────────────────────┐
│ 1 EC2::TransitGatewayRoute from aws                               │
├───────────────────────────────────────────────────────────────────┤
│ name: tgw-route::tgw-attachment::tgw-rtb--default::0.0.0.0/0      │
│ managedByUs: NO                                                   │
│ live:                                                             │
│   DestinationCidrBlock: 0.0.0.0/0                                 │
│   State: active                                                   │
│   TransitGatewayRouteTableId: tgw-rtb-01e2e0a273b7d2ac3           │
│   TransitGatewayAttachmentId: tgw-attach-02d27b501d16b7c68        │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```
