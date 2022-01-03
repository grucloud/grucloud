---
id: StaticSite
title: StaticSite
---
Provides a **StaticSite** from the **Web** group
## Examples
### Create or update a static site
```js
provider.Web.makeStaticSite({
  name: "myStaticSite",
  properties: () => ({
    location: "West US 2",
    properties: {
      repositoryUrl: "https://github.com/username/RepoName",
      branch: "master",
      repositoryToken: "repoToken123",
      buildProperties: {
        appLocation: "app",
        apiLocation: "api",
        appArtifactLocation: "build",
      },
    },
    sku: { name: "Basic", tier: "Basic" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/StaticSites.json).
