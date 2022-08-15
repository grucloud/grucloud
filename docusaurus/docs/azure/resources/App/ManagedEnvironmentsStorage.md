---
id: ManagedEnvironmentsStorage
title: ManagedEnvironmentsStorage
---
Provides a **ManagedEnvironmentsStorage** from the **App** group
## Examples
### Create or update environments storage
```js
exports.createResources = () => [
  {
    type: "ManagedEnvironmentsStorage",
    group: "App",
    name: "myManagedEnvironmentsStorage",
    properties: () => ({
      properties: {
        azureFile: {
          accountName: "account1",
          accountKey: "key",
          shareName: "share1",
          accessMode: "ReadOnly",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      environment: "myManagedEnvironment",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ManagedEnvironment](../App/ManagedEnvironment.md)
## Swagger Schema
```json
{
  description: 'Storage resource for managedEnvironment.',
  type: 'object',
  allOf: [
    {
      title: 'Proxy Resource',
      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',
      type: 'object',
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
  properties: {
    properties: {
      description: 'Storage properties',
      type: 'object',
      properties: {
        azureFile: {
          description: 'Azure file properties',
          type: 'object',
          properties: {
            accountName: {
              description: 'Storage account name for azure file.',
              type: 'string'
            },
            accountKey: {
              description: 'Storage account key for azure file.',
              type: 'string',
              'x-ms-secret': true
            },
            accessMode: {
              description: 'Access mode for storage',
              enum: [ 'ReadOnly', 'ReadWrite' ],
              type: 'string',
              'x-ms-enum': { name: 'AccessMode', modelAsString: true }
            },
            shareName: { description: 'Azure file share name.', type: 'string' }
          }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/app/resource-manager/Microsoft.App/stable/2022-03-01/ManagedEnvironmentsStorages.json).
