---
id: DiskAccess
title: DiskAccess
---
Provides a **DiskAccess** from the **Compute** group
## Examples
### Create a disk access resource.
```js
provider.Compute.makeDiskAccess({
  name: "myDiskAccess",
  properties: () => ({ location: "West US" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        privateEndpointConnections: {
          type: 'array',
          readOnly: true,
          items: {
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
          },
          description: 'A readonly collection of private endpoint connections created on the disk. Currently only one endpoint connection is supported.'
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'The disk access resource provisioning state.'
        },
        timeCreated: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'The time when the disk access was created.'
        }
      }
    },
    extendedLocation: {
      description: 'The extended location where the disk access will be created. Extended location cannot be changed.',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the extended location.'
        },
        type: {
          description: 'The type of the extended location.',
          type: 'string',
          enum: [ 'EdgeZone' ],
          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }
        }
      }
    }
  },
  allOf: [
    {
      description: 'The Resource model definition.',
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource Id' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type'
        },
        location: { type: 'string', description: 'Resource location' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      required: [ 'location' ],
      'x-ms-azure-resource': true
    }
  ],
  description: 'disk access resource.'
}
```
## Misc
The resource version is `2021-04-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-04-01/disk.json).
