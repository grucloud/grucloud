---
id: DhcpOptionsAssociation
title: Dhcp Options Association
---

Provides a [Dhcp Options Association](https://console.aws.amazon.com/vpc/home?#dhcpOptions:)

```js
exports.createResources = () => [
  {
    type: "DhcpOptionsAssociation",
    group: "EC2",
    name: "dhcp-options-assoc::endpoint_dhcp_options::vpc-4-dhcp-option",
    dependencies: ({}) => ({
      vpc: "vpc-4-dhcp-option",
      dhcpOptions: "endpoint_dhcp_options",
    }),
  },
];
```

### Examples

- [dhcp options](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/dhcp-options)

### Dependencies

- [Dhcp Options](./DhcpOptions.md)
- [Vpc](./Vpc.md)

## Listing

List the dhcp options associations with the _EC2::DhcpOptionsAssociation_ filter:

```sh
gc l -t EC2::DhcpOptionsAssociation
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::DhcpOptionsAssociation from aws                                 │
├────────────────────────────────────────────────────────────────────────┤
│ name: dhcp-options-assoc::endpoint_dhcp_options::vpc-4-dhcp-option     │
│ managedByUs: Yes                                                       │
│ live:                                                                  │
│   VpcId: vpc-0f1e07892d85aef1f                                         │
│   DhcpOptionsId: dopt-06df46190c5fa6e5d                                │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────┐
│ aws                                                                   │
├─────────────────────────────┬─────────────────────────────────────────┤
│ EC2::DhcpOptionsAssociation │ dhcp-options-assoc::endpoint_dhcp_opti… │
└─────────────────────────────┴─────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::DhcpOptionsAssociation" executed in 4s, 168 MB
```
