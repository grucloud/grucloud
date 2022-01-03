---
id: PacketCapture
title: PacketCapture
---
Provides a **PacketCapture** from the **Network** group
## Examples
### Create packet capture
```js
provider.Network.makePacketCapture({
  name: "myPacketCapture",
  properties: () => ({
    properties: {
      target:
        "/subscriptions/subid/resourceGroups/rg2/providers/Microsoft.Compute/virtualMachines/vm1",
      bytesToCapturePerPacket: 10000,
      totalBytesPerSession: 100000,
      timeLimitInSeconds: 100,
      storageLocation: {
        storageId:
          "/subscriptions/subid/resourceGroups/rg2/providers/Microsoft.Storage/storageAccounts/pcstore",
        storagePath:
          "https://mytestaccountname.blob.core.windows.net/capture/pc1.cap",
        filePath: "D:\\capture\\pc1.cap",
      },
      filters: [
        { protocol: "TCP", localIPAddress: "10.0.0.4", localPort: "80" },
      ],
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
