---
id: DiskAccessAPrivateEndpointConnection
title: DiskAccessAPrivateEndpointConnection
---
Provides a **DiskAccessAPrivateEndpointConnection** from the **Compute** group
## Examples
### Approve a Private Endpoint Connection under a disk access resource.
```js
exports.createResources = () => [
  {
    type: "DiskAccessAPrivateEndpointConnection",
    group: "Compute",
    name: "myDiskAccessAPrivateEndpointConnection",
    properties: () => ({
      properties: {
        privateLinkServiceConnectionState: {
          status: "Approved",
          description: "Approving myPrivateEndpointConnection",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      privateEndpoint: "myPrivateEndpoint",
      diskAccess: "myDiskAccess",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpoint](../Network/PrivateEndpoint.md)
- [DiskAccess](../Compute/DiskAccess.md)
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
          readOnly: true,
          properties: {
            id: {
              readOnly: true,
              type: 'string',
              description: 'The ARM identifier for Private Endpoint'
            }
          }
        },
        privateLinkServiceConnectionState: {
          description: 'A collection of information about the state of the connection between DiskAccess and Virtual Network.',
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
            actionsRequired: {
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
    },
    id: {
      readOnly: true,
      type: 'string',
      description: 'private endpoint connection Id'
    },
    name: {
      readOnly: true,
      type: 'string',
      description: 'private endpoint connection name'
    },
    type: {
      readOnly: true,
      type: 'string',
      description: 'private endpoint connection type'
    }
  },
  description: 'The Private Endpoint Connection resource.',
  'x-ms-azure-resource': true
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-08-01/disk.json).
