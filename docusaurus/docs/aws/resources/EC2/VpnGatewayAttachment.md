---
id: VpnGatewayAttachment
title: Vpn Gateway Attachment
---

Provides a [Vpn Gateway Attachment](https://console.aws.amazon.com/vpc/home?#VpnGateways:)

```js
exports.createResources = () => [
  {
    type: "VpnGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "vpc-vpn",
      vpnGateway: "vpw",
    }),
  },
];
```

### Examples

- [site2site](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/site2site)

### Properties

- [AttachVpnGatewayCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/attachvpngatewaycommandinput.html)

### Dependencies

- [EC2 Vpc](./Vpc.md)
- [EC2 Vpn Gateway](./VpnGateway.md)

### List

```sh
gc l -t EC2::VpnGatewayAttachment
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::VpnGatewayAttachment from aws                                                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ name: vpn-gw-attach::vpw::vpc-vpn                                                      │
│ managedByUs: Yes                                                                       │
│ live:                                                                                  │
│   State: attached                                                                      │
│   VpcId: vpc-005e818650b3a73a3                                                         │
│   VpnGatewayId: vgw-0983be2378ac90841                                                  │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                   │
├───────────────────────────┬───────────────────────────────────────────────────────────┤
│ EC2::VpnGatewayAttachment │ vpn-gw-attach::vpw::vpc-vpn                               │
└───────────────────────────┴───────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::VpnGatewayAttachment" executed in 3s, 105 MB
```
