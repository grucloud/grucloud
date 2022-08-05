---
id: ClientVpnEndpoint
title: Client VPN Endpoint
---

Provides a [Client VPN Endpoint](https://console.aws.amazon.com/vpc/home?#ClientVPNEndpoints:)

```js
exports.createResources = () => [
  {
    type: "ClientVpnEndpoint",
    group: "EC2",
    name: "client-vpn",
    properties: ({ getId }) => ({
      ClientCidrBlock: "10.0.0.0/16",
      AuthenticationOptions: [
        {
          Type: "certificate-authentication",
          MutualAuthentication: {
            ClientRootCertificateChainArn: `${getId({
              type: "Certificate",
              group: "ACM",
              name: "client1.vpn.tld",
            })}`,
          },
        },
      ],
    }),
    dependencies: ({}) => ({
      serverCertificate: "server",
      clientCertificate: "client1.vpn.tld",
    }),
  },
];
```

### Examples

- [client-vpn-endpoint](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/client-vpn-endpoint)

### Properties

- [CreateClientVpnEndpointCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createclientvpnendpointcommandinput.html)

### Dependencies

- [ACM Certificate](../ACM/Certificate.md)
- [Vpc](./Vpc)
- [Security Group](./SecurityGroup.md)
- [CloudWatchLogs LogGroup](../CloudWatchLogs/LogGroup.md)
- [CloudWatchLogs LogStream](../CloudWatchLogs/LogStream.md)

### List

```sh
gc l -t ClientVpnEndpoint
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::ClientVpnEndpoint from aws                                                            │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: client-vpn                                                                             │
│ managedByUs: Yes                                                                             │
│ live:                                                                                        │
│   ClientVpnEndpointId: cvpn-endpoint-0a4eb6f262142e601                                       │
│   Description:                                                                               │
│   Status:                                                                                    │
│     Code: pending-associate                                                                  │
│   CreationTime: 2022-07-19T12:57:40                                                          │
│   DnsName: *.cvpn-endpoint-0a4eb6f262142e601.prod.clientvpn.us-east-1.amazonaws.com          │
│   ClientCidrBlock: 10.0.0.0/16                                                               │
│   SplitTunnel: false                                                                         │
│   VpnProtocol: openvpn                                                                       │
│   TransportProtocol: udp                                                                     │
│   VpnPort: 443                                                                               │
│   ServerCertificateArn: arn:aws:acm:us-east-1:840541460064:certificate/555b616a-ca01-4ccf-b… │
│   AuthenticationOptions:                                                                     │
│     - Type: certificate-authentication                                                       │
│       MutualAuthentication:                                                                  │
│         ClientRootCertificateChain: arn:aws:acm:us-east-1:840541460064:certificate/81633d75… │
│   ConnectionLogOptions:                                                                      │
│     Enabled: false                                                                           │
│   Tags:                                                                                      │
│     - Key: Name                                                                              │
│       Value: client-vpn                                                                      │
│   SecurityGroupIds:                                                                          │
│     - "sg-4e82a670"                                                                          │
│   VpcId: vpc-faff3987                                                                        │
│   ClientConnectOptions:                                                                      │
│     Enabled: false                                                                           │
│     Status:                                                                                  │
│       Code: applying                                                                         │
│   SessionTimeoutHours: 24                                                                    │
│   ClientLoginBannerOptions:                                                                  │
│     Enabled: false                                                                           │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├────────────────────────┬────────────────────────────────────────────────────────────────────┤
│ EC2::ClientVpnEndpoint │ client-vpn                                                         │
└────────────────────────┴────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ClientVpnEndpoint" executed in 4s, 102 MB
```
