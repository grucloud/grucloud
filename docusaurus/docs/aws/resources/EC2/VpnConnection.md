---
id: VpnConnection
title: Vpn Connection
---

Provides a [Vpn Connection](https://console.aws.amazon.com/vpc/home?#VpnConnections:)

```js
exports.createResources = () => [
  {
    type: "VpnConnection",
    group: "EC2",
    name: "vpn-connection",
    properties: ({}) => ({
      Category: "VPN",
      Options: {
        EnableAcceleration: false,
        StaticRoutesOnly: false,
        LocalIpv4NetworkCidr: "0.0.0.0/0",
        RemoteIpv4NetworkCidr: "0.0.0.0/0",
        TunnelInsideIpVersion: "ipv4",
      },
    }),
    dependencies: () => ({
      customerGateway: "cgw",
      vpnGateway: "vpw",
    }),
  },
];
```

### Examples

- [site2site](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/site2site)

### Properties

- [CreateVpnConnectionCommandOutput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createvpnconnectioncommandoutput.html)

### Dependencies

- [Vpn Gateway](./VpnGateway.md)
- [Customer Gateway](./CustomerGateway.md)

### List

```sh
gc l -t VpnConnection
```

```sh

```
