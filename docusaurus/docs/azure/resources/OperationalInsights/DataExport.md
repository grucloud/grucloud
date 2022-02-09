---
id: DataExport
title: DataExport
---
Provides a **DataExport** from the **OperationalInsights** group
## Examples
### DataExportCreate
```js
exports.createResources = () => [
  {
    type: "DataExport",
    group: "OperationalInsights",
    name: "myDataExport",
    properties: () => ({
      properties: {
        destination: {
          resourceId:
            "/subscriptions/192b9f85-a39a-4276-b96d-d5cd351703f9/resourceGroups/OIAutoRest1234/providers/Microsoft.EventHub/namespaces/test",
        },
        tableNames: ["Heartbeat"],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      workspace: "myWorkspace",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'data export properties.',
      properties: {
        dataExportId: { type: 'string', description: 'The data export rule ID.' },
        tableNames: {
          type: 'array',
          items: { type: 'string' },
          description: 'An array of tables to export, for example: [“Heartbeat, SecurityEvent”].'
        },
        destination: {
          description: 'destination properties.',
          'x-ms-client-flatten': true,
          properties: {
            resourceId: {
              type: 'string',
              description: 'The destination resource ID. This can be copied from the Properties entry of the destination resource in Azure.'
            },
            type: {
              type: 'string',
              readOnly: true,
              description: 'The type of the destination resource',
              enum: [ 'StorageAccount', 'EventHub' ],
              'x-ms-enum': { name: 'type', modelAsString: true }
            },
            metaData: {
              description: 'destination meta data.',
              'x-ms-client-flatten': true,
              properties: {
                eventHubName: {
                  type: 'string',
                  description: 'Optional. Allows to define an Event Hub name. Not applicable when destination is Storage Account.'
                }
              }
            }
          },
          required: [ 'resourceId' ]
        },
        enable: { type: 'boolean', description: 'Active when enabled.' },
        createdDate: {
          type: 'string',
          description: 'The latest data export rule modification time.'
        },
        lastModifiedDate: {
          type: 'string',
          description: 'Date and time when the export was last modified.'
        }
      },
      required: [ 'tableNames' ]
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
  description: 'The top level data export resource container.',
  'x-ms-azure-resource': true
}
```
## Misc
The resource version is `2020-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2020-08-01/DataExports.json).
