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
    userProvidedFunctionAppForStaticSiteBuild:
      resources.Web.UserProvidedFunctionAppForStaticSiteBuild[
        "myUserProvidedFunctionAppForStaticSiteBuild"
      ],
    name: resources.Web.StaticSite["myStaticSite"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserProvidedFunctionAppForStaticSiteBuild](../Web/UserProvidedFunctionAppForStaticSiteBuild.md)
- [StaticSite](../Web/StaticSite.md)
## Swagger Schema
```js
{
  description: 'Static Site User Provided Function App ARM resource.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'StaticSiteUserProvidedFunctionAppARMResource resource specific properties',
      type: 'object',
      properties: {
        functionAppResourceId: {
          description: 'The resource id of the function app registered with the static site',
          type: 'string'
        },
        functionAppRegion: {
          description: 'The region of the function app registered with the static site',
          type: 'string'
        },
        createdOn: {
          format: 'date-time',
          description: 'The date and time on which the function app was registered with the static site.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/StaticSites.json).
