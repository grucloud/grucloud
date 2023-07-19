---
id: GlobalNetwork
title: Global Network
---

Provides a [Global Network](https://us-west-2.console.aws.amazon.com/networkmanager/home#/networks)

```js
exports.createResources = () => [
  {
    type: "GlobalNetwork",
    group: "NetworkManager",
    name: "cloudwan-module-without",
    properties: ({}) => ({
      Description: "Global Network - AWS CloudWAN Module",
    }),
  },
];
```

### Examples

- [cloud-wan](https://github.com/grucloud/grucloud/blob/main/examples/aws/NetworkManager/cloud-wan)

### Properties

- [CreateGlobalNetworkCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-networkmanager/interfaces/createglobalnetworkcommandinput.html)

### Used By

- [Core Network](./CoreNetwork.md)
- [Site](./Site.md)

### List

```sh
gc l -t GlobalNetwork
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────┐
│ 1 NetworkManager::GlobalNetwork from aws                             │
├──────────────────────────────────────────────────────────────────────┤
│ name: cloudwan-module-without                                        │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   CreatedAt: 2022-07-01T21:04:52.000Z                                │
│   Description: Global Network - AWS CloudWAN Module                  │
│   GlobalNetworkArn: arn:aws:networkmanager::840541460064:global-net… │
│   GlobalNetworkId: global-network-0edaf3ada7cafe3cc                  │
│   State: AVAILABLE                                                   │
│   Tags:                                                              │
│     - Key: gc-created-by-provider                                    │
│       Value: aws                                                     │
│     - Key: gc-managed-by                                             │
│       Value: grucloud                                                │
│     - Key: gc-project-name                                           │
│       Value: cloud-wan                                               │
│     - Key: gc-stage                                                  │
│       Value: dev                                                     │
│     - Key: Name                                                      │
│       Value: cloudwan-module-without                                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────┐
│ aws                                                                 │
├───────────────────────────────┬─────────────────────────────────────┤
│ NetworkManager::GlobalNetwork │ cloudwan-module-without             │
└───────────────────────────────┴─────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t GlobalNetwork" executed in 7s, 111 MB
```
