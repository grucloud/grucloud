---
id: DatabaseAccount
title: DatabaseAccount
---
Provides a **DatabaseAccount** from the **DocumentDB** group
## Examples
### CosmosDBDatabaseAccountCreateMin
```js
exports.createResources = () => [
  {
    type: "DatabaseAccount",
    group: "DocumentDB",
    name: "myDatabaseAccount",
    properties: () => ({
      location: "westus",
      properties: {
        databaseAccountOfferType: "Standard",
        createMode: "Default",
        locations: [
          {
            failoverPriority: 0,
            locationName: "southcentralus",
            isZoneRedundant: false,
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      managedIdentities: ["myUserAssignedIdentity"],
      subnets: ["mySubnet"],
    }),
  },
];

```

### CosmosDBDatabaseAccountCreateMax
```js
exports.createResources = () => [
  {
    type: "DatabaseAccount",
    group: "DocumentDB",
    name: "myDatabaseAccount",
    properties: () => ({
      location: "westus",
      tags: {},
      kind: "MongoDB",
      identity: {
        type: "SystemAssigned,UserAssigned",
        userAssignedIdentities: {
          "/subscriptions/fa5fc227-a624-475e-b696-cdd604c735bc/resourceGroups/eu2cgroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id1":
            {},
        },
      },
      properties: {
        databaseAccountOfferType: "Standard",
        ipRules: [
          { ipAddressOrRange: "23.43.230.120" },
          { ipAddressOrRange: "110.12.240.0/12" },
        ],
        isVirtualNetworkFilterEnabled: true,
        virtualNetworkRules: [
          {
            id: "/subscriptions/subId/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
            ignoreMissingVNetServiceEndpoint: false,
          },
        ],
        publicNetworkAccess: "Enabled",
        locations: [
          {
            failoverPriority: 0,
            locationName: "southcentralus",
            isZoneRedundant: false,
          },
          {
            failoverPriority: 1,
            locationName: "eastus",
            isZoneRedundant: false,
          },
        ],
        consistencyPolicy: {
          defaultConsistencyLevel: "BoundedStaleness",
          maxIntervalInSeconds: 10,
          maxStalenessPrefix: 200,
        },
        keyVaultKeyUri: "https://myKeyVault.vault.azure.net",
        defaultIdentity: "FirstPartyIdentity",
        enableFreeTier: false,
        apiProperties: { serverVersion: "3.2" },
        enableAnalyticalStorage: true,
        analyticalStorageConfiguration: { schemaType: "WellDefined" },
        createMode: "Default",
        backupPolicy: {
          type: "Periodic",
          periodicModeProperties: {
            backupIntervalInMinutes: 240,
            backupRetentionIntervalInHours: 8,
            backupStorageRedundancy: "Geo",
          },
        },
        cors: [{ allowedOrigins: "https://test" }],
        networkAclBypass: "AzureServices",
        networkAclBypassResourceIds: [
          "/subscriptions/subId/resourcegroups/rgName/providers/Microsoft.Synapse/workspaces/workspaceName",
        ],
        capacity: { totalThroughputLimit: 2000 },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      managedIdentities: ["myUserAssignedIdentity"],
      subnets: ["mySubnet"],
    }),
  },
];

```

