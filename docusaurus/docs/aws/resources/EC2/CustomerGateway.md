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

```sh

```
