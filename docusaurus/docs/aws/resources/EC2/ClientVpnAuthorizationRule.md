---
id: ClientVpnAuthorizationRule
title: Client Vpn Authorization Rule
---

Provides a [Client VPN Authorization Rule](https://console.aws.amazon.com/vpc/home?#ClientVPNEndpoints:)

This resource authorizes a client vpn endpoint with a CIDR

```js
exports.createResources = () => [
  {
    type: "ClientVpnAuthorizationRule",
    group: "EC2",
    properties: ({}) => ({
      TargetNetworkCidr: "10.0.0.0/16",
      AuthorizeAllGroups: true,
    }),
    dependencies: ({}) => ({
      clientVpnEndpoint: "client-vpn",
    }),
  },
];
```

### Examples

- [client-vpn-endpoint](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/client-vpn-endpoint)

### Properties

- [AuthorizeClientVpnIngressCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/authorizeclientvpningresscommandinput.html)

### Dependencies

- [ClientVpnEndpoint](./ClientVpnEndpoint.md)

### List

```sh
gc l -t EC2::ClientVpnAuthorizationRule
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1 
  ✓ Initialising
  ✓ Listing 2/2
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::ClientVpnAuthorizationRule from aws                                                     │
├────────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: client-vpn-rule-assoc::client-vpn::10.0.0.0/16                                           │
│ managedByUs: Yes                                                                               │
│ live:                                                                                          │
│   TargetNetworkCidr: 10.0.0.0/16                                                               │
│   AuthorizeAllGroups: true                                                                     │
│   ClientVpnEndpointId: cvpn-endpoint-0e96eded654443785                                         │
│   GroupId:                                                                                     │
│   Status:                                                                                      │
│     Code: active                                                                               │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                           │
├─────────────────────────────────┬─────────────────────────────────────────────────────────────┤
│ EC2::ClientVpnAuthorizationRule │ client-vpn-rule-assoc::client-vpn::10.0.0.0/16              │
└─────────────────────────────────┴─────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::ClientVpnAuthorizationRule" executed in 5s, 115 MB
```
