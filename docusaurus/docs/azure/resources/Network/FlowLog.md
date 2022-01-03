---
id: FlowLog
title: FlowLog
---
Provides a **FlowLog** from the **Network** group
## Examples
### Create or update flow log
```js
provider.Network.makeFlowLog({
  name: "myFlowLog",
  properties: () => ({
    location: "centraluseuap",
    properties: {
      targetResourceId:
        "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/desmondcentral-nsg",
      storageId:
        "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Storage/storageAccounts/nwtest1mgvbfmqsigdxe",
      enabled: true,
      format: { type: "JSON", version: 1 },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    networkWatcher: resources.Network.NetworkWatcher["myNetworkWatcher"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [NetworkWatcher](../Network/NetworkWatcher.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkWatcher.json).
