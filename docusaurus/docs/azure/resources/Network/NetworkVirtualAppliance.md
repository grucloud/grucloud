---
id: NetworkVirtualAppliance
title: NetworkVirtualAppliance
---
Provides a **NetworkVirtualAppliance** from the **Network** group
## Examples
### Create NetworkVirtualAppliance
```js
provider.Network.makeNetworkVirtualAppliance({
  name: "myNetworkVirtualAppliance",
  properties: () => ({
    tags: { key1: "value1" },
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/subid/resourcegroups/rg1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity1":
          {},
      },
    },
    location: "West US",
    properties: {
      nvaSku: {
        vendor: "Cisco SDWAN",
        bundledScaleUnit: "1",
        marketPlaceVersion: "12.1",
      },
      virtualHub: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/hub1",
      },
      bootStrapConfigurationBlobs: [
        "https://csrncvhdstorage1.blob.core.windows.net/csrncvhdstoragecont/csrbootstrapconfig",
      ],
      cloudInitConfigurationBlobs: [
        "https://csrncvhdstorage1.blob.core.windows.net/csrncvhdstoragecont/csrcloudinitconfig",
      ],
      virtualApplianceAsn: 10000,
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkVirtualAppliance.json).
