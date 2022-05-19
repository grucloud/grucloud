---
id: PrivateEndpointConnection
title: PrivateEndpointConnection
---
Provides a **PrivateEndpointConnection** from the **DocumentDB** group
## Examples
### Approve or reject a private endpoint connection with a given name.
```js
exports.createResources = () => [
  {
    type: "PrivateEndpointConnection",
    group: "DocumentDB",
    name: "myPrivateEndpointConnection",
    properties: () => ({
      properties: {
        privateLinkServiceConnectionState: {
          status: "Approved",
          description: "Approved by johndoe@contoso.com",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      privateEndpoint: "myPrivateEndpoint",
      account: "myDatabaseAccount",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpoint](../Network/PrivateEndpoint.md)
- [DatabaseAccount](../DocumentDB/DatabaseAccount.md)
## Swagger Schema
```js
{
  description: 'A private endpoint connection',
  type: 'object',
  properties: {
    properties: {
      description: 'Resource properties.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        privateEndpoint: {
          description: 'Private endpoint which the connection belongs to.',
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Resource id of the private endpoint.'
            }
          }
        },
        privateLinkServiceConnectionState: {
          description: 'Connection State of the Private Endpoint Connection.',
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'The private link service connection status.'
            },
            description: {
              type: 'string',
              description: 'The private link service connection description.'
            },
            actionsRequired: {
              type: 'string',
              description: 'Any action that is required beyond basic workflow (approve/ reject/ disconnect)',
              readOnly: true
            }
          }
        },
        groupId: {
          type: 'string',
          description: 'Group id of the private endpoint.'
        },
        provisioningState: {
          type: 'string',
          description: 'Provisioning state of the private endpoint.'
        }
      }
    }
  },
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
  ]
}
```
## Misc
The resource version is `2022-02-15-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-02-15-preview/privateEndpointConnection.json).
