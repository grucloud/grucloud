---
id: WebAppListSlotConfigurationNames
title: WebAppListSlotConfigurationNames
---
Provides a **WebAppListSlotConfigurationNames** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
## Swagger Schema
```js
{
  description: 'Slot Config names azure resource.',
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
      description: 'Core resource properties',
      type: 'object',
      'x-ms-client-flatten': true,
      properties: {
        connectionStringNames: {
          description: 'List of connection string names.',
          type: 'array',
          items: { type: 'string' }
        },
        appSettingNames: {
          description: 'List of application settings names.',
          type: 'array',
          items: { type: 'string' }
        },
        azureStorageConfigNames: {
          description: 'List of external Azure storage account identifiers.',
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json).
