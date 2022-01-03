---
id: PrivateEndpointConnection
title: PrivateEndpointConnection
---
Provides a **PrivateEndpointConnection** from the **ContainerService** group
## Examples
### Update Private Endpoint Connection
```js
provider.ContainerService.makePrivateEndpointConnection({
  name: "myPrivateEndpointConnection",
  properties: () => ({
    properties: { privateLinkServiceConnectionState: { status: "Approved" } },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    privateEndpoint: resources.Network.PrivateEndpoint["myPrivateEndpoint"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpoint](../Network/PrivateEndpoint.md)
- [ManagedCluster](../ContainerService/ManagedCluster.md)
## Misc
The resource version is `2021-10-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/stable/2021-10-01/managedClusters.json).
