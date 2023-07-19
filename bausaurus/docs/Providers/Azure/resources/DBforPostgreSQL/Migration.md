---
id: Migration
title: Migration
---
Provides a **Migration** from the **DBforPostgreSQL** group
## Examples
### Migrations_Create
```js
exports.createResources = () => [
  {
    type: "Migration",
    group: "DBforPostgreSQL",
    name: "myMigration",
    properties: () => ({
      properties: {
        sourceDBServerResourceId:
          "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/testrg/providers/Microsoft.DBForPostgreSql/servers/testsource",
        secretParameters: {
          adminCredentials: {
            sourceServerPassword: "testsourcepassword",
            targetServerPassword: "testtargetpassword",
          },
          aadApp: {
            aadSecret: "testaadsecret",
            clientId: "cccccccc-cccc-cccc-cccc-cccccccccccc",
            tenantId: "tttttttt-tttt-tttt-tttt-tttttttttttt",
          },
        },
        dBsToMigrate: ["db1", "db2", "db3", "db4"],
        migrationResourceGroup: {
          resourceId:
            "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/testrg",
          subnetResourceId:
            "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworks/testvnet/subnets/default",
        },
      },
      location: "westus",
    }),
    dependencies: ({}) => ({
      userAssignedIdentity: "myUserAssignedIdentity",
      subnet: "mySubnet",
      targetDBServer: "myFlexibleServer",
    }),
  },
];

```
## Dependencies
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [Subnet](../Network/Subnet.md)
- [FlexibleServer](../DBforPostgreSQL/FlexibleServer.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    properties: {
      description: 'Migration resource properties.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        migrationId: { type: 'string', format: 'uuid', readOnly: true },
        migrationName: { type: 'string', readOnly: true },
        migrationDetailsLevel: {
          readOnly: true,
          enum: [ 'Default', 'Summary', 'Full' ],
          type: 'string',
          description: 'Migration details level.',
          'x-ms-enum': { name: 'MigrationDetailsLevel', modelAsString: true }
        },
        currentStatus: {
          readOnly: true,
          type: 'object',
          properties: {
            state: {
              readOnly: true,
              enum: [
                'InProgress',
                'WaitingForUserAction',
                'Canceled',
                'Failed',
                'Succeeded'
              ],
              type: 'string',
              description: 'Migration state.',
              'x-ms-enum': { name: 'MigrationState', modelAsString: true }
            },
            error: { type: 'string', readOnly: true },
            currentSubStateDetails: {
              readOnly: true,
              type: 'object',
              properties: {
                currentSubState: {
                  readOnly: true,
                  enum: [
                    'PerformingPreRequisiteSteps',
                    'WaitingForLogicalReplicationSetupRequestOnSourceDB',
                    'WaitingForDBsToMigrateSpecification',
                    'WaitingForTargetDBOverwriteConfirmation',
                    'WaitingForDataMigrationScheduling',
                    'WaitingForDataMigrationWindow',
                    'MigratingData',
                    'WaitingForCutoverTrigger',
                    'CompletingMigration',
                    'Completed'
                  ],
                  type: 'string',
                  description: 'Migration sub state.',
                  'x-ms-enum': { name: 'MigrationSubState', modelAsString: true }
                }
              },
              description: 'Migration sub state details.'
            }
          },
          description: 'Migration status.'
        },
        sourceDBServerMetadata: {
          readOnly: true,
          type: 'object',
          properties: {
            location: { type: 'string' },
            version: { type: 'string' },
            storageMB: { format: 'int32', type: 'integer' },
            sku: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the sku, typically, tier + family + cores, e.g. Standard_D4s_v3.'
                },
                tier: {
                  type: 'string',
                  description: 'The tier of the particular SKU, e.g. Burstable.',
                  enum: [ 'Burstable', 'GeneralPurpose', 'MemoryOptimized' ],
                  'x-ms-enum': { name: 'SkuTier', modelAsString: true }
                }
              },
              required: [ 'name', 'tier' ],
              description: 'Sku information related properties of a server.'
            }
          },
          description: 'Database server metadata.'
        },
        targetDBServerMetadata: {
          readOnly: true,
          type: 'object',
          properties: {
            location: { type: 'string' },
            version: { type: 'string' },
            storageMB: { format: 'int32', type: 'integer' },
            sku: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the sku, typically, tier + family + cores, e.g. Standard_D4s_v3.'
                },
                tier: {
                  type: 'string',
                  description: 'The tier of the particular SKU, e.g. Burstable.',
                  enum: [ 'Burstable', 'GeneralPurpose', 'MemoryOptimized' ],
                  'x-ms-enum': { name: 'SkuTier', modelAsString: true }
                }
              },
              required: [ 'name', 'tier' ],
              description: 'Sku information related properties of a server.'
            }
          },
          description: 'Database server metadata.'
        },
        sourceDBServerResourceId: { type: 'string' },
        secretParameters: {
          required: [ 'aadApp', 'adminCredentials' ],
          type: 'object',
          properties: {
            adminCredentials: {
              'x-ms-secret': true,
              'x-ms-external': true,
              type: 'object',
              required: [ 'sourceServerPassword', 'targetServerPassword' ],
              properties: {
                sourceServerPassword: {
                  type: 'string',
                  'x-ms-secret': true,
                  'x-ms-external': true,
                  'x-ms-mutability': [ 'create', 'update' ]
                },
                targetServerPassword: {
                  type: 'string',
                  'x-ms-secret': true,
                  'x-ms-external': true,
                  'x-ms-mutability': [ 'create', 'update' ]
                }
              },
              description: 'Server admin credentials.'
            },
            aadApp: {
              'x-ms-secret': true,
              'x-ms-external': true,
              type: 'object',
              required: [ 'aadSecret', 'clientId', 'tenantId' ],
              properties: {
                aadSecret: {
                  type: 'string',
                  'x-ms-secret': true,
                  'x-ms-external': true,
                  'x-ms-mutability': [ 'create', 'update' ]
                },
                clientId: { type: 'string', format: 'uuid' },
                tenantId: { type: 'string', format: 'uuid' }
              },
              description: 'Azure active directory application.'
            }
          },
          description: 'Migration secret parameters.'
        },
        userAssignedIdentityResourceId: { type: 'string' },
        targetDBServerResourceId: { type: 'string', readOnly: true },
        dBsToMigrate: { maxItems: 8, type: 'array', items: { type: 'string' } },
        migrationResourceGroup: {
          type: 'object',
          properties: {
            resourceId: { type: 'string' },
            subnetResourceId: { type: 'string' }
          },
          description: 'Migration resource group.'
        },
        setupLogicalReplicationOnSourceDBIfNeeded: { type: 'boolean' },
        overwriteDBsInTarget: { type: 'boolean' },
        migrationWindowStartTimeInUtc: { format: 'date-time', type: 'string' },
        startDataMigration: { type: 'boolean' },
        triggerCutover: { type: 'boolean' }
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
  description: 'Represents a migration resource.'
}
```
## Misc
The resource version is `2021-06-15-privatepreview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/preview/2021-06-15-privatepreview/Migrations.json).
