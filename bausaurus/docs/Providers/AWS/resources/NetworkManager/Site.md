---
id: Site
title: Site
---

Provides a [Site](https://us-west-2.console.aws.amazon.com/networkmanager/home#/networks)

```js
exports.createResources = () => [
  {
    type: "Site",
    group: "NetworkManager",
    name: "office",
    properties: ({}) => ({
      Location: {
        Address: "rue de la paix",
        Latitude: "0",
        Longitude: "0",
      },
    }),
    dependencies: ({}) => ({
      globalNetwork: "cloudwan-module-without",
    }),
  },
];
```

### Examples

- [cloud-wan](https://github.com/grucloud/grucloud/blob/main/examples/aws/NetworkManager/cloud-wan)

### Properties

- [CreateSiteCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-networkmanager/interfaces/createsitecommandinput.html)

### Dependencies

- [Global Network](./GlobalNetwork.md)

### Used By

- [Device](./Device.md)

### List

```sh
gc l -t NetworkManager::Site
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1 NetworkManager::Site from aws                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: office                                                                │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   CreatedAt: 2022-07-02T15:03:59.000Z                                       │
│   GlobalNetworkId: global-network-0e047584f629541a5                         │
│   Location:                                                                 │
│     Address: rue de la paix                                                 │
│     Latitude: 0                                                             │
│     Longitude: 0                                                            │
│   SiteArn: arn:aws:networkmanager::840541460064:site/global-network-0e0475… │
│   SiteId: site-02c131567cc36cd69                                            │
│   State: AVAILABLE                                                          │
│   Tags:                                                                     │
│     - Key: Name                                                             │
│       Value: office                                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                        │
├──────────────────────┬─────────────────────────────────────────────────────┤
│ NetworkManager::Site │ office                                              │
└──────────────────────┴─────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t NetworkManager::Site" executed in 6s, 104 MB
```
