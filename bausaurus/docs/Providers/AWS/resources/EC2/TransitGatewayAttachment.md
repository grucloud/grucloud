---
id: TransitGatewayAttachment
title: Transit Gateway Attachment
---

Provides a [Transit Gateway Attachment](https://console.aws.amazon.com/vpc/home#TransitGatewayAttachments:)

```js
exports.createResources = () => [
  {
    type: "TransitGatewayAttachment",
    group: "EC2",
    name: "tgw-attach::tgw::vpn::vpn-connection",
    readOnly: true,
    properties: ({}) => ({
      ResourceType: "vpn",
    }),
    dependencies: ({}) => ({
      transitGateway: "tgw",
      vpnConnection: "vpn-connection",
    }),
  },
];
```

### Examples

- [flow-logs-tgw-vpn](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-tgw-vpn)

### Properties

- [CreateTransitGatewayCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createtransitgatewaycommandinput.html)

### Dependencies

- [TransitGateway](./TransitGateway.md)
- [VpnConnection](./VpnConnection.md)

### List

```sh
gc l -t EC2::TransitGatewayAttachment
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::TransitGatewayAttachment from aws                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: tgw-attach::tgw-09547b88bbdb2ac86::vpn::vpn-0b9245694abbd2b12                          │
│ managedByUs: NO                                                                              │
│ live:                                                                                        │
│   TransitGatewayAttachmentId: tgw-attach-05c106d9430c6ee85                                   │
│   TransitGatewayId: tgw-09547b88bbdb2ac86                                                    │
│   TransitGatewayOwnerId: 840541460064                                                        │
│   ResourceOwnerId: 840541460064                                                              │
│   ResourceType: vpn                                                                          │
│   ResourceId: vpn-0b9245694abbd2b12                                                          │
│   State: available                                                                           │
│   Association:                                                                               │
│     TransitGatewayRouteTableId: tgw-rtb-0631c6177f6066925                                    │
│     State: associated                                                                        │
│   CreationTime: 2022-08-01T15:05:19.000Z                                                     │
│   Tags: []                                                                                   │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├───────────────────────────────┬─────────────────────────────────────────────────────────────┤
│ EC2::TransitGatewayAttachment │ tgw-attach::tgw-09547b88bbdb2ac86::vpn::vpn-0b9245694abbd2… │
└───────────────────────────────┴─────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::TransitGatewayAttachment" executed in 6s, 116 MB
```
