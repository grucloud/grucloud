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

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────┐
│ 1 EC2::VpnConnection from aws                                       │
├─────────────────────────────────────────────────────────────────────┤
│ name: vpn-connection                                                │
│ managedByUs: Yes                                                    │
│ live:                                                               │
│   CustomerGatewayConfiguration: <?xml version="1.0" encoding="UTF-… │
│ <vpn_connection id="vpn-052178048d9de6cf8">                         │
│   <customer_gateway_id>cgw-0d899ea9051e3fdc1</customer_gateway_id>  │
│   <vpn_gateway_id>vgw-06555515abec40521</vpn_gateway_id>            │
│   <vpn_connection_type>ipsec.1</vpn_connection_type>                │
│   <ipsec_tunnel>                                                    │
│     <customer_gateway>                                              │
│       <tunnel_outside_address>                                      │
│         <ip_address>1.1.1.1</ip_address>                            │
│       </tunnel_outside_address>                                     │
│       <tunnel_inside_address>                                       │
│         <ip_address>169.254.116.138</ip_address>                    │
│         <network_mask>255.255.255.252</network_mask>                │
│         <network_cidr>30</network_cidr>                             │
│       </tunnel_inside_address>                                      │
│       <bgp>                                                         │
│         <asn>65000</asn>                                            │
│         <hold_time>30</hold_time>                                   │
│       </bgp>                                                        │
│     </customer_gateway>                                             │
│     <vpn_gateway>                                                   │
│       <tunnel_outside_address>                                      │
│         <ip_address>34.234.9.159</ip_address>                       │
│       </tunnel_outside_address>                                     │
│       <tunnel_inside_address>                                       │
│         <ip_address>169.254.116.137</ip_address>                    │
│         <network_mask>255.255.255.252</network_mask>                │
│         <network_cidr>30</network_cidr>                             │
│       </tunnel_inside_address>                                      │
│       <bgp>                                                         │
│         <asn>64512</asn>                                            │
│         <hold_time>30</hold_time>                                   │
│       </bgp>                                                        │
│     </vpn_gateway>                                                  │
│     <ike>                                                           │
│       <authentication_protocol>sha1</authentication_protocol>       │
│       <encryption_protocol>aes-128-cbc</encryption_protocol>        │
│       <lifetime>28800</lifetime>                                    │
│       <perfect_forward_secrecy>group2</perfect_forward_secrecy>     │
│       <mode>main</mode>                                             │
│       <pre_shared_key>IzjMuMR4V4pda_ihfTPhDCoE385zSYCb</pre_shared… │
│     </ike>                                                          │
│     <ipsec>                                                         │
│       <protocol>esp</protocol>                                      │
│       <authentication_protocol>hmac-sha1-96</authentication_protoc… │
│       <encryption_protocol>aes-128-cbc</encryption_protocol>        │
│       <lifetime>3600</lifetime>                                     │
│       <perfect_forward_secrecy>group2</perfect_forward_secrecy>     │
│       <mode>tunnel</mode>                                           │
│       <clear_df_bit>true</clear_df_bit>                             │
│       <fragmentation_before_encryption>true</fragmentation_before_… │
│       <tcp_mss_adjustment>1379</tcp_mss_adjustment>                 │
│       <dead_peer_detection>                                         │
│         <interval>10</interval>                                     │
│         <retries>3</retries>                                        │
│       </dead_peer_detection>                                        │
│     </ipsec>                                                        │
│   </ipsec_tunnel>                                                   │
│   <ipsec_tunnel>                                                    │
│     <customer_gateway>                                              │
│       <tunnel_outside_address>                                      │
│         <ip_address>1.1.1.1</ip_address>                            │
│       </tunnel_outside_address>                                     │
│       <tunnel_inside_address>                                       │
│         <ip_address>169.254.145.186</ip_address>                    │
│         <network_mask>255.255.255.252</network_mask>                │
│         <network_cidr>30</network_cidr>                             │
│       </tunnel_inside_address>                                      │
│       <bgp>                                                         │
│         <asn>65000</asn>                                            │
│         <hold_time>30</hold_time>                                   │
│       </bgp>                                                        │
│     </customer_gateway>                                             │
│     <vpn_gateway>                                                   │
│       <tunnel_outside_address>                                      │
│         <ip_address>52.44.201.245</ip_address>                      │
│       </tunnel_outside_address>                                     │
│       <tunnel_inside_address>                                       │
│         <ip_address>169.254.145.185</ip_address>                    │
│         <network_mask>255.255.255.252</network_mask>                │
│         <network_cidr>30</network_cidr>                             │
│       </tunnel_inside_address>                                      │
│       <bgp>                                                         │
│         <asn>64512</asn>                                            │
│         <hold_time>30</hold_time>                                   │
│       </bgp>                                                        │
│     </vpn_gateway>                                                  │
│     <ike>                                                           │
│       <authentication_protocol>sha1</authentication_protocol>       │
│       <encryption_protocol>aes-128-cbc</encryption_protocol>        │
│       <lifetime>28800</lifetime>                                    │
│       <perfect_forward_secrecy>group2</perfect_forward_secrecy>     │
│       <mode>main</mode>                                             │
│       <pre_shared_key>G8d_wKpyBjTbVJs2xDrjIaSXftOJn414</pre_shared… │
│     </ike>                                                          │
│     <ipsec>                                                         │
│       <protocol>esp</protocol>                                      │
│       <authentication_protocol>hmac-sha1-96</authentication_protoc… │
│       <encryption_protocol>aes-128-cbc</encryption_protocol>        │
│       <lifetime>3600</lifetime>                                     │
│       <perfect_forward_secrecy>group2</perfect_forward_secrecy>     │
│       <mode>tunnel</mode>                                           │
│       <clear_df_bit>true</clear_df_bit>                             │
│       <fragmentation_before_encryption>true</fragmentation_before_… │
│       <tcp_mss_adjustment>1379</tcp_mss_adjustment>                 │
│       <dead_peer_detection>                                         │
│         <interval>10</interval>                                     │
│         <retries>3</retries>                                        │
│       </dead_peer_detection>                                        │
│     </ipsec>                                                        │
│   </ipsec_tunnel>                                                   │
│ </vpn_connection>                                                   │
│   CustomerGatewayId: cgw-0d899ea9051e3fdc1                          │
│   Category: VPN                                                     │
│   State: available                                                  │
│   Type: ipsec.1                                                     │
│   VpnConnectionId: vpn-052178048d9de6cf8                            │
│   VpnGatewayId: vgw-06555515abec40521                               │
│   GatewayAssociationState: associated                               │
│   Options:                                                          │
│     EnableAcceleration: false                                       │
│     StaticRoutesOnly: false                                         │
│     LocalIpv4NetworkCidr: 0.0.0.0/0                                 │
│     RemoteIpv4NetworkCidr: 0.0.0.0/0                                │
│     OutsideIpAddressType: PublicIpv4                                │
│     TunnelInsideIpVersion: ipv4                                     │
│     TunnelOptions:                                                  │
│       - OutsideIpAddress: 34.234.9.159                              │
│         TunnelInsideCidr: 169.254.116.136/30                        │
│         PreSharedKey: IzjMuMR4V4pda_ihfTPhDCoE385zSYCb              │
│       - OutsideIpAddress: 52.44.201.245                             │
│         TunnelInsideCidr: 169.254.145.184/30                        │
│         PreSharedKey: G8d_wKpyBjTbVJs2xDrjIaSXftOJn414              │
│   Routes: []                                                        │
│   Tags:                                                             │
│     - Key: gc-created-by-provider                                   │
│       Value: aws                                                    │
│     - Key: gc-managed-by                                            │
│       Value: grucloud                                               │
│     - Key: gc-project-name                                          │
│       Value: customer-gateway                                       │
│     - Key: gc-stage                                                 │
│       Value: dev                                                    │
│     - Key: Name                                                     │
│       Value: vpn-connection                                         │
│   VgwTelemetry:                                                     │
│     - AcceptedRouteCount: 0                                         │
│       LastStatusChange: 2022-06-24T13:56:36.000Z                    │
│       OutsideIpAddress: 34.234.9.159                                │
│       Status: DOWN                                                  │
│       StatusMessage:                                                │
│     - AcceptedRouteCount: 0                                         │
│       LastStatusChange: 2022-06-24T13:56:37.000Z                    │
│       OutsideIpAddress: 52.44.201.245                               │
│       Status: DOWN                                                  │
│       StatusMessage:                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────┐
│ aws                                                                │
├────────────────────┬───────────────────────────────────────────────┤
│ EC2::VpnConnection │ vpn-connection                                │
└────────────────────┴───────────────────────────────────────────────┘
1 resources, 1 type, 1 provider
Command "gc l -t VpnConnection" executed in 5s, 97 MB
```
