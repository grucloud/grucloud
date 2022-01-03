---
id: ExportPipeline
title: ExportPipeline
---
Provides a **ExportPipeline** from the **ContainerRegistry** group
## Examples
### ExportPipelineCreate
```js
provider.ContainerRegistry.makeExportPipeline({
  name: "myExportPipeline",
  properties: () => ({
    location: "westus",
    identity: { type: "SystemAssigned" },
    properties: {
      target: {
        type: "AzureStorageBlobContainer",
        uri: "https://accountname.blob.core.windows.net/containername",
        keyVaultUri: "https://myvault.vault.azure.net/secrets/acrexportsas",
      },
      options: ["OverwriteBlobs"],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Registry](../ContainerRegistry/Registry.md)
## Swagger Schema
```js
{
  description: 'An object that represents an export pipeline for a container registry.',
  type: 'object',
  allOf: [
    {
      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',
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
        systemData: {
          description: 'Metadata pertaining to creation and last modification of the resource.',
          type: 'object',
          readOnly: true,
          properties: {
            createdBy: {
              description: 'The identity that created the resource.',
              type: 'string'
            },
            createdByType: {
              description: 'The type of identity that created the resource.',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              type: 'string',
              'x-ms-enum': { name: 'createdByType', modelAsString: true }
            },
            createdAt: {
              format: 'date-time',
              description: 'The timestamp of resource creation (UTC).',
              type: 'string'
            },
            lastModifiedBy: {
              description: 'The identity that last modified the resource.',
              type: 'string'
            },
            lastModifiedByType: {
              description: 'The type of identity that last modified the resource.',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              type: 'string',
              'x-ms-enum': { name: 'lastModifiedByType', modelAsString: true }
            },
            lastModifiedAt: {
              format: 'date-time',
              description: 'The timestamp of resource modification (UTC).',
              type: 'string'
            }
          }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    location: {
      description: 'The location of the export pipeline.',
      type: 'string'
    },
    identity: {
      description: 'The identity of the export pipeline.',
      type: 'object',
      properties: {
        principalId: {
          description: 'The principal ID of resource identity.',
          type: 'string'
        },
        tenantId: { description: 'The tenant ID of resource.', type: 'string' },
        type: {
          description: 'The identity type.',
          enum: [
            'SystemAssigned',
            'UserAssigned',
            'SystemAssigned, UserAssigned',
            'None'
          ],
          type: 'string',
          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }
        },
        userAssignedIdentities: {
          description: 'The list of user identities associated with the resource. The user identity \r\n' +
            'dictionary key references will be ARM resource ids in the form: \r\n' +
            "'/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/\r\n" +
            "    providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.",
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              principalId: {
                description: 'The principal id of user assigned identity.',
                type: 'string'
              },
              clientId: {
                description: 'The client id of user assigned identity.',
                type: 'string'
              }
            }
          }
        }
      }
    },
    properties: {
      description: 'The properties of the export pipeline.',
      'x-ms-client-flatten': true,
      required: [ 'target' ],
      type: 'object',
      properties: {
        target: {
          description: 'The target properties of the export pipeline.',
          required: [ 'keyVaultUri' ],
          type: 'object',
          properties: {
            type: {
              description: 'The type of target for the export pipeline.',
              type: 'string'
            },
            uri: {
              description: 'The target uri of the export pipeline.\r\n' +
                `When 'AzureStorageBlob': "https://accountName.blob.core.windows.net/containerName/blobName"\r\n` +
                `When 'AzureStorageBlobContainer':  "https://accountName.blob.core.windows.net/containerName"`,
              type: 'string'
            },
            keyVaultUri: {
              description: 'They key vault secret uri to obtain the target storage SAS token.',
              type: 'string'
            }
          }
        },
        options: {
          description: 'The list of all options configured for the pipeline.',
          type: 'array',
          items: {
            enum: [
              'OverwriteTags',
              'OverwriteBlobs',
              'DeleteSourceBlobOnSuccess',
              'ContinueOnErrors'
            ],
            type: 'string',
            'x-ms-enum': { name: 'PipelineOptions', modelAsString: true }
          }
        },
        provisioningState: {
          description: 'The provisioning state of the pipeline at the time the operation was called.',
          enum: [
            'Creating',
            'Updating',
            'Deleting',
            'Succeeded',
            'Failed',
            'Canceled'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-08-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2021-08-01-preview/containerregistry.json).
