---
id: FleetMember
title: FleetMember
---
Provides a **FleetMember** from the **ContainerService** group
## Examples
### Create a fleet member resource. Joins an existing cluster to the fleet
```js
exports.createResources = () => [
  {
    type: "FleetMember",
    group: "ContainerService",
    name: "myFleetMember",
    properties: () => ({
      properties: {
        clusterResourceId:
          "/subscriptions/subid1/resourcegroups/rg1/providers/Microsoft.ContainerService/managedClusters/cluster-1",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      cluster: "myCluster",
      fleet: "myFleet",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Cluster](../OperationalInsights/Cluster.md)
- [Fleet](../ContainerService/Fleet.md)
## Swagger Schema
```js
{
  type: 'object',
  description: 'A member of the Fleet. It contains a reference to an existing Kubernetes cluster on Azure.',
  properties: {
    properties: {
      description: 'Properties of a Fleet member.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        clusterResourceId: {
          type: 'string',
          'x-ms-mutability': [ 'read', 'create' ],
          description: "The ARM resource id of the cluster that joins the Fleet. Must be a valid Azure resource id. e.g.: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerService/managedClusters/{clusterName}'."
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          'x-ms-enum': { name: 'FleetMemberProvisioningState', modelAsString: true },
          enum: [
            'Succeeded',
            'Failed',
            'Canceled',
            'Joining',
            'Leaving',
            'Updating'
          ],
          description: 'The provisioning state of the last accepted operation.'
        }
      }
    }
  },
  allOf: [
    {
      'x-ms-client-name': 'AzureEntityResource',
      title: 'Entity Resource',
      description: 'The resource model definition for an Azure Resource Manager resource with an etag.',
      type: 'object',
      properties: {
        etag: {
          type: 'string',
          readOnly: true,
          description: 'Resource Etag.'
        }
      },
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
  ]
}
```
## Misc
The resource version is `2022-06-02-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/preview/2022-06-02-preview/fleets.json).
