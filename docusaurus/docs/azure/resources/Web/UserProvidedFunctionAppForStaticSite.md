---
id: UserProvidedFunctionAppForStaticSite
title: UserProvidedFunctionAppForStaticSite
---
Provides a **UserProvidedFunctionAppForStaticSite** from the **Web** group
## Examples
### Register a user provided function app with a static site
```js
provider.Web.makeUserProvidedFunctionAppForStaticSite({
  name: "myUserProvidedFunctionAppForStaticSite",
  properties: () => ({
    properties: {
      functionAppResourceId:
        "/subscription/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/functionRG/providers/Microsoft.Web/sites/testFunctionApp",
      functionAppRegion: "West US 2",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    name: resources.Web.StaticSite["myStaticSite"],
    userProvidedFunctionAppForStaticSiteBuild:
      resources.Web.UserProvidedFunctionAppForStaticSiteBuild[
        "myUserProvidedFunctionAppForStaticSiteBuild"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StaticSite](../Web/StaticSite.md)
- [UserProvidedFunctionAppForStaticSiteBuild](../Web/UserProvidedFunctionAppForStaticSiteBuild.md)
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/StaticSites.json).
