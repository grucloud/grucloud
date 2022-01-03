---
id: NetworkInterfaceTapConfiguration
title: NetworkInterfaceTapConfiguration
---
Provides a **NetworkInterfaceTapConfiguration** from the **Network** group
## Examples
### Create Network Interface Tap Configurations
```js
provider.Network.makeNetworkInterfaceTapConfiguration({
  name: "myNetworkInterfaceTapConfiguration",
  properties: () => ({
    properties: {
      virtualNetworkTap: {
        id: "/subscriptions/subid/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworkTaps/testvtap",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    networkInterface: resources.Network.NetworkInterface["myNetworkInterface"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [NetworkInterface](../Network/NetworkInterface.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkInterface.json).
