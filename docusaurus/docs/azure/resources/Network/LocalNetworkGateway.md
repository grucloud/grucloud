---
id: LocalNetworkGateway
title: LocalNetworkGateway
---
Provides a **LocalNetworkGateway** from the **Network** group
## Examples
### CreateLocalNetworkGateway
```js
provider.Network.makeLocalNetworkGateway({
  name: "myLocalNetworkGateway",
  properties: () => ({
    properties: {
      localNetworkAddressSpace: { addressPrefixes: ["10.1.0.0/16"] },
      gatewayIpAddress: "11.12.13.14",
      fqdn: "site1.contoso.com",
    },
    location: "Central US",
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualNetworkGateway.json).
