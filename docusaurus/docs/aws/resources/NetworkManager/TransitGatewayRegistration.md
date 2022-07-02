---
id: TransitGatewayRegistration
title: Transit Gateway Registration
---

Provides a [Transit Gateway Registration](https://us-west-2.console.aws.amazon.com/networkmanager/home#/networks)

```js
exports.createResources = () => [
  {
    type: "TransitGatewayRegistration",
    group: "NetworkManager",
    dependencies: ({}) => ({
      globalNetwork: "cloudwan-module-without",
      transitGateway: "my-tgw",
    }),
  },
];
```

### Examples

- [cloud-wan](https://github.com/grucloud/grucloud/blob/main/examples/aws/NetworkManager/cloud-wan)

### Properties

- [RegisterTransitGatewayCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-networkmanager/interfaces/registertransitgatewaycommandinput.html)

### Dependencies

- [Global Network](./GlobalNetwork.md)
- [Transit Gateway](../EC2/TransitGateway.md)

### List

```sh
gc l -t NetworkManager::TransitGatewayRegistration
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1 NetworkManager::TransitGatewayRegistration from aws                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: tgw-assoc::cloudwan-module-without::arn:aws:ec2:us-east-1:8405414600… │
│ managedByUs: NO                                                             │
│ live:                                                                       │
│   GlobalNetworkId: global-network-0e047584f629541a5                         │
│   State:                                                                    │
│     Code: AVAILABLE                                                         │
│   TransitGatewayArn: arn:aws:ec2:us-east-1:840541460064:transit-gateway/tg… │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                        │
├────────────────────────────────────────────┬───────────────────────────────┤
│ NetworkManager::TransitGatewayRegistration │ tgw-assoc::cloudwan-module-w… │
└────────────────────────────────────────────┴───────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t NetworkManager::TransitGatewayRegistration" executed in 5s, 104 MB

```
