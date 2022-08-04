---
id: TrustedAccessRoleBinding
title: TrustedAccessRoleBinding
---
Provides a **TrustedAccessRoleBinding** from the **ContainerService** group
## Examples
### Create or update a trusted access role binding
```js
exports.createResources = () => [
  {
    type: "TrustedAccessRoleBinding",
    group: "ContainerService",
    name: "myTrustedAccessRoleBinding",
    properties: () => ({
      properties: {
        sourceResourceId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/b/providers/Microsoft.MachineLearningServices/workspaces/c",
        roles: [
          "Microsoft.MachineLearningServices/workspaces/reader",
          "Microsoft.MachineLearningServices/workspaces/writer",
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      resource: "myManagedCluster",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ManagedCluster](../ContainerService/ManagedCluster.md)
## Swagger Schema
```js
{
  type: 'object',
  description: 'Defines binding between a resource and role',
  required: [ 'properties' ],
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
  ],
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      type: 'object',
      description: 'Properties for trusted access role binding',
      required: [ 'sourceResourceId', 'roles' ],
      properties: {
        provisioningState: {
          type: 'string',
          readOnly: true,
          description: 'The current provisioning state of trusted access role binding.',
          enum: [ 'Succeeded', 'Failed', 'Updating', 'Deleting' ],
          'x-ms-enum': {
            name: 'TrustedAccessRoleBindingProvisioningState',
            modelAsString: true
          }
        },
        sourceResourceId: {
          type: 'string',
          description: 'The ARM resource ID of source resource that trusted access is configured for.'
        },
        roles: {
          type: 'array',
          items: { type: 'string' },
          description: "A list of roles to bind, each item is a resource type qualified role name. For example: 'Microsoft.MachineLearningServices/workspaces/reader'."
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-06-02-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/preview/2022-06-02-preview/managedClusters.json).
