---
id: GalleryApplication
title: GalleryApplication
---
Provides a **GalleryApplication** from the **Compute** group
## Examples
### Create or update a simple gallery Application.
```js
exports.createResources = () => [
  {
    type: "GalleryApplication",
    group: "Compute",
    name: "myGalleryApplication",
    properties: () => ({
      location: "West US",
      properties: {
        description: "This is the gallery application description.",
        eula: "This is the gallery application EULA.",
        privacyStatementUri: "myPrivacyStatementUri}",
        releaseNoteUri: "myReleaseNoteUri",
        supportedOSType: "Windows",
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
          description: 'The description of this gallery Application Definition resource. This property is updatable.'
        },
        eula: {
          type: 'string',
          description: 'The Eula agreement for the gallery Application Definition.'
        },
        privacyStatementUri: { type: 'string', description: 'The privacy statement uri.' },
        releaseNoteUri: { type: 'string', description: 'The release note uri.' },
        endOfLifeDate: {
          type: 'string',
          format: 'date-time',
          description: 'The end of life date of the gallery Application Definition. This property can be used for decommissioning purposes. This property is updatable.'
        },
        supportedOSType: {
          type: 'string',
          description: 'This property allows you to specify the supported type of the OS that application is built for. <br><br> Possible values are: <br><br> **Windows** <br><br> **Linux**',
          enum: [ 'Windows', 'Linux' ],
          'x-ms-enum': { name: 'OperatingSystemTypes', modelAsString: false }
        }
      },
      required: [ 'supportedOSType' ],
      description: 'Describes the properties of a gallery Application Definition.'
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
  description: 'Specifies information about the gallery Application Definition that you want to create or update.'
}
```
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/gallery.json).
