---
id: ExpressRouteCircuitPeering
title: ExpressRouteCircuitPeering
---
Provides a **ExpressRouteCircuitPeering** from the **Network** group
## Examples
### Create ExpressRouteCircuit Peerings
```js
provider.Network.makeExpressRouteCircuitPeering({
  name: "myExpressRouteCircuitPeering",
  properties: () => ({
    properties: {
      peerASN: 200,
      primaryPeerAddressPrefix: "192.168.16.252/30",
      secondaryPeerAddressPrefix: "192.168.18.252/30",
      vlanId: 200,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    circuit: resources.Network.ExpressRouteCircuit["myExpressRouteCircuit"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ExpressRouteCircuit](../Network/ExpressRouteCircuit.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/expressRouteCircuit.json).
