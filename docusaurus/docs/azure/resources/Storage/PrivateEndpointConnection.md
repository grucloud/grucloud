---
id: PrivateEndpointConnection
title: PrivateEndpointConnection
---
Provides a **PrivateEndpointConnection** from the **Storage** group
## Examples
### StorageAccountPutPrivateEndpointConnection
```js
provider.Storage.makePrivateEndpointConnection({
  name: "myPrivateEndpointConnection",
  properties: () => ({
    properties: {
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "Auto-Approved",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    privateEndpoint: resources.Network.PrivateEndpoint["myPrivateEndpoint"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpoint](../Network/PrivateEndpoint.md)
- [StorageAccount](../Storage/StorageAccount.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Resource properties.',
      properties: {
        privateEndpoint: {
          description: 'The resource of private end point.',
          properties: {
            id: {
              readOnly: true,
              type: 'string',
              description: 'The ARM identifier for Private Endpoint'
            }
          }
        },
        privateLinkServiceConnectionState: {
          description: 'A collection of information about the state of the connection between service consumer and provider.',
          properties: {
            status: {
              description: 'Indicates whether the connection has been Approved/Rejected/Removed by the owner of the service.',
              type: 'string',
              enum: [ 'Pending', 'Approved', 'Rejected' ],
              'x-ms-enum': {
                name: 'PrivateEndpointServiceConnectionStatus',
                modelAsString: true
              }
            },
            description: {
              type: 'string',
              description: 'The reason for approval/rejection of the connection.'
            },
            actionRequired: {
              type: 'string',
              description: 'A message indicating if changes on the service provider require any updates on the consumer.'
            }
          }
        },
        provisioningState: {
          description: 'The provisioning state of the private endpoint connection resource.',
          type: 'string',
          readOnly: true,
          enum: [ 'Succeeded', 'Creating', 'Deleting', 'Failed' ],
          'x-ms-enum': {
            name: 'PrivateEndpointConnectionProvisioningState',
            modelAsString: true
          }
        }
      },
      required: [ 'privateLinkServiceConnectionState' ]
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
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  description: 'The Private Endpoint Connection resource.'
}
```
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-06-01/storage.json).
