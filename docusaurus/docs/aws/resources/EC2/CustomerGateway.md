---
id: CustomerGateway
title: Customer Gateway
---

Provides a [Customer Gateway](https://console.aws.amazon.com/vpc/home?#CustomerGateways:)

```js
exports.createResources = () => [
  {
    type: "CustomerGateway",
    group: "EC2",
    name: "cgw",
    properties: ({}) => ({
      BgpAsn: "65000",
      IpAddress: "1.1.1.1",
    }),
  },
];
```

### Examples

- [site2site](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/site2site)

### Properties

- [CreateCustomerGatewayCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createcustomergatewaycommandinput.html)

### Used By

- [VpnConnection](./VpnConnection.md)

### List

```sh
gc l -t CustomerGateway
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────┐
│ 1 EC2::CustomerGateway from aws                                     │
├─────────────────────────────────────────────────────────────────────┤
│ name: cgw                                                           │
│ managedByUs: Yes                                                    │
│ live:                                                               │
│   BgpAsn: 65000                                                     │
│   CustomerGatewayId: cgw-0d899ea9051e3fdc1                          │
│   IpAddress: 1.1.1.1                                                │
│   State: available                                                  │
│   Type: ipsec.1                                                     │
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
│       Value: cgw                                                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────┐
│ aws                                                                │
├──────────────────────┬─────────────────────────────────────────────┤
│ EC2::CustomerGateway │ cgw                                         │
└──────────────────────┴─────────────────────────────────────────────┘
1 resources, 1 type, 1 provider
Command "gc l -t CustomerGateway" executed in 4s, 96 MB
```
