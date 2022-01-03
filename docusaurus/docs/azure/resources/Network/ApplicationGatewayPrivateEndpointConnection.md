---
id: ApplicationGatewayPrivateEndpointConnection
title: ApplicationGatewayPrivateEndpointConnection
---
Provides a **ApplicationGatewayPrivateEndpointConnection** from the **Network** group
## Examples
### Update Application Gateway Private Endpoint Connection
```js
provider.Network.makeApplicationGatewayPrivateEndpointConnection({
  name: "myApplicationGatewayPrivateEndpointConnection",
  properties: () => ({
    name: "connection1",
    properties: {
      privateEndpoint: {
        id: "/subscriptions/subId2/resourceGroups/rg1/providers/Microsoft.Network/privateEndpoints/testPe",
      },
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "approved it for some reason.",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    applicationGateway:
      resources.Network.ApplicationGateway["myApplicationGateway"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ApplicationGateway](../Network/ApplicationGateway.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/applicationGateway.json).
