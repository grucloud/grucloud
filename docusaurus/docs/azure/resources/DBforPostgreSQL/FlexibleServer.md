---
id: FlexibleServer
title: FlexibleServer
---
Provides a **FlexibleServer** from the **DBforPostgreSQL** group
## Examples
### Create a new server
```js
provider.DBforPostgreSQL.makeFlexibleServer({
  name: "myFlexibleServer",
  properties: () => ({
    location: "westus",
    sku: { tier: "GeneralPurpose", name: "Standard_D4s_v3" },
    properties: {
      administratorLogin: "cloudsa",
      administratorLoginPassword: "password",
      version: "12",
      availabilityZone: "1",
      createMode: "Create",
      storage: { storageSizeGB: 512 },
      backup: { backupRetentionDays: 7, geoRedundantBackup: "Disabled" },
      network: {
        delegatedSubnetResourceId:
          "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/test-vnet-subnet",
        privateDnsZoneArmResourceId:
          "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourcegroups/testrg/providers/Microsoft.Network/privateDnsZones/test-private-dns-zone.postgres.database.azure.com",
      },
      highAvailability: { mode: "ZoneRedundant" },
    },
    tags: { ElasticServer: "1" },
  }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    subnet: "mySubnet",
  }),
});

```

### Create a database as a point in time restore
```js
provider.DBforPostgreSQL.makeFlexibleServer({
  name: "myFlexibleServer",
  properties: () => ({
    location: "westus",
    properties: {
      createMode: "PointInTimeRestore",
      sourceServerResourceId:
        "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/testrg/providers/Microsoft.DBforPostgreSQL/flexibleServers/sourcepgservername",
      pointInTimeUTC: "2021-06-27T00:04:59.4078005+00:00",
    },
  }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    subnet: "mySubnet",
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
## Swagger Schema
```js
{
  properties: {
    sku: {
      description: 'The SKU (pricing tier) of the server.',
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
      required: [ 'name', 'tier' ]
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the server.',
      properties: {
        administratorLogin: {
          type: 'string',
          description: "The administrator's login name of a server. Can only be specified when the server is being created (and is required for creation).",
          'x-ms-mutability': [ 'create', 'read' ]
        },
        administratorLoginPassword: {
          type: 'string',
          description: 'The administrator login password (required for server creation).',
          'x-ms-secret': true,
          format: 'password',
          'x-ms-mutability': [ 'create', 'update' ]
        },
        version: {
          description: 'PostgreSQL Server version.',
          type: 'string',
          enum: [ '13', '12', '11' ],
          'x-ms-enum': { name: 'ServerVersion', modelAsString: true }
        },
        minorVersion: {
          type: 'string',
          description: 'The minor version of the server.',
          readOnly: true
        },
        state: {
          type: 'string',
          description: 'A state of a server that is visible to user.',
          readOnly: true,
          enum: [
            'Ready',
            'Dropping',
            'Disabled',
            'Starting',
            'Stopping',
            'Stopped',
            'Updating'
          ],
          'x-ms-enum': { name: 'ServerState', modelAsString: true }
        },
        fullyQualifiedDomainName: {
          type: 'string',
          description: 'The fully qualified domain name of a server.',
          readOnly: true
        },
        storage: {
          default: null,
          description: 'Storage properties of a server.',
          properties: {
            storageSizeGB: {
              type: 'integer',
              format: 'int32',
              description: 'Max storage allowed for a server.'
            }
          }
        },
        backup: {
          default: null,
          description: 'Backup properties of a server.',
          properties: {
            backupRetentionDays: {
              type: 'integer',
              format: 'int32',
              default: 7,
              description: 'Backup retention days for the server.'
            },
            geoRedundantBackup: {
              type: 'string',
              default: 'Disabled',
              description: 'A value indicating whether Geo-Redundant backup is enabled on the server.',
              enum: [ 'Enabled', 'Disabled' ],
              'x-ms-enum': { name: 'GeoRedundantBackupEnum', modelAsString: true },
              'x-ms-mutability': [ 'create', 'read' ]
            },
            earliestRestoreDate: {
              type: 'string',
              format: 'date-time',
              description: 'The earliest restore point time (ISO8601 format) for server.',
              readOnly: true
            }
          }
        },
        network: {
          default: null,
          description: 'Network properties of a server.',
          'x-ms-mutability': [ 'create', 'read' ],
          properties: {
            publicNetworkAccess: {
              type: 'string',
              description: 'public network access is enabled or not',
              enum: [ 'Enabled', 'Disabled' ],
              'x-ms-enum': {
                name: 'ServerPublicNetworkAccessState',
                modelAsString: true
              },
              readOnly: true
            },
            delegatedSubnetResourceId: {
              type: 'string',
              default: '',
              description: 'delegated subnet arm resource id.',
              'x-ms-mutability': [ 'create', 'read' ]
            },
            privateDnsZoneArmResourceId: {
              type: 'string',
              default: '',
              description: 'private dns zone arm resource id.',
              'x-ms-mutability': [ 'create', 'read' ]
            }
          }
        },
        highAvailability: {
          default: null,
          description: 'High availability properties of a server.',
          properties: {
            mode: {
              type: 'string',
              default: 'Disabled',
              description: 'The HA mode for the server.',
              enum: [ 'Disabled', 'ZoneRedundant' ],
              'x-ms-enum': { name: 'HighAvailabilityMode', modelAsString: true }
            },
            state: {
              type: 'string',
              description: 'A state of a HA server that is visible to user.',
              enum: [
                'NotEnabled',
                'CreatingStandby',
                'ReplicatingData',
                'FailingOver',
                'Healthy',
                'RemovingStandby'
              ],
              'x-ms-enum': { name: 'ServerHAState', modelAsString: true },
              readOnly: true
            },
            standbyAvailabilityZone: {
              type: 'string',
              default: '',
              description: 'availability zone information of the standby.'
            }
          }
        },
        maintenanceWindow: {
          default: null,
          description: 'Maintenance window properties of a server.',
          'x-ms-mutability': [ 'update', 'read' ],
          type: 'object',
          properties: {
            customWindow: {
              type: 'string',
              default: 'Disabled',
              description: 'indicates whether custom window is enabled or disabled'
            },
            startHour: {
              type: 'integer',
              format: 'int32',
              default: 0,
              description: 'start hour for maintenance window'
            },
            startMinute: {
              type: 'integer',
              format: 'int32',
              default: 0,
              description: 'start minute for maintenance window'
            },
            dayOfWeek: {
              type: 'integer',
              format: 'int32',
              default: 0,
              description: 'day of week for maintenance window'
            }
          }
        },
        sourceServerResourceId: {
          type: 'string',
          description: "The source server resource ID to restore from. It's required when 'createMode' is 'PointInTimeRestore'.",
          'x-ms-mutability': [ 'create' ]
        },
        pointInTimeUTC: {
          type: 'string',
          format: 'date-time',
          description: "Restore point creation time (ISO8601 format), specifying the time to restore from. It's required when 'createMode' is 'PointInTimeRestore'.",
          'x-ms-mutability': [ 'create' ]
        },
        availabilityZone: {
          type: 'string',
          default: '',
          description: 'availability zone information of the server.',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        createMode: {
          type: 'string',
          description: 'The mode to create a new PostgreSQL server.',
          enum: [ 'Default', 'Create', 'Update', 'PointInTimeRestore' ],
          'x-ms-enum': { name: 'CreateMode', modelAsString: true },
          'x-ms-mutability': [ 'create', 'update' ]
        }
      }
    },
    systemData: {
      readOnly: true,
      description: 'The system metadata relating to this resource.',
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
  description: 'Represents a server.'
}
```
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2021-06-01/postgresql.json).
