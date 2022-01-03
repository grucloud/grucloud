---
id: PrivateLinkService
title: PrivateLinkService
---
Provides a **PrivateLinkService** from the **Network** group
## Examples
### Create private link service
```js
provider.Network.makePrivateLinkService({
  name: "myPrivateLinkService",
  properties: () => ({ type: "EdgeZone", name: "edgeZone0" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/privateLinkService.json).
