---
id: RegistryProperties
title: RegistryProperties
---
Provides a **RegistryProperties** from the **ContainerRegistry** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  description: 'An object that represents a container registry.',
  allOf: [
    {
      description: 'An Azure resource.',
      required: [ 'location' ],
      properties: {
        id: {
          description: 'The resource ID.',
          type: 'string',
          readOnly: true
        },
        name: {
          description: 'The name of the resource.',
          type: 'string',
          readOnly: true
        },
        type: {
          description: 'The type of the resource.',
          type: 'string',
          readOnly: true
        },
        location: {
          description: 'The location of the resource. This cannot be changed after the resource is created.',
          type: 'string'
        },
        tags: {
          description: 'The tags of the resource.',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'The properties of the container registry.',
      'x-ms-client-flatten': true,
      required: [ 'storageAccount' ],
      properties: {
        loginServer: {
          description: 'The URL that can be used to log into the container registry.',
          type: 'string',
          readOnly: true
        },
        creationDate: {
          format: 'date-time',
          description: 'The creation date of the container registry in ISO8601 format.',
          type: 'string',
          readOnly: true
        },
        adminUserEnabled: {
          description: 'The value that indicates whether the admin user is enabled. This value is false by default.',
          default: false,
          type: 'boolean'
        },
        storageAccount: {
          description: 'The properties of the storage account for the container registry. If specified, the storage account must be in the same physical location as the container registry.',
          required: [ 'name', 'accessKey' ],
          properties: {
            name: {
              description: 'The name of the storage account.',
              type: 'string'
            },
            accessKey: {
              description: 'The access key to the storage account.',
              type: 'string'
            }
          }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2016-06-27-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2016-06-27-preview/containerregistry.json).
