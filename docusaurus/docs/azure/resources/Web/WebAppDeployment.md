---
id: WebAppDeployment
title: WebAppDeployment
---
Provides a **WebAppDeployment** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [WebApp](../Web/WebApp.md)
## Swagger Schema
```js
{
  description: 'User credentials used for publishing activity.',
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
      description: 'Deployment resource specific properties',
      type: 'object',
      properties: {
        status: {
          format: 'int32',
          description: 'Deployment status.',
          type: 'integer'
        },
        message: {
          description: 'Details about deployment status.',
          type: 'string'
        },
        author: { description: 'Who authored the deployment.', type: 'string' },
        deployer: {
          description: 'Who performed the deployment.',
          type: 'string'
        },
        author_email: { description: 'Author email.', type: 'string' },
        start_time: {
          format: 'date-time',
          description: 'Start time.',
          type: 'string'
        },
        end_time: {
          format: 'date-time',
          description: 'End time.',
          type: 'string'
        },
        active: {
          description: 'True if deployment is currently active, false if completed and null if not started.',
          type: 'boolean'
        },
        details: { description: 'Details on deployment.', type: 'string' }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/WebApps.json).
