---
id: NetworkSecurityGroup
title: NetworkSecurityGroup
---
Provides a **NetworkSecurityGroup** from the **Network** group
## Examples
### Create network security group
```js
provider.Network.makeNetworkSecurityGroup({
  name: "myNetworkSecurityGroup",
  properties: () => ({ location: "eastus" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create network security group with rule
```js
provider.Network.makeNetworkSecurityGroup({
  name: "myNetworkSecurityGroup",
  properties: () => ({
    properties: {
      securityRules: [
        {
          name: "rule1",
          properties: {
            protocol: "*",
            sourceAddressPrefix: "*",
            destinationAddressPrefix: "*",
            access: "Allow",
            destinationPortRange: "80",
            sourcePortRange: "*",
            priority: 130,
            direction: "Inbound",
          },
        },
      ],
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkSecurityGroup.json).
