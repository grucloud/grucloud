---
id: PrivateEndpointConnection
title: PrivateEndpointConnection
---
Provides a **PrivateEndpointConnection** from the **DBforPostgreSQL** group
## Examples
### Approve or reject a private endpoint connection with a given name.
```js
provider.DBforPostgreSQL.makePrivateEndpointConnection({
  name: "myPrivateEndpointConnection",
  properties: () => ({
    properties: {
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "Approved by johndoe@contoso.com",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    privateEndpoint: resources.Network.PrivateEndpoint["myPrivateEndpoint"],
    server: resources.DBforPostgreSQL.Server["myServer"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpoint](../Network/PrivateEndpoint.md)
- [Server](../DBforPostgreSQL/Server.md)
## Swagger Schema
```js
{
  description: 'A private endpoint connection',
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
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
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
              description: 'Resource id of the private endpoint.',
              type: 'string'
            }
          },
          'x-ms-azure-resource': true
        },
        privateLinkServiceConnectionState: {
          description: 'Connection state of the private endpoint connection.',
          required: [ 'status', 'description' ],
          type: 'object',
          properties: {
            status: {
              description: 'The private link service connection status.',
              type: 'string'
            },
            description: {
              description: 'The private link service connection description.',
              type: 'string'
            },
            actionsRequired: {
              description: 'The actions required for private link service connection.',
              type: 'string',
              readOnly: true
            }
          }
        },
        provisioningState: {
          description: 'State of the private endpoint connection.',
          type: 'string',
          readOnly: true
        }
      }
    }
  }
}
```
## Misc
The resource version is `2018-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2018-06-01/PrivateEndpointConnections.json).
