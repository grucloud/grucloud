---
id: StaticSitePrivateEndpointConnection
title: StaticSitePrivateEndpointConnection
---
Provides a **StaticSitePrivateEndpointConnection** from the **Web** group
## Examples
### Approves or rejects a private endpoint connection for a site.
```js
provider.Web.makeStaticSitePrivateEndpointConnection({
  name: "myStaticSitePrivateEndpointConnection",
  properties: () => ({
    properties: {
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "Approved by admin.",
        actionsRequired: "",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    name: resources.Web.StaticSite["myStaticSite"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StaticSite](../Web/StaticSite.md)
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/StaticSites.json).
