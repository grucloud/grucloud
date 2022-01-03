---
id: VirtualNetworkRule
title: VirtualNetworkRule
---
Provides a **VirtualNetworkRule** from the **DBforPostgreSQL** group
## Examples
### Create or update a virtual network rule
```js
provider.DBforPostgreSQL.makeVirtualNetworkRule({
  name: "myVirtualNetworkRule",
  properties: () => ({
    properties: {
      ignoreMissingVnetServiceEndpoint: false,
      virtualNetworkSubnetId:
        "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/TestGroup/providers/Microsoft.Network/virtualNetworks/testvnet/subnets/testsubnet",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    server:
      resources.Network.P2sVpnServerConfiguration[
        "myP2sVpnServerConfiguration"
      ],
    subnet: resources.Network.Subnet["mySubnet"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [P2sVpnServerConfiguration](../Network/P2sVpnServerConfiguration.md)
- [Subnet](../Network/Subnet.md)
## Misc
The resource version is `2017-12-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2017-12-01/postgresql.json).
