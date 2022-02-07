---
id: ImportPipeline
title: ImportPipeline
---
Provides a **ImportPipeline** from the **ContainerRegistry** group
## Examples
### ImportPipelineCreate
```js
provider.ContainerRegistry.makeImportPipeline({
  name: "myImportPipeline",
  properties: () => ({
    location: "westus",
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity2":
          {},
      },
    },
    properties: {
      source: {
        type: "AzureStorageBlobContainer",
        uri: "https://accountname.blob.core.windows.net/containername",
        keyVaultUri: "https://myvault.vault.azure.net/secrets/acrimportsas",
      },
      options: [
        "OverwriteTags",
        "DeleteSourceBlobOnSuccess",
        "ContinueOnErrors",
      ],
    },
  }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    managedIdentities: ["myUserAssignedIdentity"],
    registry: "myRegistry",
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [Registry](../ContainerRegistry/Registry.md)
## Swagger Schema
```js
{
  description: 'An object that represents an import pipeline for a container registry.',
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
      description: 'The location of the import pipeline.',
      type: 'string'
    },
    identity: {
      description: 'The identity of the import pipeline.',
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
      description: 'The properties of the import pipeline.',
      'x-ms-client-flatten': true,
      required: [ 'source' ],
      type: 'object',
      properties: {
        source: {
          description: 'The source properties of the import pipeline.',
          required: [ 'keyVaultUri' ],
          type: 'object',
          properties: {
            type: {
              description: 'The type of source for the import pipeline.',
              default: 'AzureStorageBlobContainer',
              enum: [ 'AzureStorageBlobContainer' ],
              type: 'string',
              'x-ms-enum': { name: 'PipelineSourceType', modelAsString: true }
            },
            uri: {
              description: 'The source uri of the import pipeline.\r\n' +
                `When 'AzureStorageBlob': "https://accountName.blob.core.windows.net/containerName/blobName"\r\n` +
                `When 'AzureStorageBlobContainer': "https://accountName.blob.core.windows.net/containerName"`,
              type: 'string'
            },
            keyVaultUri: {
              description: 'They key vault secret uri to obtain the source storage SAS token.',
              type: 'string'
            }
          }
        },
        trigger: {
          description: 'The properties that describe the trigger of the import pipeline.',
          type: 'object',
          properties: {
            sourceTrigger: {
              description: 'The source trigger properties of the pipeline.',
              required: [ 'status' ],
              type: 'object',
              properties: {
                status: {
                  description: 'The current status of the source trigger.',
                  default: 'Enabled',
                  enum: [ 'Enabled', 'Disabled' ],
                  type: 'string',
                  'x-ms-enum': { name: 'TriggerStatus', modelAsString: true }
                }
              }
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
The resource version is `2021-12-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2021-12-01-preview/containerregistry.json).