### CosmosDBRestoreDatabaseAccountCreateUpdate.json
```js
exports.createResources = () => [
  {
    type: "DatabaseAccount",
    group: "DocumentDB",
    name: "myDatabaseAccount",
    properties: () => ({
      location: "westus",
      tags: {},
      kind: "GlobalDocumentDB",
      properties: {
        databaseAccountOfferType: "Standard",
        locations: [
          {
            failoverPriority: 0,
            locationName: "southcentralus",
            isZoneRedundant: false,
          },
        ],
        createMode: "Restore",
        restoreParameters: {
          restoreMode: "PointInTime",
          restoreSource:
            "/subscriptions/subid/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/1a97b4bb-f6a0-430e-ade1-638d781830cc",
          restoreTimestampInUtc: "2021-03-11T22:05:09Z",
          databasesToRestore: [
            {
              databaseName: "db1",
              collectionNames: ["collection1", "collection2"],
            },
            {
              databaseName: "db2",
              collectionNames: ["collection3", "collection4"],
            },
          ],
        },
        backupPolicy: { type: "Continuous" },
        consistencyPolicy: {
          defaultConsistencyLevel: "BoundedStaleness",
          maxIntervalInSeconds: 10,
          maxStalenessPrefix: 200,
        },
        keyVaultKeyUri: "https://myKeyVault.vault.azure.net",
        enableFreeTier: false,
        apiProperties: { serverVersion: "3.2" },
        enableAnalyticalStorage: true,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      managedIdentities: ["myUserAssignedIdentity"],
      subnets: ["mySubnet"],
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [Subnet](../Network/Subnet.md)
## Swagger Schema
```json
{
  description: 'Parameters to create and update Cosmos DB database accounts.',
  type: 'object',
  properties: {
    kind: {
      description: 'Indicates the type of database account. This can only be set at database account creation.',
      type: 'string',
      default: 'GlobalDocumentDB',
      enum: [ 'GlobalDocumentDB', 'MongoDB', 'Parse' ],
      'x-ms-enum': { name: 'DatabaseAccountKind', modelAsString: true }
    },
    identity: {
      properties: {
        principalId: {
          readOnly: true,
          type: 'string',
          description: 'The principal id of the system assigned identity. This property will only be provided for a system assigned identity.'
        },
        tenantId: {
          readOnly: true,
          type: 'string',
          description: 'The tenant id of the system assigned identity. This property will only be provided for a system assigned identity.'
        },
        type: {
          type: 'string',
          description: "The type of identity used for the resource. The type 'SystemAssigned,UserAssigned' includes both an implicitly created identity and a set of user assigned identities. The type 'None' will remove any identities from the service.",
          enum: [
            'SystemAssigned',
            'UserAssigned',
            'SystemAssigned,UserAssigned',
            'None'
          ],
          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }
        },
        userAssignedIdentities: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              principalId: {
                readOnly: true,
                type: 'string',
                description: 'The principal id of user assigned identity.'
              },
              clientId: {
                readOnly: true,
                type: 'string',
                description: 'The client id of user assigned identity.'
              }
            }
          },
          description: "The list of user identities associated with resource. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'."
        }
      },
      description: 'Identity for the resource.'
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update Azure Cosmos DB database accounts.',
      type: 'object',
      properties: {
        consistencyPolicy: {
          description: 'The consistency policy for the Cosmos DB account.',
          type: 'object',
          properties: {
            defaultConsistencyLevel: {
              description: 'The default consistency level and configuration settings of the Cosmos DB account.',
              type: 'string',
              enum: [
                'Eventual',
                'Session',
                'BoundedStaleness',
                'Strong',
                'ConsistentPrefix'
              ],
              'x-ms-enum': { name: 'DefaultConsistencyLevel', modelAsString: false }
            },
            maxStalenessPrefix: {
              description: "When used with the Bounded Staleness consistency level, this value represents the number of stale requests tolerated. Accepted range for this value is 1 – 2,147,483,647. Required when defaultConsistencyPolicy is set to 'BoundedStaleness'.",
              type: 'integer',
              minimum: 1,
              maximum: 2147483647,
              format: 'int64'
            },
            maxIntervalInSeconds: {
              description: "When used with the Bounded Staleness consistency level, this value represents the time amount of staleness (in seconds) tolerated. Accepted range for this value is 5 - 86400. Required when defaultConsistencyPolicy is set to 'BoundedStaleness'.",
              type: 'integer',
              minimum: 5,
              maximum: 86400,
              format: 'int32'
            }
          },
          required: [ 'defaultConsistencyLevel' ]
        },
        locations: {
          type: 'array',
          description: 'An array that contains the georeplication locations enabled for the Cosmos DB account.',
          items: {
            description: 'A region in which the Azure Cosmos DB database account is deployed.',
            type: 'object',
            properties: {
              id: {
                type: 'string',
                readOnly: true,
                description: 'The unique identifier of the region within the database account. Example: &lt;accountName&gt;-&lt;locationName&gt;.'
              },
              locationName: {
                type: 'string',
                description: 'The name of the region.'
              },
              documentEndpoint: {
                type: 'string',
                readOnly: true,
                description: 'The connection endpoint for the specific region. Example: https://&lt;accountName&gt;-&lt;locationName&gt;.documents.azure.com:443/'
              },
              provisioningState: {
                type: 'string',
                readOnly: true,
                description: "The status of the Cosmos DB account at the time the operation was called. The status can be one of following. 'Creating' – the Cosmos DB account is being created. When an account is in Creating state, only properties that are specified as input for the Create Cosmos DB account operation are returned. 'Succeeded' – the Cosmos DB account is active for use. 'Updating' – the Cosmos DB account is being updated. 'Deleting' – the Cosmos DB account is being deleted. 'Failed' – the Cosmos DB account failed creation. 'DeletionFailed' – the Cosmos DB account deletion failed."
              },
              failoverPriority: {
                description: 'The failover priority of the region. A failover priority of 0 indicates a write region. The maximum value for a failover priority = (total number of regions - 1). Failover priority values must be unique for each of the regions in which the database account exists.',
                format: 'int32',
                type: 'integer',
                minimum: 0
              },
              isZoneRedundant: {
                type: 'boolean',
                description: 'Flag to indicate whether or not this region is an AvailabilityZone region'
              }
            }
          }
        },
        databaseAccountOfferType: {
          description: 'The offer type for the database',
          type: 'string',
          enum: [ 'Standard' ],
          'x-ms-enum': { name: 'DatabaseAccountOfferType', modelAsString: false }
        },
        ipRules: {
          description: 'List of IpRules.',
          type: 'array',
          items: {
            type: 'object',
            description: 'IpAddressOrRange object',
            properties: {
              ipAddressOrRange: {
                type: 'string',
                description: 'A single IPv4 address or a single IPv4 address range in CIDR format. Provided IPs must be well-formatted and cannot be contained in one of the following ranges: 10.0.0.0/8, 100.64.0.0/10, 172.16.0.0/12, 192.168.0.0/16, since these are not enforceable by the IP address filter. Example of valid inputs: “23.40.210.245” or “23.40.210.0/8”.'
              }
            }
          }
        },
        isVirtualNetworkFilterEnabled: {
          description: 'Flag to indicate whether to enable/disable Virtual Network ACL rules.',
          type: 'boolean'
        },
        enableAutomaticFailover: {
          description: 'Enables automatic failover of the write region in the rare event that the region is unavailable due to an outage. Automatic failover will result in a new write region for the account and is chosen based on the failover priorities configured for the account.',
          type: 'boolean'
        },
        capabilities: {
          type: 'array',
          description: 'List of Cosmos DB capabilities for the account',
          items: {
            type: 'object',
            description: 'Cosmos DB capability object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of the Cosmos DB capability. For example, "name": "EnableCassandra". Current values also include "EnableTable" and "EnableGremlin".'
              }
            }
          }
        },
        virtualNetworkRules: {
          type: 'array',
          description: 'List of Virtual Network ACL rules configured for the Cosmos DB account.',
          items: {
            type: 'object',
            description: 'Virtual Network ACL Rule object',
            properties: {
              id: {
                type: 'string',
                format: 'arm-id',
                'x-ms-arm-id-details': {
                  allowedResources: [
                    {
                      type: 'Microsoft.Network/virtualNetworks/subnets'
                    }
                  ]
                },
                description: 'Resource ID of a subnet, for example: /subscriptions/{subscriptionId}/resourceGroups/{groupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}/subnets/{subnetName}.'
              },
              ignoreMissingVNetServiceEndpoint: {
                type: 'boolean',
                description: 'Create firewall rule before the virtual network has vnet service endpoint enabled.'
              }
            }
          }
        },
        enableMultipleWriteLocations: {
          description: 'Enables the account to write in multiple locations',
          type: 'boolean'
        },
        enableCassandraConnector: {
          description: 'Enables the cassandra connector on the Cosmos DB C* account',
          type: 'boolean'
        },
        connectorOffer: {
          description: 'The cassandra connector offer type for the Cosmos DB database C* account.',
          type: 'string',
          enum: [ 'Small' ],
          'x-ms-enum': { name: 'ConnectorOffer', modelAsString: true }
        },
        disableKeyBasedMetadataWriteAccess: {
          description: 'Disable write operations on metadata resources (databases, containers, throughput) via account keys',
          type: 'boolean'
        },
        keyVaultKeyUri: { description: 'The URI of the key vault', type: 'string' },
        defaultIdentity: {
          description: 'The default identity for accessing key vault used in features like customer managed keys. The default identity needs to be explicitly set by the users. It can be "FirstPartyIdentity", "SystemAssignedIdentity" and more.',
          type: 'string'
        },
        publicNetworkAccess: {
          description: 'Whether requests from Public Network are allowed',
          type: 'string',
          enum: [ 'Enabled', 'Disabled' ],
          'x-ms-enum': { modelAsString: true, name: 'PublicNetworkAccess' }
        },
        enableFreeTier: {
          description: 'Flag to indicate whether Free Tier is enabled.',
          type: 'boolean'
        },
        apiProperties: {
          description: 'API specific properties. Currently, supported only for MongoDB API.',
          type: 'object',
          properties: {
            serverVersion: {
              type: 'string',
              enum: [ '3.2', '3.6', '4.0', '4.2' ],
              description: 'Describes the ServerVersion of an a MongoDB account.',
              'x-ms-enum': { modelAsString: true, name: 'ServerVersion' }
            }
          }
        },
        enableAnalyticalStorage: {
          description: 'Flag to indicate whether to enable storage analytics.',
          type: 'boolean'
        },
        analyticalStorageConfiguration: {
          description: 'Analytical storage specific properties.',
          type: 'object',
          properties: {
            schemaType: {
              type: 'string',
              description: 'Describes the types of schema for analytical storage.',
              enum: [ 'WellDefined', 'FullFidelity' ],
              'x-ms-enum': {
                modelAsString: true,
                name: 'AnalyticalStorageSchemaType'
              }
            }
          }
        },
        createMode: {
          description: 'Enum to indicate the mode of account creation.',
          type: 'string',
          default: 'Default',
          enum: [ 'Default', 'Restore' ],
          'x-ms-enum': { name: 'CreateMode', modelAsString: true }
        },
        backupPolicy: {
          description: 'The object representing the policy for taking backups on an account.',
          type: 'object',
          discriminator: 'type',
          properties: {
            type: {
              description: 'Describes the mode of backups.',
              type: 'string',
              enum: [ 'Periodic', 'Continuous' ],
              'x-ms-enum': { modelAsString: true, name: 'BackupPolicyType' }
            },
            migrationState: {
              description: 'The object representing the state of the migration between the backup policies.',
              type: 'object',
              properties: {
                status: {
                  description: 'Describes the status of migration between backup policy types.',
                  type: 'string',
                  enum: [ 'Invalid', 'InProgress', 'Completed', 'Failed' ],
                  'x-ms-enum': {
                    modelAsString: true,
                    name: 'BackupPolicyMigrationStatus'
                  }
                },
                targetType: {
                  description: 'Describes the target backup policy type of the backup policy migration.',
                  type: 'string',
                  enum: [ 'Periodic', 'Continuous' ],
                  'x-ms-enum': { modelAsString: true, name: 'BackupPolicyType' }
                },
                startTime: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Time at which the backup policy migration started (ISO-8601 format).'
                }
              }
            }
          },
          required: [ 'type' ]
        },
        cors: {
          type: 'array',
          description: 'The CORS policy for the Cosmos DB database account.',
          items: {
            type: 'object',
            description: 'The CORS policy for the Cosmos DB database account.',
            properties: {
              allowedOrigins: {
                description: 'The origin domains that are permitted to make a request against the service via CORS.',
                type: 'string'
              },
              allowedMethods: {
                description: 'The methods (HTTP request verbs) that the origin domain may use for a CORS request.',
                type: 'string'
              },
              allowedHeaders: {
                description: 'The request headers that the origin domain may specify on the CORS request.',
                type: 'string'
              },
              exposedHeaders: {
                description: 'The response headers that may be sent in the response to the CORS request and exposed by the browser to the request issuer.',
                type: 'string'
              },
              maxAgeInSeconds: {
                description: 'The maximum amount time that a browser should cache the preflight OPTIONS request.',
                type: 'integer',
                minimum: 1,
                maximum: 2147483647,
                format: 'int64'
              }
            },
            required: [ 'allowedOrigins' ]
          }
        },
        networkAclBypass: {
          description: 'Indicates what services are allowed to bypass firewall checks.',
          type: 'string',
          enum: [ 'None', 'AzureServices' ],
          'x-ms-enum': { name: 'NetworkAclBypass', modelAsString: false }
        },
        networkAclBypassResourceIds: {
          type: 'array',
          description: 'An array that contains the Resource Ids for Network Acl Bypass for the Cosmos DB account.',
          items: { type: 'string' }
        },
        disableLocalAuth: {
          description: 'Opt-out of local authentication and ensure only MSI and AAD can be used exclusively for authentication.',
          type: 'boolean'
        },
        restoreParameters: {
          description: 'Parameters to indicate the information about the restore.',
          type: 'object',
          'x-ms-mutability': [ 'read', 'create' ],
          properties: {
            restoreMode: {
              type: 'string',
              enum: [ 'PointInTime' ],
              description: 'Describes the mode of the restore.',
              'x-ms-enum': { modelAsString: true, name: 'RestoreMode' }
            },
            restoreSource: {
              type: 'string',
              description: 'The id of the restorable database account from which the restore has to be initiated. For example: /subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/{location}/restorableDatabaseAccounts/{restorableDatabaseAccountName}'
            },
            restoreTimestampInUtc: {
              type: 'string',
              format: 'date-time',
              description: 'Time to which the account has to be restored (ISO-8601 format).'
            },
            databasesToRestore: {
              type: 'array',
              description: 'List of specific databases available for restore.',
              items: {
                type: 'object',
                description: 'Specific Databases to restore.',
                properties: {
                  databaseName: {
                    type: 'string',
                    description: 'The name of the database available for restore.'
                  },
                  collectionNames: {
                    type: 'array',
                    description: 'The names of the collections available for restore.',
                    items: {
                      type: 'string',
                      description: 'The name of the collection.'
                    }
                  }
                }
              }
            }
          }
        },
        capacity: {
          description: 'The object that represents all properties related to capacity enforcement on an account.',
          type: 'object',
          properties: {
            totalThroughputLimit: {
              type: 'integer',
              minimum: -1,
              format: 'int32',
              description: 'The total throughput limit imposed on the account. A totalThroughputLimit of 2000 imposes a strict limit of max throughput that can be provisioned on that account to be 2000. A totalThroughputLimit of -1 indicates no limits on provisioning of throughput.'
            }
          }
        }
      },
      required: [ 'locations', 'databaseAccountOfferType' ]
    }
  },
  allOf: [
    {
      type: 'object',
      description: 'The core properties of ARM resources.',
      properties: {
        id: {
          readOnly: true,
          type: 'string',
          description: 'The unique resource identifier of the ARM resource.'
        },
        name: {
          readOnly: true,
          type: 'string',
          description: 'The name of the ARM resource.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'The type of Azure resource.'
        },
        location: {
          type: 'string',
          description: 'The location of the resource group to which the resource belongs.'
        },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Tags are a list of key-value pairs that describe the resource. These tags can be used in viewing and grouping this resource (across resource groups). A maximum of 15 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters. For example, the default experience for a template type is set with "defaultExperience": "Cassandra". Current "defaultExperience" values also include "Table", "Graph", "DocumentDB", and "MongoDB".'
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  required: [ 'properties' ]
}
```
## Misc
The resource version is `2022-05-15`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/cosmos-db.json).
