---
id: SecurityGroup
title: Security Group
---

Provides a Security Group:

```js
const sg = provider.makeSecurityGroup({
  name: `security-group`,
  dependencies: { resourceGroup },
  properties: () => ({
    properties: {
      securityRules: [
        {
          name: "SSH",
          properties: {
            access: "Allow",
            direction: "Inbound",
            protocol: "Tcp",
            destinationPortRange: "22",
            destinationAddressPrefix: "*",
            sourcePortRange: "*",
            sourceAddressPrefix: "*",
            priority: 1000,
          },
        },
        {
          name: "ICMP",
          properties: {
            access: "Allow",
            direction: "Inbound",
            protocol: "Icmp",
            destinationAddressPrefix: "*",
            destinationPortRange: "*",
            sourceAddressPrefix: "*",
            sourcePortRange: "*",
            priority: 1001,
          },
        },
      ],
    },
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/vm/iac.js#L33)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networksecuritygroups/createorupdate#request-body)

### Dependencies

- [ResourceGroup](./ResourceGroup)

### Used By

- [NetworkInterface](./NetworkInterface)
