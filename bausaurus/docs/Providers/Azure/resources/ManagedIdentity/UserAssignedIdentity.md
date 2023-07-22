---
id: UserAssignedIdentity
title: UserAssignedIdentity
---
Provides a **UserAssignedIdentity** from the **ManagedIdentity** group
## Examples
### IdentityCreate
```js
exports.createResources = () => [
  {
    type: "UserAssignedIdentity",
    group: "ManagedIdentity",
    name: "myUserAssignedIdentity",
    properties: () => ({
      location: "eastus",
      tags: { key1: "value1", key2: "value2" },
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
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      readOnly: true,
      description: 'The properties associated with the identity.',
      type: 'object',
      title: 'User Assigned Identity properties.',
      properties: {
        tenantId: {
          type: 'string',
          readOnly: true,
          format: 'uuid',
          description: 'The id of the tenant which the identity belongs to.'
        },
        principalId: {
          type: 'string',
          readOnly: true,
          format: 'uuid',
          description: 'The id of the service principal object associated with the created identity.'
        },
        clientId: {
          type: 'string',
          readOnly: true,
          format: 'uuid',
          description: 'The id of the app associated with the identity. This is a random generated UUID by MSI.'
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
  description: 'Describes an identity resource.'
}
```
## Misc
The resource version is `2018-11-30`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/msi/resource-manager/Microsoft.ManagedIdentity/stable/2018-11-30/ManagedIdentity.json).
