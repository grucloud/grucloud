---
id: ConnectionMonitor
title: ConnectionMonitor
---
Provides a **ConnectionMonitor** from the **Network** group
## Examples
### Create connection monitor V1
```js
provider.Network.makeConnectionMonitor({
  name: "myConnectionMonitor",
  properties: () => ({
    location: "eastus",
    properties: {
      endpoints: [
        {
          name: "source",
          resourceId:
            "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/ct1",
        },
        { name: "destination", address: "bing.com" },
      ],
      testConfigurations: [
        {
          name: "tcp",
          testFrequencySec: 60,
          protocol: "Tcp",
          tcpConfiguration: { port: 80 },
        },
      ],
      testGroups: [
        {
          name: "tg",
          testConfigurations: ["tcp"],
          sources: ["source"],
          destinations: ["destination"],
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    networkWatcher: resources.Network.NetworkWatcher["myNetworkWatcher"],
  }),
});

```

### Create connection monitor V2
```js
provider.Network.makeConnectionMonitor({
  name: "myConnectionMonitor",
  properties: () => ({
    properties: {
      endpoints: [
        {
          name: "vm1",
          resourceId:
            "/subscriptions/96e68903-0a56-4819-9987-8d08ad6a1f99/resourceGroups/NwRgIrinaCentralUSEUAP/providers/Microsoft.Compute/virtualMachines/vm1",
        },
        {
          name: "CanaryWorkspaceVamshi",
          resourceId:
            "/subscriptions/96e68903-0a56-4819-9987-8d08ad6a1f99/resourceGroups/vasamudrRG/providers/Microsoft.OperationalInsights/workspaces/vasamudrWorkspace",
          filter: {
            type: "Include",
            items: [{ type: "AgentAddress", address: "npmuser" }],
          },
        },
        { name: "bing", address: "bing.com" },
        { name: "google", address: "google.com" },
      ],
      testConfigurations: [
        {
          name: "testConfig1",
          testFrequencySec: 60,
          protocol: "Tcp",
          tcpConfiguration: { port: 80, disableTraceRoute: false },
        },
      ],
      testGroups: [
        {
          name: "test1",
          disable: false,
          testConfigurations: ["testConfig1"],
          sources: ["vm1", "CanaryWorkspaceVamshi"],
          destinations: ["bing", "google"],
        },
      ],
      outputs: [],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    networkWatcher: resources.Network.NetworkWatcher["myNetworkWatcher"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Workspace](../OperationalInsights/Workspace.md)
- [NetworkWatcher](../Network/NetworkWatcher.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkWatcher.json).
