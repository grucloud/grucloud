---
id: DscpConfiguration
title: DscpConfiguration
---
Provides a **DscpConfiguration** from the **Network** group
## Examples
### Create DSCP Configuration
```js
provider.Network.makeDscpConfiguration({
  name: "myDscpConfiguration",
  properties: () => ({
    properties: {
      qosDefinitionCollection: [
        {
          markings: [1],
          sourceIpRanges: [{ startIP: "127.0.0.1", endIP: "127.0.0.2" }],
          destinationIpRanges: [{ startIP: "127.0.10.1", endIP: "127.0.10.2" }],
          sourcePortRanges: [
            { start: 10, end: 11 },
            { start: 20, end: 21 },
          ],
          destinationPortRanges: [{ start: 15, end: 15 }],
          protocol: "Tcp",
        },
        {
          markings: [2],
          sourceIpRanges: [{ startIP: "12.0.0.1", endIP: "12.0.0.2" }],
          destinationIpRanges: [{ startIP: "12.0.10.1", endIP: "12.0.10.2" }],
          sourcePortRanges: [{ start: 11, end: 12 }],
          destinationPortRanges: [{ start: 51, end: 52 }],
          protocol: "Udp",
        },
      ],
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
- [NatGateway](../Network/NatGateway.md)
- [Configuration](../DBforPostgreSQL/Configuration.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/dscpConfiguration.json).
