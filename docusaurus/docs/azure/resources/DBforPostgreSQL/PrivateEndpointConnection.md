---
id: PrivateEndpointConnection
title: PrivateEndpointConnection
---
Provides a **PrivateEndpointConnection** from the **DBforPostgreSQL** group
## Examples
### Approve or reject a private endpoint connection with a given name.
```js
provider.DBforPostgreSQL.makePrivateEndpointConnection({
  name: "myPrivateEndpointConnection",
  properties: () => ({
    properties: {
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "Approved by johndoe@contoso.com",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    server:
      resources.Network.P2sVpnServerConfiguration[
        "myP2sVpnServerConfiguration"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [P2sVpnServerConfiguration](../Network/P2sVpnServerConfiguration.md)
## Misc
The resource version is `2018-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2018-06-01/PrivateEndpointConnections.json).
