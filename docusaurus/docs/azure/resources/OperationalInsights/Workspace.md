---
id: Workspace
title: Workspace
---
Provides a **Workspace** from the **OperationalInsights** group
## Examples
### WorkspacesCreate
```js
exports.createResources = () => [
  {
    type: "Workspace",
    group: "OperationalInsights",
    name: "myWorkspace",
    properties: () => ({
      properties: { sku: { name: "PerGB2018" }, retentionInDays: 30 },
      location: "australiasoutheast",
      tags: { tag1: "val1" },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      cluster: "myCluster",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Cluster](../OperationalInsights/Cluster.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Workspace properties.',
      properties: {
        provisioningState: {
          type: 'string',
          description: 'The provisioning state of the workspace.',
          readOnly: true,
          enum: [
            'Creating',
            'Succeeded',
            'Failed',
            'Canceled',
            'Deleting',
            'ProvisioningAccount',
            'Updating'
          ],
          'x-ms-enum': { name: 'WorkspaceEntityStatus', modelAsString: true }
        },
        customerId: {
          type: 'string',
          description: 'This is a read-only property. Represents the ID associated with the workspace.',
          readOnly: true
        },
        sku: {
          description: 'The SKU of the workspace.',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the SKU.',
              enum: [
                'Free',
                'Standard',
                'Premium',
                'PerNode',
                'PerGB2018',
                'Standalone',
                'CapacityReservation',
                'LACluster'
              ],
              'x-ms-enum': { name: 'WorkspaceSkuNameEnum', modelAsString: true }
            },
            capacityReservationLevel: {
              type: 'integer',
              format: 'int32',
              description: 'The capacity reservation level in GB for this workspace, when CapacityReservation sku is selected.',
              enum: [
                 100,  200,  300,
                 400,  500, 1000,
                2000, 5000
              ],
              'x-ms-enum': { name: 'CapacityReservationLevel' }
            },
            lastSkuUpdate: {
              type: 'string',
              description: 'The last time when the sku was updated.',
              readOnly: true
            }
          },
          required: [ 'name' ]
        },
        retentionInDays: {
          type: 'integer',
          format: 'int32',
          'x-nullable': true,
          description: 'The workspace data retention in days. Allowed values are per pricing plan. See pricing tiers documentation for details.'
        },
        workspaceCapping: {
          description: 'The daily volume cap for ingestion.',
          properties: {
            dailyQuotaGb: {
              type: 'number',
              format: 'double',
              description: 'The workspace daily quota for ingestion.'
            },
            quotaNextResetTime: {
              type: 'string',
              description: 'The time when the quota will be rest.',
              readOnly: true
            },
            dataIngestionStatus: {
              type: 'string',
              readOnly: true,
              description: 'The status of data ingestion for this workspace.',
              enum: [
                'RespectQuota',
                'ForceOn',
                'ForceOff',
                'OverQuota',
                'SubscriptionSuspended',
                'ApproachingQuota'
              ],
              'x-ms-enum': {
                name: 'DataIngestionStatus',
                modelAsString: true,
                values: [
                  {
                    value: 'RespectQuota',
                    description: 'Ingestion enabled following daily cap quota reset, or subscription enablement.'
                  },
                  {
                    value: 'ForceOn',
                    description: 'Ingestion started following service setting change.'
                  },
                  {
                    value: 'ForceOff',
                    description: 'Ingestion stopped following service setting change.'
                  },
                  {
                    value: 'OverQuota',
                    description: 'Reached daily cap quota, ingestion stopped.'
                  },
                  {
                    value: 'SubscriptionSuspended',
                    description: 'Ingestion stopped following suspended subscription.'
                  },
                  {
                    value: 'ApproachingQuota',
                    description: '80% of daily cap quota reached.'
                  }
                ]
              }
            }
          }
        },
        createdDate: {
          type: 'string',
          description: 'Workspace creation date.',
          readOnly: true
        },
        modifiedDate: {
          type: 'string',
          description: 'Workspace modification date.',
          readOnly: true
        },
        publicNetworkAccessForIngestion: {
          description: 'The network access type for accessing Log Analytics ingestion.',
          type: 'string',
          default: 'Enabled',
          enum: [ 'Enabled', 'Disabled' ],
          'x-ms-enum': {
            name: 'PublicNetworkAccessType',
            modelAsString: true,
            values: [
              {
                value: 'Enabled',
                description: 'Enables connectivity to Log Analytics through public DNS.'
              },
              {
                value: 'Disabled',
                description: 'Disables public connectivity to Log Analytics through public DNS.'
              }
            ]
          }
        },
        publicNetworkAccessForQuery: {
          description: 'The network access type for accessing Log Analytics query.',
          type: 'string',
          default: 'Enabled',
          enum: [ 'Enabled', 'Disabled' ],
          'x-ms-enum': {
            name: 'PublicNetworkAccessType',
            modelAsString: true,
            values: [
              {
                value: 'Enabled',
                description: 'Enables connectivity to Log Analytics through public DNS.'
              },
              {
                value: 'Disabled',
                description: 'Disables public connectivity to Log Analytics through public DNS.'
              }
            ]
          }
        },
        forceCmkForQuery: {
          type: 'boolean',
          description: 'Indicates whether customer managed storage is mandatory for query management.'
        },
        privateLinkScopedResources: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              resourceId: {
                type: 'string',
                description: 'The full resource Id of the private link scope resource.'
              },
              scopeId: {
                type: 'string',
                description: 'The private link scope unique Identifier.'
              }
            },
            description: 'The private link scope resource reference.'
          },
          description: 'List of linked private link scope resources.'
        },
        features: {
          description: 'Workspace features.',
          properties: {
            enableDataExport: {
              type: 'boolean',
              'x-nullable': true,
              description: 'Flag that indicate if data should be exported.'
            },
            immediatePurgeDataOn30Days: {
              type: 'boolean',
              'x-nullable': true,
              description: 'Flag that describes if we want to remove the data after 30 days.'
            },
            enableLogAccessUsingOnlyResourcePermissions: {
              type: 'boolean',
              'x-nullable': true,
              description: 'Flag that indicate which permission to use - resource or workspace or both.'
            },
            clusterResourceId: {
              type: 'string',
              'x-nullable': true,
              description: 'Dedicated LA cluster resourceId that is linked to the workspaces.'
            },
            disableLocalAuth: {
              type: 'boolean',
              'x-nullable': true,
              description: 'Disable Non-AAD based Auth.'
            }
          },
          additionalProperties: true
        },
        defaultDataCollectionRuleResourceId: {
          type: 'string',
          description: 'The resource ID of the default Data Collection Rule to use for this workspace. Expected format is - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dcrName}.'
        }
      }
    },
    systemData: {
      readOnly: true,
      description: 'Metadata pertaining to creation and last modification of the resource.',
      type: 'object',
      properties: {
        createdBy: {
          type: 'string',
          description: 'The identity that created the resource.'
        },
        createdByType: {
          type: 'string',
          description: 'The type of identity that created the resource.',
          enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
          'x-ms-enum': { name: 'createdByType', modelAsString: true }
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'The timestamp of resource creation (UTC).'
        },
        lastModifiedBy: {
          type: 'string',
          description: 'The identity that last modified the resource.'
        },
        lastModifiedByType: {
          type: 'string',
          description: 'The type of identity that last modified the resource.',
          enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
          'x-ms-enum': { name: 'createdByType', modelAsString: true }
        },
        lastModifiedAt: {
          type: 'string',
          format: 'date-time',
          description: 'The timestamp of resource last modification (UTC)'
        }
      }
    },
    eTag: { type: 'string', description: 'The ETag of the workspace.' }
  },
  allOf: [
    {
      title: 'Tracked Resource',
      description: "The resource model definition for an Azure Resource Manager tracked top level resource which has 'tags' and a 'location'",
      type: 'object',
      properties: {
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          'x-ms-mutability': [ 'read', 'create', 'update' ],
          description: 'Resource tags.'
        },
        location: {
          type: 'string',
          'x-ms-mutability': [ 'read', 'create' ],
          description: 'The geo-location where the resource lives'
        }
      },
      required: [ 'location' ],
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
  description: 'The top level Workspace resource container.'
}
```
## Misc
The resource version is `2021-12-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/preview/2021-12-01-preview/Workspaces.json).
