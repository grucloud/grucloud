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

### Properties

- [CreateVpnGatewayCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createvpngatewaycommandinput.html)

### Used By

- [VpnConnection](./VpnConnection.md)

### List

```sh
gc l -t VpnGateway
```

```sh

```
