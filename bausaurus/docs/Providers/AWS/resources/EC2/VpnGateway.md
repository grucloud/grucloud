---
id: VpnGateway
title: Vpn Gateway
---

Provides a [Vpn Gateway](https://console.aws.amazon.com/vpc/home?#VpnGateways:)

```js
exports.createResources = () => [
  {
    type: "VpnGateway",
    group: "EC2",
    name: "vpw",
    properties: ({}) => ({
      AmazonSideAsn: 64512,
    }),
  },
];
```

### Examples

- [site2site](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/site2site)
- [vpn aws azure](https://github.com/grucloud/grucloud/blob/main/examples/cross-cloud/vpn-aws-azure)

### Properties

- [CreateVpnGatewayCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createvpngatewaycommandinput.html)

### Used By

- [EC2 Route](./Route.md)
- [VpnConnection](./VpnConnection.md)
- [VpnGatewayAttachment](./VpnGatewayAttachment.md)
- [VpnGatewayRoutePropagation](./VpnGatewayRoutePropagation.md)

### List

```sh
gc l -t VpnGateway
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────┐
│ 1 EC2::VpnGateway from aws                                          │
├─────────────────────────────────────────────────────────────────────┤
│ name: vpw                                                           │
│ managedByUs: Yes                                                    │
│ live:                                                               │
│   State: available                                                  │
│   Type: ipsec.1                                                     │
│   VpcAttachments: []                                                │
│   VpnGatewayId: vgw-06555515abec40521                               │
│   AmazonSideAsn: 64512                                              │
│   Tags:                                                             │
│     - Key: gc-created-by-provider                                   │
│       Value: aws                                                    │
│     - Key: gc-managed-by                                            │
│       Value: grucloud                                               │
│     - Key: gc-project-name                                          │
│       Value: customer-gateway                                       │
│     - Key: gc-stage                                                 │
│       Value: dev                                                    │
│     - Key: Name                                                     │
│       Value: vpw                                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────┐
│ aws                                                                │
├─────────────────┬──────────────────────────────────────────────────┤
│ EC2::VpnGateway │ vpw                                              │
└─────────────────┴──────────────────────────────────────────────────┘
1 resources, 1 type, 1 provider
Command "gc l -t VpnGateway" executed in 4s, 96 MB
```
