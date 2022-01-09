---
id: TaskRun
title: TaskRun
---
Provides a **TaskRun** from the **ContainerRegistry** group
## Examples
### TaskRuns_Create
```js
provider.ContainerRegistry.makeTaskRun({
  name: "myTaskRun",
  properties: () => ({
    properties: {
      forceUpdateTag: "test",
      runRequest: {
        type: "EncodedTaskRunRequest",
        encodedTaskContent:
          "c3RlcHM6IAogIC0gY21kOiB7eyAuVmFsdWVzLmNvbW1hbmQgfX0K",
        encodedValuesContent:
          "Y29tbWFuZDogYmFzaCBlY2hvIHt7LlJ1bi5SZWdpc3RyeX19Cg==",
        values: [],
        platform: { os: "Linux", architecture: "amd64" },
        credentials: {},
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
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
  description: 'The task run that has the ARM resource and properties. \r\n' +
    'The task run will have the information of request and result of a run.',
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
    identity: {
      description: 'Identity for the resource.',
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
      description: 'The properties associated with the task run, i.e., request and result of the run',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        provisioningState: {
          description: 'The provisioning state of this task run',
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
        runRequest: {
          description: 'The request parameters for scheduling a run.',
          required: [ 'type' ],
          type: 'object',
          properties: {
            type: {
              description: 'The type of the run request.',
              type: 'string'
            },
            isArchiveEnabled: {
              description: 'The value that indicates whether archiving is enabled for the run or not.',
              default: false,
              type: 'boolean'
            },
            agentPoolName: {
              description: 'The dedicated agent pool for the run.',
              type: 'string'
            },
            logTemplate: {
              description: 'The template that describes the repository and tag information for run log artifact.',
              type: 'string'
            }
          },
          discriminator: 'type'
        },
        runResult: {
          description: 'Run resource properties',
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
                      enum: [
                        'User',
                        'Application',
                        'ManagedIdentity',
                        'Key'
                      ],
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
                      enum: [
                        'User',
                        'Application',
                        'ManagedIdentity',
                        'Key'
                      ],
                      type: 'string',
                      'x-ms-enum': {
                        name: 'lastModifiedByType',
                        modelAsString: true
                      }
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
              description: 'The properties of a run.',
              'x-ms-client-flatten': true,
              type: 'object',
              properties: {
                runId: {
                  description: 'The unique identifier for the run.',
                  type: 'string'
                },
                status: {
                  description: 'The current status of the run.',
                  enum: [
                    'Queued',  'Started',
                    'Running', 'Succeeded',
                    'Failed',  'Canceled',
                    'Error',   'Timeout'
                  ],
                  type: 'string',
                  'x-ms-enum': { name: 'RunStatus', modelAsString: true }
                },
                lastUpdatedTime: {
                  format: 'date-time',
                  description: 'The last updated time for the run.',
                  type: 'string'
                },
                runType: {
                  description: 'The type of run.',
                  enum: [ 'QuickBuild', 'QuickRun', 'AutoBuild', 'AutoRun' ],
                  type: 'string',
                  'x-ms-enum': { name: 'RunType', modelAsString: true }
                },
                agentPoolName: {
                  description: 'The dedicated agent pool for the run.',
                  type: 'string'
                },
                createTime: {
                  format: 'date-time',
                  description: 'The time the run was scheduled.',
                  type: 'string'
                },
                startTime: {
                  format: 'date-time',
                  description: 'The time the run started.',
                  type: 'string'
                },
                finishTime: {
                  format: 'date-time',
                  description: 'The time the run finished.',
                  type: 'string'
                },
                outputImages: {
                  description: 'The list of all images that were generated from the run. This is applicable if the run generates base image dependencies.',
                  type: 'array',
                  items: {
                    description: 'Properties for a registry image.',
                    type: 'object',
                    properties: {
                      registry: {
                        description: 'The registry login server.',
                        type: 'string'
                      },
                      repository: {
                        description: 'The repository name.',
                        type: 'string'
                      },
                      tag: { description: 'The tag name.', type: 'string' },
                      digest: {
                        description: 'The sha256-based digest of the image manifest.',
                        type: 'string'
                      }
                    }
                  }
                },
                task: {
                  description: 'The task against which run was scheduled.',
                  type: 'string'
                },
                imageUpdateTrigger: {
                  description: 'The image update trigger that caused the run. This is applicable if the task has base image trigger configured.',
                  type: 'object',
                  properties: {
                    id: {
                      description: 'The unique ID of the trigger.',
                      type: 'string'
                    },
                    timestamp: {
                      format: 'date-time',
                      description: 'The timestamp when the image update happened.',
                      type: 'string'
                    },
                    images: {
                      description: 'The list of image updates that caused the build.',
                      type: 'array',
                      items: {
                        description: 'Properties for a registry image.',
                        type: 'object',
                        properties: {
                          registry: {
                            description: 'The registry login server.',
                            type: 'string'
                          },
                          repository: {
                            description: 'The repository name.',
                            type: 'string'
                          },
                          tag: {
                            description: 'The tag name.',
                            type: 'string'
                          },
                          digest: {
                            description: 'The sha256-based digest of the image manifest.',
                            type: 'string'
                          }
                        }
                      }
                    }
                  }
                },
                sourceTrigger: {
                  description: 'The source trigger that caused the run.',
                  type: 'object',
                  properties: {
                    id: {
                      description: 'The unique ID of the trigger.',
                      type: 'string'
                    },
                    eventType: {
                      description: 'The event type of the trigger.',
                      type: 'string'
                    },
                    commitId: {
                      description: 'The unique ID that identifies a commit.',
                      type: 'string'
                    },
                    pullRequestId: {
                      description: 'The unique ID that identifies pull request.',
                      type: 'string'
                    },
                    repositoryUrl: {
                      description: 'The repository URL.',
                      type: 'string'
                    },
                    branchName: {
                      description: 'The branch name in the repository.',
                      type: 'string'
                    },
                    providerType: {
                      description: 'The source control provider type.',
                      type: 'string'
                    }
                  }
                },
                timerTrigger: {
                  description: 'The timer trigger that caused the run.',
                  type: 'object',
                  properties: {
                    timerTriggerName: {
                      description: 'The timer trigger name that caused the run.',
                      type: 'string'
                    },
                    scheduleOccurrence: {
                      description: 'The occurrence that triggered the run.',
                      type: 'string'
                    }
                  }
                },
                platform: {
                  description: 'The platform properties against which the run will happen.',
                  required: [ 'os' ],
                  type: 'object',
                  properties: {
                    os: {
                      description: 'The operating system type required for the run.',
                      enum: [ 'Windows', 'Linux' ],
                      type: 'string',
                      'x-ms-enum': { name: 'OS', modelAsString: true }
                    },
                    architecture: {
                      description: 'The OS architecture.',
                      enum: [ 'amd64', 'x86', '386', 'arm', 'arm64' ],
                      type: 'string',
                      'x-ms-enum': { name: 'Architecture', modelAsString: true }
                    },
                    variant: {
                      description: 'Variant of the CPU.',
                      enum: [ 'v6', 'v7', 'v8' ],
                      type: 'string',
                      'x-ms-enum': { name: 'Variant', modelAsString: true }
                    }
                  }
                },
                agentConfiguration: {
                  description: 'The machine configuration of the run agent.',
                  type: 'object',
                  properties: {
                    cpu: {
                      format: 'int32',
                      description: 'The CPU configuration in terms of number of cores required for the run.',
                      type: 'integer'
                    }
                  }
                },
                sourceRegistryAuth: {
                  description: 'The scope of the credentials that were used to login to the source registry during this run.',
                  type: 'string'
                },
                customRegistries: {
                  description: 'The list of custom registries that were logged in during this run.',
                  type: 'array',
                  items: { type: 'string' }
                },
                runErrorMessage: {
                  description: 'The error message received from backend systems after the run is scheduled.',
                  type: 'string',
                  readOnly: true
                },
                updateTriggerToken: {
                  description: 'The update trigger token passed for the Run.',
                  type: 'string'
                },
                logArtifact: {
                  description: 'Properties for a registry image.',
                  type: 'object',
                  properties: {
                    registry: {
                      description: 'The registry login server.',
                      type: 'string'
                    },
                    repository: {
                      description: 'The repository name.',
                      type: 'string'
                    },
                    tag: { description: 'The tag name.', type: 'string' },
                    digest: {
                      description: 'The sha256-based digest of the image manifest.',
                      type: 'string'
                    }
                  },
                  readOnly: true
                },
                provisioningState: {
                  description: 'The provisioning state of a run.',
                  enum: [
                    'Creating',
                    'Updating',
                    'Deleting',
                    'Succeeded',
                    'Failed',
                    'Canceled'
                  ],
                  type: 'string',
                  'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                },
                isArchiveEnabled: {
                  description: 'The value that indicates whether archiving is enabled or not.',
                  default: false,
                  type: 'boolean'
                }
              }
            }
          },
          readOnly: true
        },
        forceUpdateTag: {
          description: 'How the run should be forced to rerun even if the run request configuration has not changed',
          type: 'string'
        }
      }
    },
    location: { description: 'The location of the resource', type: 'string' }
  }
}
```
## Misc
The resource version is `2019-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2019-06-01-preview/containerregistry_build.json).
