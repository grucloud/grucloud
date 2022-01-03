---
id: PrivateEndpointConnection
title: PrivateEndpointConnection
---
Provides a **PrivateEndpointConnection** from the **ContainerService** group
## Examples
### Update Private Endpoint Connection
```js
provider.ContainerService.makePrivateEndpointConnection({
  name: "myPrivateEndpointConnection",
  properties: () => ({
    properties: { privateLinkServiceConnectionState: { status: "Approved" } },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    privateEndpoint: resources.Network.PrivateEndpoint["myPrivateEndpoint"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpoint](../Network/PrivateEndpoint.md)
- [ManagedCluster](../ContainerService/ManagedCluster.md)
## Swagger Schema
```js
{
  description: 'A private endpoint connection',
  type: 'object',
  properties: {
    id: {
      readOnly: true,
      type: 'string',
      description: 'The ID of the private endpoint connection.'
    },
    name: {
      readOnly: true,
      type: 'string',
      description: 'The name of the private endpoint connection.',
      externalDocs: { url: 'https://aka.ms/search-naming-rules' }
    },
    type: {
      readOnly: true,
      type: 'string',
      description: 'The resource type.'
    },
    properties: {
      description: 'The properties of a private endpoint connection.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        provisioningState: {
          type: 'string',
          readOnly: true,
          description: 'The current provisioning state.',
          enum: [ 'Succeeded', 'Creating', 'Deleting', 'Failed' ],
          'x-ms-enum': {
            name: 'PrivateEndpointConnectionProvisioningState',
            modelAsString: true
          }
        },
        privateEndpoint: {
          description: 'The resource of private endpoint.',
          type: 'object',
          properties: {
            id: {
              description: 'The resource ID of the private endpoint',
              type: 'string'
            }
          }
        },
        privateLinkServiceConnectionState: {
          description: 'A collection of information about the state of the connection between service consumer and provider.',
          type: 'object',
          properties: {
            status: {
              enum: [ 'Pending', 'Approved', 'Rejected', 'Disconnected' ],
              type: 'string',
              description: 'The private link service connection status.',
              'x-ms-enum': { name: 'ConnectionStatus', modelAsString: true }
            },
            description: {
              type: 'string',
              description: 'The private link service connection description.'
            }
          }
        }
      },
      required: [ 'privateLinkServiceConnectionState' ]
    }
  },
  'x-ms-azure-resource': true
}
```
## Misc
The resource version is `2021-10-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/stable/2021-10-01/managedClusters.json).
