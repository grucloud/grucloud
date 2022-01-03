---
id: PrivateEndpointConnection
title: PrivateEndpointConnection
---
Provides a **PrivateEndpointConnection** from the **ContainerRegistry** group
## Examples
### PrivateEndpointConnectionCreateOrUpdate
```js
provider.ContainerRegistry.makePrivateEndpointConnection({
  name: "myPrivateEndpointConnection",
  properties: () => ({
    properties: {
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "Auto-Approved",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    privateEndpoint: resources.Network.PrivateEndpoint["myPrivateEndpoint"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpoint](../Network/PrivateEndpoint.md)
- [Registry](../ContainerRegistry/Registry.md)
## Misc
The resource version is `2021-09-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/stable/2021-09-01/containerregistry.json).
