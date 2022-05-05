---
id: DhcpOptions
title: Dhcp Options
---

Provides a [Dhcp Options](https://console.aws.amazon.com/vpc/home?#dhcpOptions:)

```js
exports.createResources = () => [
  {
    type: "DhcpOptions",
    group: "EC2",
    name: "endpoint_dhcp_options",
    properties: ({}) => ({
      DhcpConfigurations: [
        {
          Key: "domain-name",
          Values: ["ec2.internal"],
        },
        {
          Key: "domain-name-servers",
          Values: ["AmazonProvidedDNS"],
        },
        {
          Key: "ntp-servers",
          Values: ["169.254.169.123", "fd00:ec2::123"],
        },
      ],
    }),
  },
];
```

### Examples

- [dhcp options](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/dhcp-options)

### Properties

- [CreateDhcpOptionsCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createdhcpoptionscommandinput.html)

### Used By

- [Dhcp Options Association](./DhcpOptionsAssociation.md)

## Listing

List the dhcp options with the _DhcpOptions_ filter:

```sh
gc l -t DhcpOptions
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌────────────────────────────────────────────────────────────────────────┐
│ 2 EC2::DhcpOptions from aws                                            │
├────────────────────────────────────────────────────────────────────────┤
│ name: dopt-036a6462c18e0cce0                                           │
│ managedByUs: NO                                                        │
│ live:                                                                  │
│   DhcpConfigurations:                                                  │
│     - Key: domain-name                                                 │
│       Values:                                                          │
│         - "ec2.internal"                                               │
│     - Key: domain-name-servers                                         │
│       Values:                                                          │
│         - "AmazonProvidedDNS"                                          │
│   DhcpOptionsId: dopt-036a6462c18e0cce0                                │
│   OwnerId: 548529576214                                                │
│   Tags: []                                                             │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ name: endpoint_dhcp_options                                            │
│ managedByUs: Yes                                                       │
│ live:                                                                  │
│   DhcpConfigurations:                                                  │
│     - Key: domain-name                                                 │
│       Values:                                                          │
│         - "ec2.internal"                                               │
│     - Key: domain-name-servers                                         │
│       Values:                                                          │
│         - "AmazonProvidedDNS"                                          │
│     - Key: ntp-servers                                                 │
│       Values:                                                          │
│         - "169.254.169.123"                                            │
│         - "fd00:ec2::123"                                              │
│   DhcpOptionsId: dopt-06df46190c5fa6e5d                                │
│   OwnerId: 548529576214                                                │
│   Tags:                                                                │
│     - Key: gc-created-by-provider                                      │
│       Value: aws                                                       │
│     - Key: gc-managed-by                                               │
│       Value: grucloud                                                  │
│     - Key: gc-project-name                                             │
│       Value: dhcp-options                                              │
│     - Key: gc-stage                                                    │
│       Value: dev                                                       │
│     - Key: Name                                                        │
│       Value: endpoint_dhcp_options                                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────┐
│ aws                                                                   │
├──────────────────┬────────────────────────────────────────────────────┤
│ EC2::DhcpOptions │ dopt-036a6462c18e0cce0                             │
│                  │ endpoint_dhcp_options                              │
└──────────────────┴────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t DhcpOptions" executed in 4s, 175 MB
```
