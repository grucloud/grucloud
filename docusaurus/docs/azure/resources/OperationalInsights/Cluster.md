---
id: Cluster
title: Cluster
---
Provides a **Cluster** from the **OperationalInsights** group
## Examples
### ClustersCreate
```js
provider.OperationalInsights.makeCluster({
  name: "myCluster",
  properties: () => ({
    sku: { name: "CapacityReservation", capacity: 1000 },
    location: "australiasoutheast",
    tags: { tag1: "val1" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Swagger Schema
```js
{
  properties: {
    identity: {
      description: 'The identity of the resource.',
      properties: {
        principalId: {
          readOnly: true,
          type: 'string',
          description: 'The principal ID of resource identity.'
        },
        tenantId: {
          readOnly: true,
          type: 'string',
          description: 'The tenant ID of resource.'
        },
        type: {
          type: 'string',
          description: 'Type of managed service identity.',
          enum: [ 'SystemAssigned', 'UserAssigned', 'None' ],
          'x-ms-enum': { name: 'IdentityType', modelAsString: false }
        },
        userAssignedIdentities: {
          description: "The list of user identities associated with the resource. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.",
          type: 'object',
          additionalProperties: {
            type: 'object',
            description: 'User assigned identity properties.',
            properties: {
              principalId: {
                readOnly: true,
                description: 'The principal id of user assigned identity.',
                type: 'string'
              },
              clientId: {
                readOnly: true,
                description: 'The client id of user assigned identity.',
                type: 'string'
              }
            }
          }
        }
      },
      required: [ 'type' ]
    },
    sku: {
      description: 'The sku properties.',
      properties: {
        capacity: {
          description: 'The capacity value',
          type: 'integer',
          format: 'int64',
          enum: [ 500, 1000, 2000, 5000 ],
          'x-ms-enum': { name: 'Capacity' }
        },
        name: {
          type: 'string',
          description: 'The name of the SKU.',
          enum: [ 'CapacityReservation' ],
          'x-ms-enum': { name: 'ClusterSkuNameEnum', modelAsString: true }
        }
      }
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Log Analytics cluster properties.',
      properties: {
        clusterId: {
          type: 'string',
          readOnly: true,
          description: 'The ID associated with the cluster.'
        },
        provisioningState: {
          type: 'string',
          readOnly: true,
          description: 'The provisioning state of the cluster.',
          enum: [
            'Creating',
            'Succeeded',
            'Failed',
            'Canceled',
            'Deleting',
            'ProvisioningAccount',
            'Updating'
          ],
          'x-ms-enum': { name: 'ClusterEntityStatus', modelAsString: true }
        },
        isDoubleEncryptionEnabled: {
          type: 'boolean',
          readOnly: false,
          description: "Configures whether cluster will use double encryption. This Property can not be modified after cluster creation. Default value is 'true'",
          'x-ms-mutability': [ 'create' ]
        },
        isAvailabilityZonesEnabled: {
          type: 'boolean',
          readOnly: false,
          description: "Sets whether the cluster will support availability zones. This can be set as true only in regions where Azure Data Explorer support Availability Zones. This Property can not be modified after cluster creation. Default value is 'true' if region supports Availability Zones."
        },
        billingType: {
          description: "The cluster's billing type.",
          type: 'string',
          readOnly: false,
          enum: [ 'Cluster', 'Workspaces' ],
          'x-ms-enum': { name: 'BillingType', modelAsString: true }
        },
        keyVaultProperties: {
          description: 'The associated key properties.',
          properties: {
            keyVaultUri: {
              description: 'The Key Vault uri which holds they key associated with the Log Analytics cluster.',
              type: 'string'
            },
            keyName: {
              description: 'The name of the key associated with the Log Analytics cluster.',
              type: 'string'
            },
            keyVersion: {
              description: 'The version of the key associated with the Log Analytics cluster.',
              type: 'string'
            },
            keyRsaSize: {
              description: 'Selected key minimum required size.',
              type: 'integer',
              format: 'int32'
            }
          }
        },
        lastModifiedDate: {
          type: 'string',
          description: 'The last time the cluster was updated.',
          readOnly: true
        },
        createdDate: {
          type: 'string',
          description: 'The cluster creation time',
          readOnly: true
        },
        associatedWorkspaces: {
          description: 'The list of Log Analytics workspaces associated with the cluster',
          type: 'array',
          items: {
            type: 'object',
            description: 'The list of Log Analytics workspaces associated with the cluster.',
            properties: {
              workspaceId: {
                readOnly: true,
                description: 'The id of the assigned workspace.',
                type: 'string'
              },
              workspaceName: {
                readOnly: true,
                description: 'The name id the assigned workspace.',
                type: 'string'
              },
              resourceId: {
                readOnly: true,
                description: 'The ResourceId id the assigned workspace.',
                type: 'string'
              },
              associateDate: {
                readOnly: true,
                description: 'The time of workspace association.',
                type: 'string'
              }
            }
          }
        },
        capacityReservationProperties: {
          description: 'Additional properties for capacity reservation',
          properties: {
            lastSkuUpdate: {
              readOnly: true,
              description: 'The last time Sku was updated.',
              type: 'string'
            },
            minCapacity: {
              readOnly: true,
              description: 'Minimum CapacityReservation value in GB.',
              type: 'integer',
              format: 'int64'
            }
          }
        }
      }
    }
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
  description: 'The top level Log Analytics cluster resource container.'
}
```
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2021-06-01/Clusters.json).
