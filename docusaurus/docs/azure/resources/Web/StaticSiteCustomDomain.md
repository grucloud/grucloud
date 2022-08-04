---
id: StaticSiteCustomDomain
title: StaticSiteCustomDomain
---
Provides a **StaticSiteCustomDomain** from the **Web** group
## Examples
### Create or update a custom domain for a static site
```js
exports.createResources = () => [
  {
    type: "StaticSiteCustomDomain",
    group: "Web",
    name: "myStaticSiteCustomDomain",
    properties: () => ({ properties: {} }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      name: "myStaticSite",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StaticSite](../Web/StaticSite.md)
## Swagger Schema
```js
{
  description: 'Static Site Custom Domain Request Properties ARM resource.',
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
      description: 'StaticSiteCustomDomainRequestPropertiesARMResource resource specific properties',
      type: 'object',
      properties: {
        validationMethod: {
          description: 'Validation method for adding a custom domain',
          default: 'cname-delegation',
          type: 'string'
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
