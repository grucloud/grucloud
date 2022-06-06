---
id: ManagedClusterSnapshot
title: ManagedClusterSnapshot
---
Provides a **ManagedClusterSnapshot** from the **ContainerService** group
## Examples
### Create/Update Managed Cluster Snapshot
```js
exports.createResources = () => [
  {
    type: "ManagedClusterSnapshot",
    group: "ContainerService",
    name: "myManagedClusterSnapshot",
    properties: () => ({
      location: "westus",
      tags: { key1: "val1", key2: "val2" },
      properties: {
        creationData: {
          sourceResourceId:
            "/subscriptions/subid1/resourcegroups/rg1/providers/Microsoft.ContainerService/managedClusters/cluster1",
        },
      },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    properties: {
      description: 'Properties of a managed cluster snapshot.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        creationData: {
          description: 'CreationData to be used to specify the source resource ID to create this snapshot.',
          type: 'object',
          properties: {
            sourceResourceId: {
              type: 'string',
              description: 'This is the ARM ID of the source object to be used to create the target object.'
            }
          }
        },
        snapshotType: {
          type: 'string',
          default: 'NodePool',
          enum: [ 'NodePool', 'ManagedCluster' ],
          'x-ms-enum': {
            name: 'SnapshotType',
            modelAsString: true,
            values: [
              {
                value: 'NodePool',
                description: 'The snapshot is a snapshot of a node pool.'
              },
              {
                value: 'ManagedCluster',
                description: 'The snapshot is a snapshot of a managed cluster.'
              }
            ]
          },
          description: 'The type of a snapshot. The default is NodePool.'
        },
        managedClusterPropertiesReadOnly: {
          description: 'What the properties will be showed when getting managed cluster snapshot. Those properties are read-only.',
          type: 'object',
          readOnly: true,
          properties: {
            kubernetesVersion: {
              type: 'string',
              description: 'The current kubernetes version.'
            },
            sku: {
              type: 'object',
              description: 'The current managed cluster sku.',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of a managed cluster SKU.',
                  enum: [ 'Basic' ],
                  'x-ms-enum': {
                    name: 'ManagedClusterSKUName',
                    modelAsString: true
                  }
                },
                tier: {
                  type: 'string',
                  title: 'The tier of a managed cluster SKU.',
                  description: "If not specified, the default is 'Free'. See [uptime SLA](https://docs.microsoft.com/azure/aks/uptime-sla) for more details.",
                  enum: [ 'Paid', 'Free' ],
                  'x-ms-enum': {
                    name: 'ManagedClusterSKUTier',
                    modelAsString: true,
                    values: [
                      {
                        value: 'Paid',
                        description: "Guarantees 99.95% availability of the Kubernetes API server endpoint for clusters that use Availability Zones and 99.9% of availability for clusters that don't use Availability Zones."
                      },
                      {
                        value: 'Free',
                        description: 'No guaranteed SLA, no additional charges. Free tier clusters have an SLO of 99.5%.'
                      }
                    ]
                  }
                }
              }
            },
            enableRbac: {
              type: 'boolean',
              description: 'Whether the cluster has enabled Kubernetes Role-Based Access Control or not.'
            },
            networkProfile: {
              type: 'object',
              description: 'The current network profile.',
              readOnly: true,
              properties: {
                networkPlugin: {
                  description: 'networkPlugin for managed cluster snapshot.',
                  type: 'string',
                  enum: [ 'azure', 'kubenet', 'none' ],
                  default: 'kubenet',
                  'x-ms-enum': {
                    name: 'NetworkPlugin',
                    modelAsString: true,
                    values: [
                      {
                        value: 'azure',
                        description: 'Use the Azure CNI network plugin. See [Azure CNI (advanced) networking](https://docs.microsoft.com/azure/aks/concepts-network#azure-cni-advanced-networking) for more information.'
                      },
                      {
                        value: 'kubenet',
                        description: 'Use the Kubenet network plugin. See [Kubenet (basic) networking](https://docs.microsoft.com/azure/aks/concepts-network#kubenet-basic-networking) for more information.'
                      },
                      {
                        value: 'none',
                        description: 'Do not use a network plugin. A custom CNI will need to be installed after cluster creation for networking functionality.'
                      }
                    ]
                  }
                },
                networkPluginMode: {
                  description: 'NetworkPluginMode for managed cluster snapshot.',
                  type: 'string',
                  enum: [ 'Overlay' ],
                  'x-ms-enum': {
                    name: 'NetworkPluginMode',
                    modelAsString: true,
                    values: [
                      {
                        value: 'Overlay',
                        description: 'Pods are given IPs from the PodCIDR address space but use Azure Routing Domains rather than Kubenet reference plugins host-local and bridge.'
                      }
                    ]
                  }
                },
                networkPolicy: {
                  description: 'networkPolicy for managed cluster snapshot.',
                  type: 'string',
                  enum: [ 'calico', 'azure' ],
                  'x-ms-enum': {
                    name: 'NetworkPolicy',
                    modelAsString: true,
                    values: [
                      {
                        value: 'calico',
                        description: 'Use Calico network policies. See [differences between Azure and Calico policies](https://docs.microsoft.com/azure/aks/use-network-policies#differences-between-azure-and-calico-policies-and-their-capabilities) for more information.'
                      },
                      {
                        value: 'azure',
                        description: 'Use Azure network policies. See [differences between Azure and Calico policies](https://docs.microsoft.com/azure/aks/use-network-policies#differences-between-azure-and-calico-policies-and-their-capabilities) for more information.'
                      }
                    ]
                  }
                },
                networkMode: {
                  description: 'networkMode for managed cluster snapshot.',
                  type: 'string',
                  enum: [ 'transparent', 'bridge' ],
                  'x-ms-enum': {
                    name: 'networkMode',
                    modelAsString: true,
                    values: [
                      {
                        value: 'transparent',
                        description: 'No bridge is created. Intra-VM Pod to Pod communication is through IP routes created by Azure CNI. See [Transparent Mode](https://docs.microsoft.com/azure/aks/faq#transparent-mode) for more information.'
                      },
                      {
                        value: 'bridge',
                        description: 'This is no longer supported'
                      }
                    ]
                  },
                  title: 'The network mode Azure CNI is configured with.'
                },
                loadBalancerSku: {
                  description: 'loadBalancerSku for managed cluster snapshot.',
                  type: 'string',
                  enum: [ 'standard', 'basic' ],
                  'x-ms-enum': {
                    name: 'loadBalancerSku',
                    modelAsString: true,
                    values: [
                      {
                        value: 'standard',
                        description: 'Use a a standard Load Balancer. This is the recommended Load Balancer SKU. For more information about on working with the load balancer in the managed cluster, see the [standard Load Balancer](https://docs.microsoft.com/azure/aks/load-balancer-standard) article.'
                      },
                      {
                        value: 'basic',
                        description: 'Use a basic Load Balancer with limited functionality.'
                      }
                    ]
                  },
                  title: 'The load balancer sku for the managed cluster.'
                }
              }
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
            },
            systemData: {
              readOnly: true,
              type: 'object',
              description: 'Azure Resource Manager metadata containing createdBy and modifiedBy information.',
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
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  description: 'A managed cluster snapshot resource.'
}
```
## Misc
The resource version is `2022-05-02-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/preview/2022-05-02-preview/managedClusters.json).
