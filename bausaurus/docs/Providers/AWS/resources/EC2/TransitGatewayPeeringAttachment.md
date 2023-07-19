---
id: TransitGatewayPeeringAttachment
title: Transit Gateway Peering Attachment
---

Provides a [Transit Gateway Peering Attachment](https://console.aws.amazon.com/vpc/home#TransitGatewayAttachments:)

```js
exports.createResources = () => [
  {
    type: "TransitGatewayPeeringAttachment",
    group: "EC2",
    properties: ({ config }) => ({
      RequesterTgwInfo: {
        OwnerId: `${config.accountId()}`,
        Region: config.region,
      },
      AccepterTgwInfo: {
        OwnerId: `${config.accountId()}`,
        Region: config.regionSecondary,
      },
    }),
    dependencies: ({}) => ({
      transitGateway: "tgw-requester",
      transitGatewayPeer: "tgw-acceptor",
    }),
  },
];
```

### Examples

- [transit gateway peering](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/TransitGateway/transit-gateway-peering)

### Properties

- [CreateTransitGatewayPeeringAttachmentCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createtransitgatewaypeeringattachmentcommandinput.html)

### Dependencies

- [TransitGateway](./TransitGateway.md)

### List

```sh
gc l -t EC2::TransitGatewayPeeringAttachment
```

```txt
Listing resources on 2 providers: aws-primary, aws-secondary
✓ aws-primary us-east-1 regionA
  ✓ Initialising
  ✓ Listing 2/2
✓ aws-secondary us-west-2 regionB
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::TransitGatewayPeeringAttachment from aws-primary                                  │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: tgw-peering                                                                        │
│ managedByUs: Yes                                                                         │
│ live:                                                                                    │
│   TransitGatewayAttachmentId: tgw-attach-010aa03e98b8caa6a                               │
│   RequesterTgwInfo:                                                                      │
│     TransitGatewayId: tgw-08fa443f1d3a417d6                                              │
│     OwnerId: 840541460064                                                                │
│     Region: us-east-1                                                                    │
│   AccepterTgwInfo:                                                                       │
│     TransitGatewayId: tgw-03b5c4df046999016                                              │
│     OwnerId: 840541460064                                                                │
│     Region: us-west-2                                                                    │
│   Status:                                                                                │
│     Code: pending-acceptance                                                             │
│     Message: Pending Acceptance by 840541460064                                          │
│   State: pendingAcceptance                                                               │
│   CreationTime: 2022-08-05T14:31:20.000Z                                                 │
│   Tags:                                                                                  │
│     - Key: gc-created-by-provider                                                        │
│       Value: aws-primary                                                                 │
│     - Key: gc-managed-by                                                                 │
│       Value: grucloud                                                                    │
│     - Key: gc-project-name                                                               │
│       Value: transit-gateway-peering                                                     │
│     - Key: gc-stage                                                                      │
│       Value: dev                                                                         │
│     - Key: Name                                                                          │
│       Value: tgw-peering                                                                 │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘


```
