---
id: ManagedHsm
title: ManagedHsm
---
Provides a **ManagedHsm** from the **KeyVault** group
## Examples
### Create a new managed HSM Pool or update an existing managed HSM Pool
```js
exports.createResources = () => [
  {
    type: "ManagedHsm",
    group: "KeyVault",
    name: "myManagedHsm",
    properties: () => ({
      properties: {
        tenantId: "00000000-0000-0000-0000-000000000000",
        initialAdminObjectIds: ["00000000-0000-0000-0000-000000000000"],
        enableSoftDelete: true,
        softDeleteRetentionInDays: 90,
        enablePurgeProtection: true,
      },
      location: "westus",
      sku: { family: "B", name: "Standard_B1" },
      tags: { Dept: "hsm", Environment: "dogfood" },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      description: 'Properties of the managed HSM',
      properties: {
        tenantId: {
          type: 'string',
          format: 'uuid',
          description: 'The Azure Active Directory tenant ID that should be used for authenticating requests to the managed HSM pool.'
        },
        initialAdminObjectIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of initial administrators object ids for this managed hsm pool.'
        },
        hsmUri: {
          type: 'string',
          readOnly: true,
          description: 'The URI of the managed hsm pool for performing operations on keys.'
        },
        enableSoftDelete: {
          type: 'boolean',
          default: true,
          description: "Property to specify whether the 'soft delete' functionality is enabled for this managed HSM pool. If it's not set to any value(true or false) when creating new managed HSM pool, it will be set to true by default. Once set to true, it cannot be reverted to false."
        },
        softDeleteRetentionInDays: {
          type: 'integer',
          format: 'int32',
          default: 90,
          description: 'softDelete data retention days. It accepts >=7 and <=90.'
        },
        enablePurgeProtection: {
          type: 'boolean',
          default: true,
          description: 'Property specifying whether protection against purge is enabled for this managed HSM pool. Setting this property to true activates protection against purge for this managed HSM pool and its content - only the Managed HSM service may initiate a hard, irrecoverable deletion. The setting is effective only if soft delete is also enabled. Enabling this functionality is irreversible.'
        },
        createMode: {
          type: 'string',
          description: 'The create mode to indicate whether the resource is being created or is being recovered from a deleted resource.',
          enum: [ 'recover', 'default' ],
          'x-ms-enum': {
            name: 'CreateMode',
            modelAsString: false,
            values: [
              {
                value: 'recover',
                description: 'Recover the managed HSM pool from a soft-deleted resource.'
              },
              {
                value: 'default',
                description: 'Create a new managed HSM pool. This is the default option.'
              }
            ]
          }
        },
        statusMessage: {
          readOnly: true,
          type: 'string',
          description: 'Resource Status Message.'
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'Provisioning state.',
          enum: [
            'Succeeded',
            'Provisioning',
            'Failed',
            'Updating',
            'Deleting',
            'Activated',
            'SecurityDomainRestore',
            'Restoring'
          ],
          'x-ms-enum': {
            name: 'ProvisioningState',
            modelAsString: true,
            values: [
              {
                value: 'Succeeded',
                description: 'The managed HSM Pool has been full provisioned.'
              },
              {
                value: 'Provisioning',
                description: 'The managed HSM Pool is currently being provisioned.'
              },
              {
                value: 'Failed',
                description: 'Provisioning of the managed HSM Pool has failed.'
              },
              {
                value: 'Updating',
                description: 'The managed HSM Pool is currently being updated.'
              },
              {
                value: 'Deleting',
                description: 'The managed HSM Pool is currently being deleted.'
              },
              {
                value: 'Activated',
                description: 'The managed HSM pool is ready for normal use.'
              },
              {
                value: 'SecurityDomainRestore',
                description: 'The managed HSM pool is waiting for a security domain restore action.'
              },
              {
                value: 'Restoring',
                description: 'The managed HSM pool is being restored from full HSM backup.'
              }
            ]
          }
        },
        networkAcls: {
          description: 'Rules governing the accessibility of the key vault from specific network locations.',
          properties: {
            bypass: {
              type: 'string',
              description: "Tells what traffic can bypass network rules. This can be 'AzureServices' or 'None'.  If not specified the default is 'AzureServices'.",
              enum: [ 'AzureServices', 'None' ],
              'x-ms-enum': { name: 'NetworkRuleBypassOptions', modelAsString: true }
            },
            defaultAction: {
              type: 'string',
              description: 'The default action when no rule from ipRules and from virtualNetworkRules match. This is only used after the bypass property has been evaluated.',
              enum: [ 'Allow', 'Deny' ],
              'x-ms-enum': { name: 'NetworkRuleAction', modelAsString: true }
            },
            ipRules: {
              type: 'array',
              items: {
                properties: {
                  value: {
                    type: 'string',
                    description: "An IPv4 address range in CIDR notation, such as '124.56.78.91' (simple IP address) or '124.56.78.0/24' (all addresses that start with 124.56.78)."
                  }
                },
                required: [ 'value' ],
                description: 'A rule governing the accessibility of a managed hsm pool from a specific ip address or ip range.'
              },
              description: 'The list of IP address rules.'
            },
            virtualNetworkRules: {
              type: 'array',
              items: {
                properties: {
                  id: {
                    type: 'string',
                    description: "Full resource id of a vnet subnet, such as '/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/subnet1'."
                  }
                },
                required: [ 'id' ],
                description: 'A rule governing the accessibility of a managed hsm pool from a specific virtual network.',
                type: 'object'
              },
              description: 'The list of virtual network rules.'
            }
          },
          type: 'object'
        },
        privateEndpointConnections: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              id: {
                type: 'string',
                description: 'Id of private endpoint connection.'
              },
              etag: {
                type: 'string',
                description: 'Modified whenever there is a change in the state of private endpoint connection.'
              },
              properties: {
                'x-ms-client-flatten': true,
                description: 'Private endpoint connection properties.',
                properties: {
                  privateEndpoint: {
                    description: 'Properties of the private endpoint object.',
                    properties: {
                      id: {
                        readOnly: true,
                        type: 'string',
                        description: 'Full identifier of the private endpoint resource.'
                      }
                    },
                    type: 'object'
                  },
                  privateLinkServiceConnectionState: {
                    description: 'Approval state of the private link connection.',
                    properties: {
                      status: {
                        description: 'Indicates whether the connection has been approved, rejected or removed by the key vault owner.',
                        type: 'string',
                        enum: [
                          'Pending',
                          'Approved',
                          'Rejected',
                          'Disconnected'
                        ],
                        'x-ms-enum': {
                          name: 'PrivateEndpointServiceConnectionStatus',
                          modelAsString: true
                        }
                      },
                      description: {
                        type: 'string',
                        description: 'The reason for approval or rejection.'
                      },
                      actionsRequired: {
                        type: 'string',
                        description: 'A message indicating if changes on the service provider require any updates on the consumer.',
                        enum: [ 'None' ],
                        'x-ms-enum': {
                          name: 'ActionsRequired',
                          modelAsString: true
                        }
                      }
                    },
                    type: 'object'
                  },
                  provisioningState: {
                    description: 'Provisioning state of the private endpoint connection.',
                    type: 'string',
                    readOnly: true,
                    enum: [
                      'Succeeded',
                      'Creating',
                      'Updating',
                      'Deleting',
                      'Failed',
                      'Disconnected'
                    ],
                    'x-ms-enum': {
                      name: 'PrivateEndpointConnectionProvisioningState',
                      modelAsString: true
                    }
                  }
                },
                type: 'object'
              }
            },
            description: 'Private endpoint connection item.',
            type: 'object'
          },
          description: 'List of private endpoint connections associated with the managed hsm pool.'
        },
        publicNetworkAccess: {
          description: 'Control permission for data plane traffic coming from public networks while private endpoint is enabled.',
          enum: [ 'Enabled', 'Disabled' ],
          type: 'string',
          'x-ms-enum': { name: 'PublicNetworkAccess', modelAsString: true }
        },
        scheduledPurgeDate: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'The scheduled purge date in UTC.'
        }
      },
      type: 'object'
    }
  },
  allOf: [
    {
      properties: {
        id: {
          readOnly: true,
          type: 'string',
          description: 'The Azure Resource Manager resource ID for the managed HSM Pool.'
        },
        name: {
          readOnly: true,
          type: 'string',
          description: 'The name of the managed HSM Pool.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'The resource type of the managed HSM Pool.'
        },
        location: {
          type: 'string',
          description: 'The supported Azure location where the managed HSM Pool should be created.',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        sku: {
          description: 'SKU details',
          properties: {
            family: {
              type: 'string',
              description: 'SKU Family of the managed HSM Pool',
              enum: [ 'B' ],
              'x-ms-client-default': 'B',
              'x-ms-enum': { name: 'ManagedHsmSkuFamily', modelAsString: true }
            },
            name: {
              type: 'string',
              description: 'SKU of the managed HSM Pool',
              enum: [ 'Standard_B1', 'Custom_B32' ],
              'x-ms-enum': { name: 'ManagedHsmSkuName', modelAsString: false }
            }
          },
          required: [ 'name', 'family' ],
          type: 'object'
        },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        },
        systemData: {
          description: 'Metadata pertaining to creation and last modification of the key vault resource.',
          readOnly: true,
          properties: {
            createdBy: {
              type: 'string',
              description: 'The identity that created the key vault resource.'
            },
            createdByType: {
              description: 'The type of identity that created the key vault resource.',
              type: 'string',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              'x-ms-enum': { name: 'identityType', modelAsString: true }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp of the key vault resource creation (UTC).'
            },
            lastModifiedBy: {
              type: 'string',
              description: 'The identity that last modified the key vault resource.'
            },
            lastModifiedByType: {
              description: 'The type of identity that last modified the key vault resource.',
              type: 'string',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              'x-ms-enum': { name: 'identityType', modelAsString: true }
            },
            lastModifiedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp of the key vault resource last modification (UTC).'
            }
          },
          type: 'object'
        }
      },
      description: 'Managed HSM resource',
      'x-ms-azure-resource': true,
      type: 'object'
    }
  ],
  description: 'Resource information with extended details.',
  type: 'object'
}
```
## Misc
The resource version is `2022-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/stable/2022-07-01/managedHsm.json).
