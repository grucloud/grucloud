---
id: Gallery
title: Gallery
---
Provides a **Gallery** from the **Compute** group
## Examples
### Create or update a simple gallery.
```js
exports.createResources = () => [
  {
    type: "Gallery",
    group: "Compute",
    name: "myGallery",
    properties: () => ({
      location: "West US",
      properties: { description: "This is the gallery description." },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```

### Create or update a simple gallery with sharing profile.
```js
exports.createResources = () => [
  {
    type: "Gallery",
    group: "Compute",
    name: "myGallery",
    properties: () => ({
      location: "West US",
      properties: {
        description: "This is the gallery description.",
        sharingProfile: { permissions: "Groups" },
      },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```

### Create or update a simple gallery with soft deletion enabled.
```js
exports.createResources = () => [
  {
    type: "Gallery",
    group: "Compute",
    name: "myGallery",
    properties: () => ({
      location: "West US",
      properties: {
        description: "This is the gallery description.",
        softDeletePolicy: { isSoftDeleteEnabled: true },
      },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```

### Create a community gallery.
```js
exports.createResources = () => [
  {
    type: "Gallery",
    group: "Compute",
    name: "myGallery",
    properties: () => ({
      location: "West US",
      properties: {
        description: "This is the gallery description.",
        sharingProfile: {
          permissions: "Community",
          communityGalleryInfo: {
            publisherUri: "uri",
            publisherContact: "pir@microsoft.com",
            eula: "eula",
            publicNamePrefix: "PirPublic",
          },
        },
      },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

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
        description: {
          type: 'string',
          description: 'The description of this Shared Image Gallery resource. This property is updatable.'
        },
        identifier: {
          properties: {
            uniqueName: {
              readOnly: true,
              type: 'string',
              description: 'The unique name of the Shared Image Gallery. This name is generated automatically by Azure.'
            }
          },
          description: 'Describes the gallery unique name.'
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          title: 'The current state of the gallery or gallery artifact.',
          description: 'The provisioning state, which only appears in the response.',
          enum: [
            'Creating',
            'Updating',
            'Failed',
            'Succeeded',
            'Deleting',
            'Migrating'
          ],
          'x-ms-enum': { name: 'GalleryProvisioningState', modelAsString: true }
        },
        sharingProfile: {
          description: 'Profile for gallery sharing to subscription or tenant',
          properties: {
            permissions: {
              type: 'string',
              description: 'This property allows you to specify the permission of sharing gallery. <br><br> Possible values are: <br><br> **Private** <br><br> **Groups** <br><br> **Community**',
              enum: [ 'Private', 'Groups', 'Community' ],
              'x-ms-enum': {
                name: 'GallerySharingPermissionTypes',
                modelAsString: true
              }
            },
            groups: {
              readOnly: true,
              type: 'array',
              items: {
                description: 'Group of the gallery sharing profile',
                properties: {
                  type: {
                    type: 'string',
                    description: 'This property allows you to specify the type of sharing group. <br><br> Possible values are: <br><br> **Subscriptions** <br><br> **AADTenants**',
                    enum: [ 'Subscriptions', 'AADTenants' ],
                    'x-ms-enum': {
                      name: 'SharingProfileGroupTypes',
                      modelAsString: true
                    }
                  },
                  ids: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'A list of subscription/tenant ids the gallery is aimed to be shared to.'
                  }
                }
              },
              'x-ms-identifiers': [],
              description: 'A list of sharing profile groups.'
            },
            communityGalleryInfo: {
              description: 'Information of community gallery if current gallery is shared to community.',
              type: 'object',
              properties: {
                publisherUri: {
                  type: 'string',
                  description: 'The link to the publisher website. Visible to all users.'
                },
                publisherContact: {
                  type: 'string',
                  description: 'Community gallery publisher support email. The email address of the publisher. Visible to all users.'
                },
                eula: {
                  type: 'string',
                  description: 'End-user license agreement for community gallery image.'
                },
                publicNamePrefix: {
                  type: 'string',
                  description: 'The prefix of the gallery name that will be displayed publicly. Visible to all users.'
                },
                communityGalleryEnabled: {
                  readOnly: true,
                  type: 'boolean',
                  description: 'Contains info about whether community gallery sharing is enabled.'
                },
                publicNames: {
                  readOnly: true,
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Community gallery public name list.'
                }
              }
            }
          }
        },
        softDeletePolicy: {
          type: 'object',
          properties: {
            isSoftDeleteEnabled: {
              type: 'boolean',
              description: 'Enables soft-deletion for resources in this gallery, allowing them to be recovered within retention time.'
            }
          },
          description: 'Contains information about the soft deletion policy of the gallery.'
        },
        sharingStatus: {
          readOnly: true,
          type: 'object',
          properties: {
            aggregatedState: {
              type: 'string',
              description: 'Aggregated sharing state of current gallery.',
              readOnly: true,
              title: 'The sharing state of the gallery.',
              enum: [ 'Succeeded', 'InProgress', 'Failed', 'Unknown' ],
              'x-ms-enum': { name: 'SharingState', modelAsString: true }
            },
            summary: {
              type: 'array',
              items: {
                type: 'object',
                description: 'Gallery regional sharing status',
                properties: {
                  region: { type: 'string', description: 'Region name' },
                  state: {
                    type: 'string',
                    description: 'Gallery sharing state in current region',
                    readOnly: true,
                    title: 'The sharing state of the gallery.',
                    enum: [ 'Succeeded', 'InProgress', 'Failed', 'Unknown' ],
                    'x-ms-enum': { name: 'SharingState', modelAsString: true }
                  },
                  details: {
                    type: 'string',
                    description: 'Details of gallery regional sharing failure.'
                  }
                }
              },
              'x-ms-identifiers': [ 'region' ],
              description: 'Summary of all regional sharing status.'
            }
          },
          description: 'Sharing status of current gallery.'
        }
      },
      description: 'Describes the properties of a Shared Image Gallery.'
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
  description: 'Specifies information about the Shared Image Gallery that you want to create or update.'
}
```
## Misc
The resource version is `2022-01-03`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/GalleryRP/stable/2022-01-03/gallery.json).
