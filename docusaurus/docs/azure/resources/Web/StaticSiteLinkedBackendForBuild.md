---
id: StaticSiteLinkedBackendForBuild
title: StaticSiteLinkedBackendForBuild
---
Provides a **StaticSiteLinkedBackendForBuild** from the **Web** group
## Examples
### Link a backend to a static site build
```js
exports.createResources = () => [
  {
    type: "StaticSiteLinkedBackendForBuild",
    group: "Web",
    name: "myStaticSiteLinkedBackendForBuild",
    properties: () => ({
      properties: {
        backendResourceId:
          "/subscription/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/backendRg/providers/Microsoft.Web/sites/testBackend",
        region: "West US 2",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      staticSiteLinkedBackend: "myStaticSiteLinkedBackend",
      name: "myStaticSite",
      environment: "myStaticSiteBuild",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StaticSiteLinkedBackend](../Web/StaticSiteLinkedBackend.md)
- [StaticSite](../Web/StaticSite.md)
- [StaticSiteBuild](../Web/StaticSiteBuild.md)
## Swagger Schema
```json
{
  description: 'Static Site Linked Backend ARM resource.',
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
      description: 'StaticSiteLinkedBackendARMResource resource specific properties',
      type: 'object',
      properties: {
        backendResourceId: {
          description: 'The resource id of the backend linked to the static site',
          type: 'string'
        },
        region: {
          description: 'The region of the backend linked to the static site',
          type: 'string'
        },
        createdOn: {
          format: 'date-time',
          description: 'The date and time on which the backend was linked to the static site.',
          type: 'string',
          readOnly: true
        },
        provisioningState: {
          description: 'The provisioning state of the linking process.',
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
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/StaticSites.json).
