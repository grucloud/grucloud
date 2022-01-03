---
id: ExpressRouteCircuitConnection
title: ExpressRouteCircuitConnection
---
Provides a **ExpressRouteCircuitConnection** from the **Network** group
## Examples
### ExpressRouteCircuitConnectionCreate
```js
provider.Network.makeExpressRouteCircuitConnection({
  name: "myExpressRouteCircuitConnection",
  properties: () => ({
    properties: {
      expressRouteCircuitPeering: {
        id: "/subscriptions/subid1/resourceGroups/dedharcktinit/providers/Microsoft.Network/expressRouteCircuits/dedharcktlocal/peerings/AzurePrivatePeering",
      },
      peerExpressRouteCircuitPeering: {
        id: "/subscriptions/subid2/resourceGroups/dedharcktpeer/providers/Microsoft.Network/expressRouteCircuits/dedharcktremote/peerings/AzurePrivatePeering",
      },
      authorizationKey: "946a1918-b7a2-4917-b43c-8c4cdaee006a",
      addressPrefix: "10.0.0.0/29",
      ipv6CircuitConnectionConfig: { addressPrefix: "aa:bb::/125" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    circuit: resources.Network.ExpressRouteCircuit["myExpressRouteCircuit"],
    peering:
      resources.Network.ExpressRouteCircuitPeering[
        "myExpressRouteCircuitPeering"
      ],
    expressRouteCircuitPeering:
      resources.Network.ExpressRouteCircuitPeering[
        "myExpressRouteCircuitPeering"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ExpressRouteCircuit](../Network/ExpressRouteCircuit.md)
- [ExpressRouteCircuitPeering](../Network/ExpressRouteCircuitPeering.md)
- [ExpressRouteCircuitPeering](../Network/ExpressRouteCircuitPeering.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/expressRouteCircuit.json).
