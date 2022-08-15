---
id: CassandraCluster
title: CassandraCluster
---
Provides a **CassandraCluster** from the **DocumentDB** group
## Examples
### CosmosDBManagedCassandraClusterCreate
```js
exports.createResources = () => [
  {
    type: "CassandraCluster",
    group: "DocumentDB",
    name: "myCassandraCluster",
    properties: () => ({
      location: "West US",
      tags: {},
      properties: {
        delegatedManagementSubnetId:
          "/subscriptions/536e130b-d7d6-4ac7-98a5-de20d69588d2/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/management",
        cassandraVersion: "3.11",
        hoursBetweenBackups: 24,
        authenticationMethod: "Cassandra",
        initialCassandraAdminPassword: "mypassword",
        externalSeedNodes: [
          { ipAddress: "10.52.221.2" },
          { ipAddress: "10.52.221.3" },
          { ipAddress: "10.52.221.4" },
        ],
        clusterNameOverride: "ClusterNameIllegalForAzureResource",
        clientCertificates: [
          {
            pem: "-----BEGIN CERTIFICATE-----\n...Base64 encoded certificate...\n-----END CERTIFICATE-----",
          },
        ],
        externalGossipCertificates: [
          {
            pem: "-----BEGIN CERTIFICATE-----\n...Base64 encoded certificate...\n-----END CERTIFICATE-----",
          },
        ],
      },
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
  description: 'Representation of a managed Cassandra cluster.',
  type: 'object',
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
        },
        identity: {
          description: 'Identity for the resource.',
          type: 'object',
          properties: {
            principalId: {
              readOnly: true,
              type: 'string',
              description: 'The object id of the identity resource.'
            },
            tenantId: {
              readOnly: true,
              type: 'string',
              description: 'The tenant id of the resource.'
            },
            type: {
              type: 'string',
              description: 'The type of the resource.',
              enum: [ 'SystemAssigned', 'None' ],
              'x-ms-enum': {
                name: 'ManagedCassandraResourceIdentityType',
                modelAsString: true
              }
            }
          }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      type: 'object',
      description: 'Properties of a managed Cassandra cluster.',
      properties: {
        provisioningState: {
          description: 'The status of the resource at the time the operation was called.',
          type: 'string',
          enum: [
            'Creating',
            'Updating',
            'Deleting',
            'Succeeded',
            'Failed',
            'Canceled'
          ],
          'x-ms-enum': {
            name: 'ManagedCassandraProvisioningState',
            modelAsString: true
          }
        },
        restoreFromBackupId: {
          type: 'string',
          'x-ms-mutability': [ 'create' ],
          description: 'To create an empty cluster, omit this field or set it to null. To restore a backup into a new cluster, set this field to the resource id of the backup.'
        },
        delegatedManagementSubnetId: {
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ],
          description: "Resource id of a subnet that this cluster's management service should have its network interface attached to. The subnet must be routable to all subnets that will be delegated to data centers. The resource id must be of the form '/subscriptions/<subscription id>/resourceGroups/<resource group>/providers/Microsoft.Network/virtualNetworks/<virtual network>/subnets/<subnet>'"
        },
        cassandraVersion: {
          type: 'string',
          description: 'Which version of Cassandra should this cluster converge to running (e.g., 3.11). When updated, the cluster may take some time to migrate to the new version.'
        },
        clusterNameOverride: {
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ],
          description: 'If you need to set the clusterName property in cassandra.yaml to something besides the resource name of the cluster, set the value to use on this property.'
        },
        authenticationMethod: {
          type: 'string',
          description: "Which authentication method Cassandra should use to authenticate clients. 'None' turns off authentication, so should not be used except in emergencies. 'Cassandra' is the default password based authentication. The default is 'Cassandra'.",
          enum: [ 'None', 'Cassandra' ],
          'x-ms-enum': { name: 'AuthenticationMethod', modelAsString: true }
        },
        initialCassandraAdminPassword: {
          'x-ms-mutability': [ 'create' ],
          'x-ms-secret': true,
          description: "Initial password for clients connecting as admin to the cluster. Should be changed after cluster creation. Returns null on GET. This field only applies when the authenticationMethod field is 'Cassandra'.",
          type: 'string'
        },
        prometheusEndpoint: {
          description: 'Hostname or IP address where the Prometheus endpoint containing data about the managed Cassandra nodes can be reached.',
          type: 'object',
          properties: {
            ipAddress: {
              description: 'IP address of this seed node.',
              type: 'string'
            }
          }
        },
        repairEnabled: {
          type: 'boolean',
          description: 'Should automatic repairs run on this cluster? If omitted, this is true, and should stay true unless you are running a hybrid cluster where you are already doing your own repairs.'
        },
        clientCertificates: {
          description: 'List of TLS certificates used to authorize clients connecting to the cluster. All connections are TLS encrypted whether clientCertificates is set or not, but if clientCertificates is set, the managed Cassandra cluster will reject all connections not bearing a TLS client certificate that can be validated from one or more of the public certificates in this property.',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pem: {
                description: 'PEM formatted public key.',
                type: 'string'
              }
            }
          }
        },
        externalGossipCertificates: {
          description: 'List of TLS certificates used to authorize gossip from unmanaged data centers. The TLS certificates of all nodes in unmanaged data centers must be verifiable using one of the certificates provided in this property.',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pem: {
                description: 'PEM formatted public key.',
                type: 'string'
              }
            }
          }
        },
        gossipCertificates: {
          readOnly: true,
          'x-ms-mutability': [ 'read' ],
          description: 'List of TLS certificates that unmanaged nodes must trust for gossip with managed nodes. All managed nodes will present TLS client certificates that are verifiable using one of the certificates provided in this property.',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pem: {
                description: 'PEM formatted public key.',
                type: 'string'
              }
            }
          }
        },
        externalSeedNodes: {
          type: 'array',
          description: 'List of IP addresses of seed nodes in unmanaged data centers. These will be added to the seed node lists of all managed nodes.',
          items: {
            type: 'object',
            properties: {
              ipAddress: {
                description: 'IP address of this seed node.',
                type: 'string'
              }
            }
          }
        },
        seedNodes: {
          readOnly: true,
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ipAddress: {
                description: 'IP address of this seed node.',
                type: 'string'
              }
            }
          },
          description: 'List of IP addresses of seed nodes in the managed data centers. These should be added to the seed node lists of all unmanaged nodes.'
        },
        hoursBetweenBackups: {
          type: 'integer',
          format: 'int32',
          description: 'Number of hours to wait between taking a backup of the cluster. To disable backups, set this property to 0.'
        },
        deallocated: {
          type: 'boolean',
          description: 'Whether the cluster and associated data centers has been deallocated.'
        },
        cassandraAuditLoggingEnabled: {
          type: 'boolean',
          description: 'Whether Cassandra audit logging is enabled'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-05-15`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/managedCassandra.json).
