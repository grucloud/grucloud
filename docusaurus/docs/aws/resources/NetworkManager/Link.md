---
id: Link
title: Link
---

Provides a [Link](https://us-west-2.console.aws.amazon.com/networkmanager/home#/networks)

```js
exports.createResources = () => [];
```

### Examples

- [cloud-wan](https://github.com/grucloud/grucloud/blob/main/examples/aws/NetworkManager/cloud-wan)

### Properties

- [CreateLinkCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-networkmanager/interfaces/createlinkcommandinput.html)

### Dependencies

- [Global Network](./GlobalNetwork.md)
- [Site](./Site.md)

### Used By

- [Connection](../Connection.md)
- [CustomerGatewayAssociation](../CustomerGatewayAssociation.md)

### List

```sh
gc l -t NetworkManager::Link
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌────────────────────────────────────────────────────────────────────────────┐
│ 1 NetworkManager::Link from aws                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ name: my-link                                                              │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   Bandwidth:                                                               │
│     DownloadSpeed: 1                                                       │
│     UploadSpeed: 1                                                         │
│   CreatedAt: 2022-07-02T20:50:41.000Z                                      │
│   GlobalNetworkId: global-network-0a9d457d5fcc23069                        │
│   LinkArn: arn:aws:networkmanager::840541460064:link/global-network-0a9d4… │
│   LinkId: link-0a9a01c05c66adcc0                                           │
│   SiteId: site-06cbb6420d008d332                                           │
│   State: AVAILABLE                                                         │
│   Tags:                                                                    │
│     - Key: Name                                                            │
│       Value: my-link                                                       │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────┐
│ aws                                                                       │
├──────────────────────┬────────────────────────────────────────────────────┤
│ NetworkManager::Link │ my-link                                            │
└──────────────────────┴────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t NetworkManager::Link" executed in 11s, 108 MB
```
