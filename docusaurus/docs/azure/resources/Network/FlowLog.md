---
id: FlowLog
title: FlowLog
---
Provides a **FlowLog** from the **Network** group
## Examples
### Create or update flow log
```js
exports.createResources = () => [
  {
    type: "FlowLog",
    group: "Network",
    name: "myFlowLog",
    properties: () => ({
      location: "centraluseuap",
      properties: {
        targetResourceId:
          "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/desmondcentral-nsg",
        storageId:
          "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Storage/storageAccounts/nwtest1mgvbfmqsigdxe",
        enabled: true,
        format: { type: "JSON", version: 1 },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      workspace: "myWorkspace",
      networkWatcher: "myNetworkWatcher",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Workspace](../OperationalInsights/Workspace.md)
- [NetworkWatcher](../Network/NetworkWatcher.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the flow log.',
      required: [ 'targetResourceId', 'storageId' ],
      properties: {
        targetResourceId: {
          description: 'ID of network security group to which flow log will be applied.',
          type: 'string'
        },
        targetResourceGuid: {
          readOnly: true,
          description: 'Guid of network security group to which flow log will be applied.',
          type: 'string'
        },
        storageId: {
          description: 'ID of the storage account which is used to store the flow log.',
          type: 'string'
        },
        enabled: {
          description: 'Flag to enable/disable flow logging.',
          type: 'boolean'
        },
        retentionPolicy: {
          description: 'Parameters that define the retention policy for flow log.',
          properties: {
            days: {
              description: 'Number of days to retain flow log records.',
              type: 'integer',
              format: 'int32',
              default: 0
            },
            enabled: {
              description: 'Flag to enable/disable retention.',
              type: 'boolean',
              default: false
            }
          }
        },
        format: {
          description: 'Parameters that define the flow log format.',
          properties: {
            type: {
              type: 'string',
              description: 'The file type of flow log.',
              enum: [ 'JSON' ],
              'x-ms-enum': { name: 'FlowLogFormatType', modelAsString: true }
            },
            version: {
              description: 'The version (revision) of the flow log.',
              type: 'integer',
              format: 'int32',
              default: 0
            }
          }
        },
        flowAnalyticsConfiguration: {
          description: 'Parameters that define the configuration of traffic analytics.',
          properties: {
            networkWatcherFlowAnalyticsConfiguration: {
              description: 'Parameters that define the configuration of traffic analytics.',
              properties: {
                enabled: {
                  description: 'Flag to enable/disable traffic analytics.',
                  type: 'boolean'
                },
                workspaceId: {
                  description: 'The resource guid of the attached workspace.',
                  type: 'string'
                },
                workspaceRegion: {
                  description: 'The location of the attached workspace.',
                  type: 'string'
                },
                workspaceResourceId: {
                  description: 'Resource Id of the attached workspace.',
                  type: 'string'
                },
                trafficAnalyticsInterval: {
                  description: 'The interval in minutes which would decide how frequently TA service should do flow analytics.',
                  type: 'integer',
                  format: 'int32'
                }
              }
            }
          }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the flow log.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    etag: {
      readOnly: true,
      type: 'string',
      description: 'A unique read-only string that changes whenever the resource is updated.'
    }
  },
  allOf: [
    {
      properties: {
        id: { type: 'string', description: 'Resource ID.' },
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
        location: { type: 'string', description: 'Resource location.' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags.'
        }
      },
      description: 'Common resource representation.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'A flow log resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkWatcher.json).
