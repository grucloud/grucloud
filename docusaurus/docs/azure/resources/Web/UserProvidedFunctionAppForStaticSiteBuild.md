---
id: UserProvidedFunctionAppForStaticSiteBuild
title: UserProvidedFunctionAppForStaticSiteBuild
---
Provides a **UserProvidedFunctionAppForStaticSiteBuild** from the **Web** group
## Examples
### Register a user provided function app with a static site build
```js
provider.Web.makeUserProvidedFunctionAppForStaticSiteBuild({
  name: "myUserProvidedFunctionAppForStaticSiteBuild",
  properties: () => ({
    properties: {
      functionAppResourceId:
        "/subscription/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/functionRG/providers/Microsoft.Web/sites/testFunctionApp",
      functionAppRegion: "West US 2",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    userProvidedFunctionAppForStaticSite:
      resources.Web.UserProvidedFunctionAppForStaticSite[
        "myUserProvidedFunctionAppForStaticSite"
      ],
    name: resources.Web.StaticSite["myStaticSite"],
    environment: resources.Web.StaticSiteBuild["myStaticSiteBuild"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserProvidedFunctionAppForStaticSite](../Web/UserProvidedFunctionAppForStaticSite.md)
- [StaticSite](../Web/StaticSite.md)
- [StaticSiteBuild](../Web/StaticSiteBuild.md)
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/StaticSites.json).
