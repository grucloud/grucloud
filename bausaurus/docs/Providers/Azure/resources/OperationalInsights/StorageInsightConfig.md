---
id: StorageInsightConfig
title: StorageInsightConfig
---
Provides a **StorageInsightConfig** from the **OperationalInsights** group
## Examples
### StorageInsightsCreate
```js
exports.createResources = () => [
  {
    type: "StorageInsightConfig",
    group: "OperationalInsights",
    name: "myStorageInsightConfig",
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
    eTag: { type: 'string', description: 'The ETag of the storage insight.' },
    tags: {
      type: 'object',
      additionalProperties: { type: 'string' },
      'x-ms-mutability': [ 'read', 'create', 'update' ],
      description: 'Resource tags.'
    }
  },
  allOf: [
    {
      title: 'Proxy Resource',
      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',
      type: 'object',
      allOf: [
        {
          title: 'Resource',
          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',
          type: 'object',
          properties: {
            id: {
              readOnly: true,
              type: 'string',
              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'
            },
            name: {
              readOnly: true,
              type: 'string',
              description: 'The name of the resource'
            },
            type: {
              readOnly: true,
              type: 'string',
              description: 'The type of the resource. E.g. "Microsoft.Compute/virtualMachines" or "Microsoft.Storage/storageAccounts"'
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  description: 'The top level storage insight resource container.'
}
```
## Misc
The resource version is `2020-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2020-08-01/StorageInsightConfigs.json).
