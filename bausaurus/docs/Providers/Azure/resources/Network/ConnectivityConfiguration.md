---
id: ConnectivityConfiguration
title: ConnectivityConfiguration
---
Provides a **ConnectivityConfiguration** from the **Network** group
## Examples
### ConnectivityConfigurationsPut
```js
exports.createResources = () => [
  {
    type: "ConnectivityConfiguration",
    group: "Network",
    name: "myConnectivityConfiguration",
    properties: () => ({
      properties: {
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
  },
];

```
## Dependencies

## Swagger Schema
```js
{ '$ref': '#/definitions/ConnectivityConfiguration' }
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/networkManagerConnectivityConfiguration.json).
