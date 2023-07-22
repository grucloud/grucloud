---
id: VpnConnectionRoute
title: Vpn Connection Route
---

Provides a [Vpn Connection Route](https://console.aws.amazon.com/vpc/home?#VpnConnections:)

```js
exports.createResources = () => [
  {
    type: "VpnConnectionRoute",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "192.168.0.0/24",
    }),
    dependencies: ({}) => ({
      vpnConnection: "vpn-gcp",
    }),
  },
];
```

### Examples

- [vpn aws azure](https://github.com/grucloud/grucloud/blob/main/examples/cross-cloud/vpn-aws-azure)
- [vpn aws gcp](https://github.com/grucloud/grucloud/blob/main/examples/cross-cloud/vpn-aws-gcp)

### Properties

- [CreateVpnConnectionRouteCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createvpnconnectionroutecommandinput.html)

### Dependencies

- [EC2 Vpn Connection](./VpnConnection.md)

### List

```sh
gc l -t EC2::VpnConnectionRoute
```

```txt
Listing resources on 2 providers: aws, google
✓ aws us-east-1 regionA
  ✓ Initialising
  ✓ Listing 2/2
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::VpnConnectionRoute from aws                                                 │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: vpn-conn-route::vpn-gcp::192.168.0.0/24                                      │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   DestinationCidrBlock: 192.168.0.0/24                                             │
│   State: available                                                                 │
│   VpnConnectionId: vpn-0a08cbcbef6af949f                                           │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├─────────────────────────┬─────────────────────────────────────────────────────────┤
│ EC2::VpnConnectionRoute │ vpn-conn-route::vpn-gcp::192.168.0.0/24                 │
└─────────────────────────┴─────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 providers
Command "gc l -t EC2::VpnConnectionRoute" executed in 4s, 113 MB
```
