---
id: SiteSourceControl
title: SiteSourceControl
---
Provides a **SiteSourceControl** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
## Swagger Schema
```js
{
  description: 'Describes the source control configuration for web app',
  type: 'object',
  allOf: [
    {
      required: [ 'location' ],
      properties: {
        id: { description: 'Resource Id', type: 'string' },
        name: { description: 'Resource Name', type: 'string' },
        kind: { description: 'Kind of resource', type: 'string' },
        location: { description: 'Resource Location', type: 'string' },
        type: { description: 'Resource type', type: 'string' },
        tags: {
          description: 'Resource tags',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      properties: {
        repoUrl: {
          description: 'Repository or source control url',
          type: 'string'
        },
        branch: {
          description: 'Name of branch to use for deployment',
          type: 'string'
        },
        isManualIntegration: {
          description: 'Whether to manual or continuous integration',
          type: 'boolean'
        },
        deploymentRollbackEnabled: {
          description: 'Whether to manual or continuous integration',
          type: 'boolean'
        },
        isMercurial: {
          description: 'Mercurial or Git repository type',
          type: 'boolean'
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2015-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json).
