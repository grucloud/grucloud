---
id: WebAppRelayServiceConnection
title: WebAppRelayServiceConnection
---
Provides a **WebAppRelayServiceConnection** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [WebApp](../Web/WebApp.md)
## Swagger Schema
```js
{
  description: 'Hybrid Connection for an App Service app.',
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
      description: 'RelayServiceConnectionEntity resource specific properties',
      type: 'object',
      properties: {
        entityName: { type: 'string' },
        entityConnectionString: { type: 'string' },
        resourceType: { type: 'string' },
        resourceConnectionString: { type: 'string' },
        hostname: { type: 'string' },
        port: { format: 'int32', type: 'integer' },
        biztalkUri: { type: 'string' }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/WebApps.json).
