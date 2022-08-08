---
id: GalleryImage
title: GalleryImage
---
Provides a **GalleryImage** from the **Compute** group
## Examples
### Create or update a simple gallery image.
```js
exports.createResources = () => [
  {
    type: "GalleryImage",
    group: "Compute",
    name: "myGalleryImage",
    properties: () => ({
      location: "West US",
      properties: {
        osType: "Windows",
        osState: "Generalized",
        hyperVGeneration: "V1",
        identifier: {
          publisher: "myPublisherName",
          offer: "myOfferName",
          sku: "mySkuName",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      gallery: "myGallery",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Gallery](../Compute/Gallery.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        description: {
          type: 'string',
          description: 'The description of this gallery image definition resource. This property is updatable.'
        },
        eula: {
          type: 'string',
          description: 'The Eula agreement for the gallery image definition.'
        },
        privacyStatementUri: { type: 'string', description: 'The privacy statement uri.' },
        releaseNoteUri: { type: 'string', description: 'The release note uri.' },
        osType: {
          type: 'string',
          description: 'This property allows you to specify the type of the OS that is included in the disk when creating a VM from a managed image. <br><br> Possible values are: <br><br> **Windows** <br><br> **Linux**',
          enum: [ 'Windows', 'Linux' ],
          'x-ms-enum': { name: 'OperatingSystemTypes', modelAsString: false }
        },
        osState: {
          type: 'string',
          description: "This property allows the user to specify whether the virtual machines created under this image are 'Generalized' or 'Specialized'.",
          enum: [ 'Generalized', 'Specialized' ],
          'x-ms-enum': { name: 'OperatingSystemStateTypes', modelAsString: false }
        },
        hyperVGeneration: {
          type: 'string',
          description: 'The hypervisor generation of the Virtual Machine. Applicable to OS disks only.',
          enum: [ 'V1', 'V2' ],
          'x-ms-enum': { name: 'HyperVGeneration', modelAsString: true }
        },
        endOfLifeDate: {
          type: 'string',
          format: 'date-time',
          description: 'The end of life date of the gallery image definition. This property can be used for decommissioning purposes. This property is updatable.'
        },
        identifier: {
          properties: {
            publisher: {
              type: 'string',
              description: 'The name of the gallery image definition publisher.'
            },
            offer: {
              type: 'string',
              description: 'The name of the gallery image definition offer.'
            },
            sku: {
              type: 'string',
              description: 'The name of the gallery image definition SKU.'
            }
          },
          required: [ 'publisher', 'offer', 'sku' ],
          description: 'This is the gallery image definition identifier.'
        },
        recommended: {
          properties: {
            vCPUs: {
              properties: {
                min: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The minimum number of the resource.'
                },
                max: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The maximum number of the resource.'
                }
              },
              description: 'Describes the resource range.'
            },
            memory: {
              properties: {
                min: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The minimum number of the resource.'
                },
                max: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The maximum number of the resource.'
                }
              },
              description: 'Describes the resource range.'
            }
          },
          description: 'The properties describe the recommended machine configuration for this Image Definition. These properties are updatable.'
        },
        disallowed: {
          properties: {
            diskTypes: {
              type: 'array',
              items: { type: 'string' },
              description: 'A list of disk types.'
            }
          },
          description: 'Describes the disallowed disk types.'
        },
        purchasePlan: {
          properties: {
            name: { type: 'string', description: 'The plan ID.' },
            publisher: { type: 'string', description: 'The publisher ID.' },
            product: { type: 'string', description: 'The product ID.' }
          },
          description: 'Describes the gallery image definition purchase plan. This is used by marketplace images.'
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
        features: {
          type: 'array',
          items: {
            properties: {
              name: {
                type: 'string',
                description: 'The name of the gallery image feature.'
              },
              value: {
                type: 'string',
                description: 'The value of the gallery image feature.'
              }
            },
            description: 'A feature for gallery image.'
          },
          'x-ms-identifiers': [ 'name' ],
          description: 'A list of gallery image features.'
        },
        architecture: {
          type: 'string',
          description: 'The architecture of the image. Applicable to OS disks only.',
          enum: [ 'x64', 'Arm64' ],
          'x-ms-enum': { name: 'Architecture', modelAsString: true }
        }
      },
      required: [ 'osType', 'osState', 'identifier' ],
      description: 'Describes the properties of a gallery image definition.'
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
  description: 'Specifies information about the gallery image definition that you want to create or update.'
}
```
## Misc
The resource version is `2022-01-03`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/GalleryRP/stable/2022-01-03/gallery.json).
