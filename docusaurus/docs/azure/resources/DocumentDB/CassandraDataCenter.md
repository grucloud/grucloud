---
id: CassandraDataCenter
title: CassandraDataCenter
---
Provides a **CassandraDataCenter** from the **DocumentDB** group
## Examples
### CosmosDBManagedCassandraDataCenterCreate
```js
exports.createResources = () => [
  {
    type: "CassandraDataCenter",
    group: "DocumentDB",
    name: "myCassandraDataCenter",
    properties: () => ({
      properties: {
        dataCenterLocation: "West US 2",
        delegatedSubnetId:
          "/subscriptions/536e130b-d7d6-4ac7-98a5-de20d69588d2/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/dc1-subnet",
        nodeCount: 9,
        base64EncodedCassandraYamlFragment:
          "Y29tcGFjdGlvbl90aHJvdWdocHV0X21iX3Blcl9zZWM6IDMyCmNvbXBhY3Rpb25fbGFyZ2VfcGFydGl0aW9uX3dhcm5pbmdfdGhyZXNob2xkX21iOiAxMDA=",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      cluster: "myCassandraCluster",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [CassandraCluster](../DocumentDB/CassandraCluster.md)
## Swagger Schema
```json
{
  description: 'A managed Cassandra data center.',
  type: 'object',
  allOf: [
    {
      type: 'object',
      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags',
      properties: {
        id: {
          readOnly: true,
          type: 'string',
          description: 'The unique resource identifier of the database account.'
        },
        name: {
          readOnly: true,
          type: 'string',
          description: 'The name of the database account.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'The type of Azure resource.'
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'Properties of a managed Cassandra data center.',
      type: 'object',
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
        dataCenterLocation: {
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ],
          description: 'The region this data center should be created in.'
        },
        delegatedSubnetId: {
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ],
          description: "Resource id of a subnet the nodes in this data center should have their network interfaces connected to. The subnet must be in the same region specified in 'dataCenterLocation' and must be able to route to the subnet specified in the cluster's 'delegatedManagementSubnetId' property. This resource id will be of the form '/subscriptions/<subscription id>/resourceGroups/<resource group>/providers/Microsoft.Network/virtualNetworks/<virtual network>/subnets/<subnet>'."
        },
        nodeCount: {
          type: 'integer',
          format: 'int32',
          description: 'The number of nodes the data center should have. This is the desired number. After it is set, it may take some time for the data center to be scaled to match. To monitor the number of nodes and their status, use the fetchNodeStatus method on the cluster.'
        },
        seedNodes: {
          readOnly: true,
          type: 'array',
          description: 'IP addresses for seed nodes in this data center. This is for reference. Generally you will want to use the seedNodes property on the cluster, which aggregates the seed nodes from all data centers in the cluster.',
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
        base64EncodedCassandraYamlFragment: {
          type: 'string',
          description: 'A fragment of a cassandra.yaml configuration file to be included in the cassandra.yaml for all nodes in this data center. The fragment should be Base64 encoded, and only a subset of keys are allowed.'
        },
        managedDiskCustomerKeyUri: {
          type: 'string',
          description: 'Key uri to use for encryption of managed disks. Ensure the system assigned identity of the cluster has been assigned appropriate permissions(key get/wrap/unwrap permissions) on the key.'
        },
        backupStorageCustomerKeyUri: {
          type: 'string',
          description: 'Indicates the Key Uri of the customer key to use for encryption of the backup storage account.'
        },
        sku: {
          type: 'string',
          description: 'Virtual Machine SKU used for data centers. Default value is Standard_DS14_v2'
        },
        diskSku: {
          type: 'string',
          description: 'Disk SKU used for data centers. Default value is P30.'
        },
        diskCapacity: {
          type: 'integer',
          format: 'int32',
          description: 'Number of disk used for data centers. Default value is 4.'
        },
        availabilityZone: {
          type: 'boolean',
          description: 'If the azure data center has Availability Zone support, apply it to the Virtual Machine ScaleSet that host the cassandra data center virtual machines.'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-05-15`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/managedCassandra.json).
