---
id: TransitGateway
title: Transit Gateway
---

Provides a [Transit Gateway](https://console.aws.amazon.com/vpc/home?#TransitGateways:)

```js
exports.createResources = () => [
  {
    type: "TransitGateway",
    group: "EC2",
    name: "transit-gateway",
    properties: ({}) => ({
      Description: "",
      Options: {
        AmazonSideAsn: 64512,
        AutoAcceptSharedAttachments: "disable",
        DefaultRouteTableAssociation: "enable",
        DefaultRouteTablePropagation: "enable",
        VpnEcmpSupport: "enable",
        DnsSupport: "enable",
        MulticastSupport: "disable",
      },
    }),
  },
];
```

### Examples

- [transit gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/transit-gateway)
- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/hub-and-spoke-with-inspection-vpc)

### Properties

- [CreateTransitGatewayCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createtransitgatewaycommandinput.html)

### Used By

- [TransitGatewayAttachment](./TransitGatewayAttachment.md)

### List

```sh
gc l -t EC2::TransitGateway
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::TransitGateway from aws                                             │
├────────────────────────────────────────────────────────────────────────────┤
│ name: terraform-transit-gateway                                            │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   TransitGatewayId: tgw-0253874e089f68280                                  │
│   TransitGatewayArn: arn:aws:ec2:us-east-1:840541460064:transit-gateway/t… │
│   State: available                                                         │
│   OwnerId: 840541460064                                                    │
│   Description: Transit Gateway                                             │
│   CreationTime: 2022-05-02T13:40:13.000Z                                   │
│   Options:                                                                 │
│     AmazonSideAsn: 64512                                                   │
│     AutoAcceptSharedAttachments: disable                                   │
│     DefaultRouteTableAssociation: disable                                  │
│     DefaultRouteTablePropagation: disable                                  │
│     VpnEcmpSupport: enable                                                 │
│     DnsSupport: enable                                                     │
│     MulticastSupport: disable                                              │
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
│       Value: terraform-transit-gateway                                     │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────┐
│ aws                                                                       │
├─────────────────────┬─────────────────────────────────────────────────────┤
│ EC2::TransitGateway │ terraform-transit-gateway                           │
└─────────────────────┴─────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::TransitGateway" executed in 4s, 145 MB
```
