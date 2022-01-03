---
id: PrivateLinkServicePrivateEndpointConnection
title: PrivateLinkServicePrivateEndpointConnection
---
Provides a **PrivateLinkServicePrivateEndpointConnection** from the **Network** group
## Examples
### approve or reject private end point connection for a private link service
```js
provider.Network.makePrivateLinkServicePrivateEndpointConnection({
  name: "myPrivateLinkServicePrivateEndpointConnection",
  properties: () => ({
    name: "testPlePeConnection",
    properties: {
      privateEndpoint: {
        id: "/subscriptions/subId/resourceGroups/rg1/providers/Microsoft.Network/privateEndpoints/testPe",
      },
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "approved it for some reason.",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    service: resources.Network.PrivateLinkService["myPrivateLinkService"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateLinkService](../Network/PrivateLinkService.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/privateLinkService.json).
