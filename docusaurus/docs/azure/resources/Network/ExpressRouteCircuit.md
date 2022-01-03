---
id: ExpressRouteCircuit
title: ExpressRouteCircuit
---
Provides a **ExpressRouteCircuit** from the **Network** group
## Examples
### Create ExpressRouteCircuit
```js
provider.Network.makeExpressRouteCircuit({
  name: "myExpressRouteCircuit",
  properties: () => ({
    sku: {
      name: "Standard_MeteredData",
      tier: "Standard",
      family: "MeteredData",
    },
    properties: {
      authorizations: [],
      peerings: [],
      allowClassicOperations: false,
      serviceProviderProperties: {
        serviceProviderName: "Equinix",
        peeringLocation: "Silicon Valley",
        bandwidthInMbps: 200,
      },
    },
    location: "Brazil South",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create ExpressRouteCircuit on ExpressRoutePort
```js
provider.Network.makeExpressRouteCircuit({
  name: "myExpressRouteCircuit",
  properties: () => ({
    location: "westus",
    sku: {
      name: "Premium_MeteredData",
      tier: "Premium",
      family: "MeteredData",
    },
    properties: {
      expressRoutePort: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/expressRoutePorts/portName",
      },
      bandwidthInGbps: 10,
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/expressRouteCircuit.json).
