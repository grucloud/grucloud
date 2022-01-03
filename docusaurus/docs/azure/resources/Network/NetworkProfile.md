---
id: NetworkProfile
title: NetworkProfile
---
Provides a **NetworkProfile** from the **Network** group
## Examples
### Create network profile defaults
```js
provider.Network.makeNetworkProfile({
  name: "myNetworkProfile",
  properties: () => ({
    location: "westus",
    properties: {
      containerNetworkInterfaceConfigurations: [
        {
          name: "eth1",
          properties: {
            ipConfigurations: [
              {
                name: "ipconfig1",
                properties: {
                  subnet: {
                    id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/networkProfileVnet/subnets/networkProfileSubnet1",
                  },
                },
              },
            ],
          },
        },
      ],
    },
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkProfile.json).
