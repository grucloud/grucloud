---
id: ExpressRouteCircuitAuthorization
title: ExpressRouteCircuitAuthorization
---
Provides a **ExpressRouteCircuitAuthorization** from the **Network** group
## Examples
### Create ExpressRouteCircuit Authorization
```js
provider.Network.makeExpressRouteCircuitAuthorization({
  name: "myExpressRouteCircuitAuthorization",
  properties: () => ({ properties: {} }),
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
