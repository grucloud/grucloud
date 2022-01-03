---
id: PipelineRun
title: PipelineRun
---
Provides a **PipelineRun** from the **ContainerRegistry** group
## Examples
### PipelineRunCreate_Export
```js
provider.ContainerRegistry.makePipelineRun({
  name: "myPipelineRun",
  properties: () => ({
    properties: {
      request: {
        pipelineResourceId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/exportPipelines/myExportPipeline",
        target: { type: "AzureStorageBlob", name: "myblob.tar.gz" },
        artifacts: [
          "sourceRepository/hello-world",
          "sourceRepository2@sha256:00000000000000000000000000000000000",
        ],
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```

### PipelineRunCreate_Import
```js
provider.ContainerRegistry.makePipelineRun({
  name: "myPipelineRun",
  properties: () => ({
    properties: {
      request: {
        pipelineResourceId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/importPipelines/myImportPipeline",
        source: { type: "AzureStorageBlob", name: "myblob.tar.gz" },
        catalogDigest: "sha256@",
      },
      forceUpdateTag: "2020-03-04T17:23:21.9261521+00:00",
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
  description: 'An object that represents a pipeline run for a container registry.',
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
    properties: {
      description: 'The properties of a pipeline run.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        provisioningState: {
          description: 'The provisioning state of a pipeline run.',
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
        },
        request: {
          description: 'The request parameters for a pipeline run.',
          type: 'object',
          properties: {
            pipelineResourceId: {
              description: 'The resource ID of the pipeline to run.',
              type: 'string'
            },
            artifacts: {
              description: 'List of source artifacts to be transferred by the pipeline. \r\n' +
                "Specify an image by repository ('hello-world'). This will use the 'latest' tag.\r\n" +
                "Specify an image by tag ('hello-world:latest').\r\n" +
                "Specify an image by sha256-based manifest digest ('hello-world@sha256:abc123').",
              type: 'array',
              items: { type: 'string' }
            },
            source: {
              description: 'The source properties of the pipeline run.',
              type: 'object',
              properties: {
                type: {
                  description: 'The type of the source.',
                  default: 'AzureStorageBlob',
                  enum: [ 'AzureStorageBlob' ],
                  type: 'string',
                  'x-ms-enum': {
                    name: 'PipelineRunSourceType',
                    modelAsString: true
                  }
                },
                name: {
                  description: 'The name of the source.',
                  type: 'string'
                }
              }
            },
            target: {
              description: 'The target properties of the pipeline run.',
              type: 'object',
              properties: {
                type: {
                  description: 'The type of the target.',
                  default: 'AzureStorageBlob',
                  enum: [ 'AzureStorageBlob' ],
                  type: 'string',
                  'x-ms-enum': {
                    name: 'PipelineRunTargetType',
                    modelAsString: true
                  }
                },
                name: {
                  description: 'The name of the target.',
                  type: 'string'
                }
              }
            },
            catalogDigest: {
              description: 'The digest of the tar used to transfer the artifacts.',
              type: 'string'
            }
          }
        },
        response: {
          description: 'The response of a pipeline run.',
          readOnly: true,
          type: 'object',
          properties: {
            status: {
              description: 'The current status of the pipeline run.',
              type: 'string'
            },
            importedArtifacts: {
              description: 'The artifacts imported in the pipeline run.',
              type: 'array',
              items: { type: 'string' }
            },
            progress: {
              description: 'The current progress of the copy operation.',
              type: 'object',
              properties: {
                percentage: {
                  description: 'The percentage complete of the copy operation.',
                  type: 'string'
                }
              }
            },
            startTime: {
              format: 'date-time',
              description: 'The time the pipeline run started.',
              type: 'string'
            },
            finishTime: {
              format: 'date-time',
              description: 'The time the pipeline run finished.',
              type: 'string'
            },
            source: {
              description: 'The source of the pipeline run.',
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
            target: {
              description: 'The target of the pipeline run.',
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
            catalogDigest: {
              description: 'The digest of the tar used to transfer the artifacts.',
              type: 'string'
            },
            trigger: {
              description: 'The trigger that caused the pipeline run.',
              type: 'object',
              properties: {
                sourceTrigger: {
                  description: 'The source trigger that caused the pipeline run.',
                  type: 'object',
                  properties: {
                    timestamp: {
                      format: 'date-time',
                      description: 'The timestamp when the source update happened.',
                      type: 'string'
                    }
                  }
                }
              }
            },
            pipelineRunErrorMessage: {
              description: 'The detailed error message for the pipeline run in the case of failure.',
              type: 'string'
            }
          }
        },
        forceUpdateTag: {
          description: 'How the pipeline run should be forced to recreate even if the pipeline run configuration has not changed.',
          type: 'string'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-08-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2021-08-01-preview/containerregistry.json).
