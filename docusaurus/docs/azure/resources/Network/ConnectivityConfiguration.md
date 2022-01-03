---
id: ConnectivityConfiguration
title: ConnectivityConfiguration
---
Provides a **ConnectivityConfiguration** from the **Network** group
## Examples
### ConnectivityConfigurationsPut
```js
provider.Network.makeConnectivityConfiguration({
  name: "myConnectivityConfiguration",
  properties: () => ({
    properties: {
      displayName: "myTestConnectivityConfig",
      description: "Sample Configuration",
      connectivityTopology: "HubAndSpoke",
      hubs: [
        {
          resourceId:
            "subscriptions/subscriptionA/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myTestConnectivityConfig",
          resourceType: "Microsoft.Network/virtualNetworks",
        },
      ],
      deleteExistingPeering: "True",
      isGlobal: "True",
      appliesToGroups: [
        {
          networkGroupId:
            "subscriptions/subscriptionA/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkManagers/testNetworkManager/networkGroups/group1",
          useHubGateway: "True",
          groupConnectivity: "None",
          isGlobal: "False",
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    adminRule: resources.Network.AdminRule["myAdminRule"],
    networkGroup: resources.Network.NetworkGroup["myNetworkGroup"],
  }),
});

```
## Dependencies
- [AdminRule](../Network/AdminRule.md)
- [NetworkGroup](../Network/NetworkGroup.md)
## Misc
The resource version is `2021-02-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/preview/2021-02-01-preview/networkManagerConnectivityConfiguration.json).
