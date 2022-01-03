---
id: StaticSiteCustomDomain
title: StaticSiteCustomDomain
---
Provides a **StaticSiteCustomDomain** from the **Web** group
## Examples
### Create or update a custom domain for a static site
```js
provider.Web.makeStaticSiteCustomDomain({
  name: "myStaticSiteCustomDomain",
  properties: () => ({ properties: {} }),
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
