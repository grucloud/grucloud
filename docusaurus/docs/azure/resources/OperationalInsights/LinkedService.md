---
id: LinkedService
title: LinkedService
---
Provides a **LinkedService** from the **OperationalInsights** group
## Examples
### LinkedServicesCreate
```js
exports.createResources = () => [
  {
    type: "LinkedService",
    group: "OperationalInsights",
    name: "myLinkedService",
    properties: () => ({
      properties: {
        writeAccessResourceId:
          "/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/mms-eus/providers/Microsoft.OperationalInsights/clusters/testcluster",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      workspace: "myWorkspace",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'The properties of the linked service.',
      properties: {
        resourceId: {
          type: 'string',
          description: 'The resource id of the resource that will be linked to the workspace. This should be used for linking resources which require read access'
        },
        writeAccessResourceId: {
          type: 'string',
          description: 'The resource id of the resource that will be linked to the workspace. This should be used for linking resources which require write access'
        },
        provisioningState: {
          type: 'string',
          description: 'The provisioning state of the linked service.',
          enum: [
            'Succeeded',
            'Deleting',
            'ProvisioningAccount',
            'Updating'
          ],
          'x-ms-enum': { name: 'LinkedServiceEntityStatus', modelAsString: true }
        }
      }
    },
    tags: {
      type: 'object',
      additionalProperties: { type: 'string' },
      'x-ms-mutability': [ 'read', 'create', 'update' ],
      description: 'Resource tags.'
    }
  },
  required: [ 'properties' ],
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
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  description: 'The top level Linked service resource container.'
}
```
## Misc
The resource version is `2020-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2020-08-01/LinkedServices.json).
