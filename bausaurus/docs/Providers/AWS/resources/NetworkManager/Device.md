---
id: Device
title: Device
---

Provides a [Device](https://us-west-2.console.aws.amazon.com/networkmanager/home#/networks)

```js
exports.createResources = () => [];
```

### Examples

- [cloud-wan](https://github.com/grucloud/grucloud/blob/main/examples/aws/NetworkManager/cloud-wan)

### Properties

- [CreateDeviceCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-networkmanager/interfaces/createdevicecommandinput.html)

### Dependencies

- [Global Network](./GlobalNetwork.md)
- [Site](./Site.md)
- [CustomerGatewayAssociation](./CustomerGatewayAssociation.md)

### Used By

- [Connection](./Connection.md)

### List

```sh
gc l -t NetworkManager::Device
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌────────────────────────────────────────────────────────────────────────────┐
│ 1 NetworkManager::Device from aws                                          │
├────────────────────────────────────────────────────────────────────────────┤
│ name: my-device                                                            │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   CreatedAt: 2022-07-02T20:46:27.000Z                                      │
│   DeviceArn: arn:aws:networkmanager::840541460064:device/global-network-0… │
│   DeviceId: device-07de31036acfd312e                                       │
│   GlobalNetworkId: global-network-0a9d457d5fcc23069                        │
│   Location:                                                                │
│     Address: king's street                                                 │
│     Latitude: 0                                                            │
│     Longitude: 0                                                           │
│   Model: switch                                                            │
│   SerialNumber: 123                                                        │
│   SiteId: site-06cbb6420d008d332                                           │
│   State: AVAILABLE                                                         │
│   Tags:                                                                    │
│     - Key: gc-created-by-provider                                          │
│       Value: aws                                                           │
│     - Key: gc-managed-by                                                   │
│       Value: grucloud                                                      │
│     - Key: gc-project-name                                                 │
│       Value: cloud-wan                                                     │
│     - Key: gc-stage                                                        │
│       Value: dev                                                           │
│     - Key: Name                                                            │
│       Value: my-device                                                     │
│   Type: 927                                                                │
│   Vendor: cisco                                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────┐
│ aws                                                                       │
├────────────────────────┬──────────────────────────────────────────────────┤
│ NetworkManager::Device │ my-device                                        │
└────────────────────────┴──────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t NetworkManager::Device" executed in 9s, 112 MB
```
