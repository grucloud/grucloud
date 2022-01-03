---
id: SiteDeploymentSlot
title: SiteDeploymentSlot
---
Provides a **SiteDeploymentSlot** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
- [SiteSlot](../Web/SiteSlot.md)
## Swagger Schema
```js
{
  description: 'Represents user credentials used for publishing activity',
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
        id: { description: 'Id', type: 'string' },
        status: { format: 'int32', description: 'Status', type: 'integer' },
        message: { description: 'Message', type: 'string' },
        author: { description: 'Author', type: 'string' },
        deployer: { description: 'Deployer', type: 'string' },
        author_email: { description: 'AuthorEmail', type: 'string' },
        start_time: {
          format: 'date-time',
          description: 'StartTime',
          type: 'string'
        },
        end_time: { format: 'date-time', description: 'EndTime', type: 'string' },
        active: { description: 'Active', type: 'boolean' },
        details: { description: 'Detail', type: 'string' }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2015-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json).
