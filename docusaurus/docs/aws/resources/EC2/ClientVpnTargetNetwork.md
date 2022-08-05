---
id: ClientVpnTargetNetwork
title: Client Vpn Target Network
---

Provides a [Client VPN Target Network](https://console.aws.amazon.com/vpc/home?#ClientVPNEndpoints:)

This resource associate a client vpn endpoint with a subnet

```js
exports.createResources = () => [
  {
    type: "ClientVpnTargetNetwork",
    group: "EC2",
    dependencies: ({}) => ({
      clientVpnEndpoint: "client-vpn",
      subnet: "vpc-default::subnet-default-a",
    }),
  },
];
```

### Examples

- [client-vpn-endpoint](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/client-vpn-endpoint)

### Properties

- [AssociateClientVpnTargetNetworkRequest](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/modules/associateclientvpntargetnetworkrequest.html)

### Dependencies

- [ClientVpnEndpoint](./ClientVpnEndpoint.md)
- [Subnet](./Subnet.md)

### List

```sh
gc l -t EC2::ClientVpnTargetNetwork
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 4/4
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::ClientVpnTargetNetwork from aws                                                     │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: client-vpn-target-assoc::client-vpn::vpc::subnet-private1-us-east-1a                 │
│ managedByUs: Yes                                                                           │
│ live:                                                                                      │
│   SubnetId: subnet-02bef9542a54f73b4                                                       │
│   AssociationId: cvpn-assoc-09ed5c32a2272c9d8                                              │
│   VpcId: vpc-009ff6fdeab48a06f                                                             │
│   ClientVpnEndpointId: cvpn-endpoint-0abdc545b56e8eb1d                                     │
│   Status:                                                                                  │
│     Code: associated                                                                       │
│   SecurityGroups:                                                                          │
│     - "sg-0b7a6e74dbecea543"                                                               │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                       │
├─────────────────────────────┬─────────────────────────────────────────────────────────────┤
│ EC2::ClientVpnTargetNetwork │ client-vpn-target-assoc::client-vpn::vpc::subnet-private1-… │
└─────────────────────────────┴─────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::ClientVpnTargetNetwork" executed in 5s, 109 MB
```
