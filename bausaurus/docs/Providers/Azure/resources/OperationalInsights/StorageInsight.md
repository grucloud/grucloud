---
id: StorageInsight
title: StorageInsight
---
Provides a **StorageInsight** from the **OperationalInsights** group
## Examples
### StorageInsightsCreate
```js
exports.createResources = () => [
  {
    type: "StorageInsight",
    group: "OperationalInsights",
    name: "myStorageInsight",
    properties: () => ({
      properties: {
        containers: ["wad-iis-logfiles"],
        tables: ["WADWindowsEventLogsTable", "LinuxSyslogVer2v0"],
        storageAccount: {
          id: "/subscriptions/00000000-0000-0000-0000-000000000005/resourcegroups/OIAutoRest6987/providers/microsoft.storage/storageaccounts/AzTestFakeSA9945",
          key: "1234",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      linkedStorageAccount: "myLinkedStorageAccount",
      workspace: "myWorkspace",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [LinkedStorageAccount](../OperationalInsights/LinkedStorageAccount.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Storage insight properties.',
      properties: {
        containers: {
          type: 'array',
          items: { type: 'string' },
          description: 'The names of the blob containers that the workspace should read'
        },
        tables: {
          type: 'array',
          items: { type: 'string' },
          description: 'The names of the Azure tables that the workspace should read'
        },
        storageAccount: {
          description: 'The storage account connection details',
          properties: {
            id: {
              type: 'string',
              description: 'The Azure Resource Manager ID of the storage account resource.'
            },
            key: { type: 'string', description: 'The storage account key.' }
          },
          required: [ 'id', 'key' ]
        },
        status: {
          description: 'The status of the storage insight',
          readOnly: true,
          properties: {
            state: {
              type: 'string',
              description: 'The state of the storage insight connection to the workspace',
              enum: [ 'OK', 'ERROR' ],
              'x-ms-enum': { name: 'StorageInsightState', modelAsString: true }
            },
            description: {
              type: 'string',
              description: 'Description of the state of the storage insight.'
            }
          },
          required: [ 'state' ]
        }
      },
      required: [ 'storageAccount' ]
    },
    eTag: { type: 'string', description: 'The ETag of the storage insight.' }
  },
  allOf: [
    {
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource ID.' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type.'
        },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      description: 'Common properties of proxy resource.'
    }
  ],
  description: 'The top level storage insight resource container.',
  'x-ms-azure-resource': true
}
```
## Misc
The resource version is `2015-03-20`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2015-03-20/OperationalInsights.json).
