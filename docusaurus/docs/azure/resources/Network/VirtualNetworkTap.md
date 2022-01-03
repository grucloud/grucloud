---
id: VirtualNetworkTap
title: VirtualNetworkTap
---
Provides a **VirtualNetworkTap** from the **Network** group
## Examples
### Create Virtual Network Tap
```js
provider.Network.makeVirtualNetworkTap({
  name: "myVirtualNetworkTap",
  properties: () => ({
    properties: {
      destinationNetworkInterfaceIPConfiguration: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkInterfaces/testNetworkInterface/ipConfigurations/ipconfig1",
      },
    },
    location: "centraluseuap",
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualNetworkTap.json).
