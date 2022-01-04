---
id: Task
title: Task
---
Provides a **Task** from the **ContainerRegistry** group
## Examples
### Tasks_Create
```js
provider.ContainerRegistry.makeTask({
  name: "myTask",
  properties: () => ({
    properties: {
      status: "Enabled",
      platform: { os: "Linux", architecture: "amd64" },
      agentConfiguration: { cpu: 2 },
      step: {
        type: "Docker",
        imageNames: ["azurerest:testtag"],
        dockerFilePath: "src/DockerFile",
        contextPath: "src",
        isPushEnabled: true,
        noCache: false,
        arguments: [
          { name: "mytestargument", value: "mytestvalue", isSecret: false },
          {
            name: "mysecrettestargument",
            value: "mysecrettestvalue",
            isSecret: true,
          },
        ],
      },
      trigger: {
        timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],
        sourceTriggers: [
          {
            name: "mySourceTrigger",
            sourceRepository: {
              sourceControlType: "Github",
              repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",
              branch: "master",
              sourceControlAuthProperties: { tokenType: "PAT", token: "xxxxx" },
            },
            sourceTriggerEvents: ["commit"],
          },
        ],
        baseImageTrigger: {
          name: "myBaseImageTrigger",
          baseImageTriggerType: "Runtime",
          updateTriggerEndpoint:
            "https://user:pass@mycicd.webhook.com?token=foo",
          updateTriggerPayloadType: "Token",
        },
      },
      isSystemTask: false,
      logTemplate: "acr/tasks:{{.Run.OS}}",
    },
    location: "eastus",
    identity: { type: "SystemAssigned" },
    tags: { testkey: "value" },
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

### Tasks_Create_WithSystemAndUserIdentities
```js
provider.ContainerRegistry.makeTask({
  name: "myTask",
  properties: () => ({
    properties: {
      status: "Enabled",
      platform: { os: "Linux", architecture: "amd64" },
      agentConfiguration: { cpu: 2 },
      step: {
        type: "Docker",
        imageNames: ["azurerest:testtag"],
        dockerFilePath: "src/DockerFile",
        contextPath: "src",
        isPushEnabled: true,
        noCache: false,
        arguments: [
          { name: "mytestargument", value: "mytestvalue", isSecret: false },
          {
            name: "mysecrettestargument",
            value: "mysecrettestvalue",
            isSecret: true,
          },
        ],
      },
      trigger: {
        timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],
        sourceTriggers: [
          {
            name: "mySourceTrigger",
            sourceRepository: {
              sourceControlType: "Github",
              repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",
              branch: "master",
              sourceControlAuthProperties: { tokenType: "PAT", token: "xxxxx" },
            },
            sourceTriggerEvents: ["commit"],
          },
        ],
        baseImageTrigger: {
          name: "myBaseImageTrigger",
          baseImageTriggerType: "Runtime",
          updateTriggerEndpoint:
            "https://user:pass@mycicd.webhook.com?token=foo",
          updateTriggerPayloadType: "Default",
        },
      },
      isSystemTask: false,
      logTemplate: null,
    },
    location: "eastus",
    identity: {
      type: "SystemAssigned, UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity2":
          {},
      },
    },
    tags: { testkey: "value" },
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

### Tasks_Create_WithUserIdentities_WithSystemIdentity
```js
provider.ContainerRegistry.makeTask({
  name: "myTask",
  properties: () => ({
    properties: {
      status: "Enabled",
      platform: { os: "Linux", architecture: "amd64" },
      agentConfiguration: { cpu: 2 },
      step: {
        type: "Docker",
        imageNames: ["azurerest:testtag"],
        dockerFilePath: "src/DockerFile",
        contextPath: "src",
        isPushEnabled: true,
        noCache: false,
        arguments: [
          { name: "mytestargument", value: "mytestvalue", isSecret: false },
          {
            name: "mysecrettestargument",
            value: "mysecrettestvalue",
            isSecret: true,
          },
        ],
      },
      trigger: {
        timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],
        sourceTriggers: [
          {
            name: "mySourceTrigger",
            sourceRepository: {
              sourceControlType: "Github",
              repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",
              branch: "master",
              sourceControlAuthProperties: { tokenType: "PAT", token: "xxxxx" },
            },
            sourceTriggerEvents: ["commit"],
          },
        ],
        baseImageTrigger: {
          name: "myBaseImageTrigger",
          baseImageTriggerType: "Runtime",
        },
      },
      isSystemTask: false,
      logTemplate: null,
    },
    location: "eastus",
    identity: { type: "SystemAssigned" },
    tags: { testkey: "value" },
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

### Tasks_Create_WithUserIdentities
```js
provider.ContainerRegistry.makeTask({
  name: "myTask",
  properties: () => ({
    properties: {
      status: "Enabled",
      platform: { os: "Linux", architecture: "amd64" },
      agentConfiguration: { cpu: 2 },
      step: {
        type: "Docker",
        imageNames: ["azurerest:testtag"],
        dockerFilePath: "src/DockerFile",
        contextPath: "src",
        isPushEnabled: true,
        noCache: false,
        arguments: [
          { name: "mytestargument", value: "mytestvalue", isSecret: false },
          {
            name: "mysecrettestargument",
            value: "mysecrettestvalue",
            isSecret: true,
          },
        ],
      },
      trigger: {
        timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],
        sourceTriggers: [
          {
            name: "mySourceTrigger",
            sourceRepository: {
              sourceControlType: "Github",
              repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",
              branch: "master",
              sourceControlAuthProperties: { tokenType: "PAT", token: "xxxxx" },
            },
            sourceTriggerEvents: ["commit"],
          },
        ],
        baseImageTrigger: {
          name: "myBaseImageTrigger",
          baseImageTriggerType: "Runtime",
          updateTriggerEndpoint:
            "https://user:pass@mycicd.webhook.com?token=foo",
          updateTriggerPayloadType: "Default",
        },
      },
      isSystemTask: false,
      logTemplate: null,
    },
    location: "eastus",
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity1":
          {},
        "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity2":
          {},
      },
    },
    tags: { testkey: "value" },
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

### Tasks_Create_QuickTask
```js
provider.ContainerRegistry.makeTask({
  name: "myTask",
  properties: () => ({
    properties: {
      status: "Enabled",
      isSystemTask: true,
      logTemplate: "acr/tasks:{{.Run.OS}}",
    },
    location: "eastus",
    identity: null,
    tags: { testkey: "value" },
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
  description: 'The task that has the ARM resource and task properties. \r\n' +
    'The task will have all information to schedule a run against it.',
  type: 'object',
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
          type: 'string',
          'x-ms-mutability': [ 'read', 'create' ]
        },
        tags: {
          description: 'The tags of the resource.',
          type: 'object',
          additionalProperties: { type: 'string' }
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
      description: 'The properties of a task.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        provisioningState: {
          description: 'The provisioning state of the task.',
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
        creationDate: {
          format: 'date-time',
          description: 'The creation date of task.',
          type: 'string',
          readOnly: true
        },
        status: {
          description: 'The current status of task.',
          enum: [ 'Disabled', 'Enabled' ],
          type: 'string',
          'x-ms-enum': { name: 'TaskStatus', modelAsString: true }
        },
        platform: {
          description: 'The platform properties against which the run has to happen.',
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
        agentPoolName: {
          description: 'The dedicated agent pool for the task.',
          type: 'string'
        },
        timeout: {
          format: 'int32',
          description: 'Run timeout in seconds.',
          default: 3600,
          maximum: 28800,
          minimum: 300,
          type: 'integer'
        },
        step: {
          description: 'The properties of a task step.',
          required: [ 'type' ],
          type: 'object',
          properties: {
            type: {
              description: 'The type of the step.',
              enum: [ 'Docker', 'FileTask', 'EncodedTask' ],
              type: 'string',
              'x-ms-enum': { name: 'StepType', modelAsString: true }
            },
            baseImageDependencies: {
              description: 'List of base image dependencies for a step.',
              type: 'array',
              items: {
                description: 'Properties that describe a base image dependency.',
                type: 'object',
                properties: {
                  type: {
                    description: 'The type of the base image dependency.',
                    enum: [ 'BuildTime', 'RunTime' ],
                    type: 'string',
                    'x-ms-enum': {
                      name: 'BaseImageDependencyType',
                      modelAsString: true
                    }
                  },
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
              },
              readOnly: true
            },
            contextPath: {
              description: 'The URL(absolute or relative) of the source context for the task step.',
              type: 'string'
            },
            contextAccessToken: {
              description: 'The token (git PAT or SAS token of storage account blob) associated with the context for a step.',
              type: 'string'
            }
          },
          discriminator: 'type'
        },
        trigger: {
          description: 'The properties that describe all triggers for the task.',
          type: 'object',
          properties: {
            timerTriggers: {
              description: 'The collection of timer triggers.',
              type: 'array',
              items: {
                description: 'The properties of a timer trigger.',
                required: [ 'schedule', 'name' ],
                type: 'object',
                properties: {
                  schedule: {
                    description: 'The CRON expression for the task schedule',
                    type: 'string'
                  },
                  status: {
                    description: 'The current status of trigger.',
                    default: 'Enabled',
                    enum: [ 'Disabled', 'Enabled' ],
                    type: 'string',
                    'x-ms-enum': { name: 'TriggerStatus', modelAsString: true }
                  },
                  name: {
                    description: 'The name of the trigger.',
                    type: 'string'
                  }
                }
              }
            },
            sourceTriggers: {
              description: 'The collection of triggers based on source code repository.',
              type: 'array',
              items: {
                description: 'The properties of a source based trigger.',
                required: [ 'sourceRepository', 'sourceTriggerEvents', 'name' ],
                type: 'object',
                properties: {
                  sourceRepository: {
                    description: 'The properties that describes the source(code) for the task.',
                    required: [ 'sourceControlType', 'repositoryUrl' ],
                    type: 'object',
                    properties: {
                      sourceControlType: [Object],
                      repositoryUrl: [Object],
                      branch: [Object],
                      sourceControlAuthProperties: [Object]
                    }
                  },
                  sourceTriggerEvents: {
                    description: 'The source event corresponding to the trigger.',
                    type: 'array',
                    items: {
                      enum: [Array],
                      type: 'string',
                      'x-ms-enum': [Object]
                    }
                  },
                  status: {
                    description: 'The current status of trigger.',
                    default: 'Enabled',
                    enum: [ 'Disabled', 'Enabled' ],
                    type: 'string',
                    'x-ms-enum': { name: 'TriggerStatus', modelAsString: true }
                  },
                  name: {
                    description: 'The name of the trigger.',
                    type: 'string'
                  }
                }
              }
            },
            baseImageTrigger: {
              description: 'The trigger based on base image dependencies.',
              required: [ 'baseImageTriggerType', 'name' ],
              type: 'object',
              properties: {
                baseImageTriggerType: {
                  description: 'The type of the auto trigger for base image dependency updates.',
                  enum: [ 'All', 'Runtime' ],
                  type: 'string',
                  'x-ms-enum': { name: 'BaseImageTriggerType', modelAsString: true }
                },
                updateTriggerEndpoint: {
                  description: 'The endpoint URL for receiving update triggers.',
                  type: 'string'
                },
                updateTriggerPayloadType: {
                  description: 'Type of Payload body for Base image update triggers.',
                  enum: [ 'Default', 'Token' ],
                  type: 'string',
                  'x-ms-enum': {
                    name: 'UpdateTriggerPayloadType',
                    modelAsString: true
                  }
                },
                status: {
                  description: 'The current status of trigger.',
                  default: 'Enabled',
                  enum: [ 'Disabled', 'Enabled' ],
                  type: 'string',
                  'x-ms-enum': { name: 'TriggerStatus', modelAsString: true }
                },
                name: {
                  description: 'The name of the trigger.',
                  type: 'string'
                }
              }
            }
          }
        },
        credentials: {
          description: 'The properties that describes a set of credentials that will be used when this run is invoked.',
          type: 'object',
          properties: {
            sourceRegistry: {
              description: 'Describes the credential parameters for accessing the source registry.',
              type: 'object',
              properties: {
                loginMode: {
                  description: 'The authentication mode which determines the source registry login scope. The credentials for the source registry\r\n' +
                    'will be generated using the given scope. These credentials will be used to login to\r\n' +
                    'the source registry during the run.',
                  enum: [ 'None', 'Default' ],
                  type: 'string',
                  'x-ms-enum': {
                    name: 'SourceRegistryLoginMode',
                    modelAsString: true
                  }
                }
              }
            },
            customRegistries: {
              description: 'Describes the credential parameters for accessing other custom registries. The key\r\n' +
                'for the dictionary item will be the registry login server (myregistry.azurecr.io) and\r\n' +
                'the value of the item will be the registry credentials for accessing the registry.',
              type: 'object',
              additionalProperties: {
                description: 'Describes the credentials that will be used to access a custom registry during a run.',
                type: 'object',
                properties: {
                  userName: {
                    description: 'The username for logging into the custom registry.',
                    type: 'object',
                    properties: { value: [Object], type: [Object] }
                  },
                  password: {
                    description: 'The password for logging into the custom registry. The password is a secret \r\n' +
                      'object that allows multiple ways of providing the value for it.',
                    type: 'object',
                    properties: { value: [Object], type: [Object] }
                  },
                  identity: {
                    description: 'Indicates the managed identity assigned to the custom credential. If a user-assigned identity\r\n' +
                      'this value is the Client ID. If a system-assigned identity, the value will be `system`. In\r\n' +
                      'the case of a system-assigned identity, the Client ID will be determined by the runner. This\r\n' +
                      'identity may be used to authenticate to key vault to retrieve credentials or it may be the only \r\n' +
                      'source of authentication used for accessing the registry.',
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        logTemplate: {
          description: 'The template that describes the repository and tag information for run log artifact.',
          type: 'string'
        },
        isSystemTask: {
          description: 'The value of this property indicates whether the task resource is system task or not.',
          default: false,
          type: 'boolean'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2019-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2019-06-01-preview/containerregistry_build.json).
