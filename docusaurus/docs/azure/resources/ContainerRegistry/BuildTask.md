---
id: BuildTask
title: BuildTask
---
Provides a **BuildTask** from the **ContainerRegistry** group
## Examples
### BuildTasks_Create
```js
provider.ContainerRegistry.makeBuildTask({
  name: "myBuildTask",
  properties: () => ({
    properties: {
      sourceRepository: {
        sourceControlType: "Github",
        repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",
        sourceControlAuthProperties: {
          tokenType: "OAuth",
          token: "xxxxxx",
          scope: "repo",
        },
        isCommitTriggerEnabled: true,
      },
      platform: { osType: "Linux", cpu: 2 },
      alias: "myalias",
      status: "Enabled",
    },
    location: "eastus",
    tags: { testkey: "value" },
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
  description: 'The build task that has the resource properties and all build items. The build task will have all information to schedule a build against it.',
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
          additionalProperties: { type: 'string' },
          'x-ms-mutability': [ 'read', 'create', 'update' ]
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'The properties of a build task.',
      'x-ms-client-flatten': true,
      required: [ 'alias', 'sourceRepository', 'platform' ],
      type: 'object',
      properties: {
        provisioningState: {
          description: 'The provisioning state of the build task.',
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
          description: 'The creation date of build task.',
          type: 'string',
          readOnly: true
        },
        alias: {
          description: 'The alternative updatable name for a build task.',
          type: 'string'
        },
        status: {
          description: 'The current status of build task.',
          enum: [ 'Disabled', 'Enabled' ],
          type: 'string',
          'x-ms-enum': { name: 'BuildTaskStatus', modelAsString: true }
        },
        sourceRepository: {
          description: 'The properties that describes the source(code) for the build task.',
          required: [ 'sourceControlType', 'repositoryUrl' ],
          type: 'object',
          properties: {
            sourceControlType: {
              description: 'The type of source control service.',
              enum: [ 'Github', 'VisualStudioTeamService' ],
              type: 'string',
              'x-ms-enum': { name: 'SourceControlType', modelAsString: true }
            },
            repositoryUrl: {
              description: 'The full URL to the source code repository',
              type: 'string'
            },
            isCommitTriggerEnabled: {
              description: 'The value of this property indicates whether the source control commit trigger is enabled or not.',
              default: false,
              type: 'boolean'
            },
            sourceControlAuthProperties: {
              description: 'The authorization properties for accessing the source code repository.',
              required: [ 'token' ],
              type: 'object',
              properties: {
                tokenType: {
                  description: 'The type of Auth token.',
                  enum: [ 'PAT', 'OAuth' ],
                  type: 'string',
                  'x-ms-enum': { name: 'TokenType', modelAsString: true }
                },
                token: {
                  description: 'The access token used to access the source control provider.',
                  type: 'string'
                },
                refreshToken: {
                  description: 'The refresh token used to refresh the access token.',
                  type: 'string'
                },
                scope: {
                  description: 'The scope of the access token.',
                  type: 'string'
                },
                expiresIn: {
                  format: 'int32',
                  description: 'Time in seconds that the token remains valid',
                  type: 'integer'
                }
              }
            }
          }
        },
        platform: {
          description: 'The platform properties against which the build has to happen.',
          required: [ 'osType' ],
          type: 'object',
          properties: {
            osType: {
              description: 'The operating system type required for the build.',
              enum: [ 'Windows', 'Linux' ],
              type: 'string',
              'x-ms-enum': { name: 'OsType', modelAsString: true }
            },
            cpu: {
              format: 'int32',
              description: 'The CPU configuration in terms of number of cores required for the build.',
              type: 'integer'
            }
          }
        },
        timeout: {
          format: 'int32',
          description: 'Build timeout in seconds.',
          default: 3600,
          maximum: 28800,
          minimum: 300,
          type: 'integer'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2018-02-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2018-02-01-preview/containerregistry_build.json).
