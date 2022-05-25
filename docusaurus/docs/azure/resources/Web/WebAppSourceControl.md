---
id: WebAppSourceControl
title: WebAppSourceControl
---
Provides a **WebAppSourceControl** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [WebApp](../Web/WebApp.md)
## Swagger Schema
```js
{
  description: 'Source control configuration for an app.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'SiteSourceControl resource specific properties',
      type: 'object',
      properties: {
        repoUrl: {
          description: 'Repository or source control URL.',
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        branch: {
          description: 'Name of branch to use for deployment.',
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        isManualIntegration: {
          description: '<code>true</code> to limit to manual integration; <code>false</code> to enable continuous integration (which configures webhooks into online repos like GitHub).',
          type: 'boolean',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        isGitHubAction: {
          description: '<code>true</code> if this is deployed via GitHub action.',
          type: 'boolean',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        deploymentRollbackEnabled: {
          description: '<code>true</code> to enable deployment rollback; otherwise, <code>false</code>.',
          type: 'boolean',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        isMercurial: {
          description: '<code>true</code> for a Mercurial repository; <code>false</code> for a Git repository.',
          type: 'boolean',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        gitHubActionConfiguration: {
          description: 'If GitHub Action is selected, than the associated configuration.',
          type: 'object',
          properties: {
            codeConfiguration: {
              description: 'GitHub Action code configuration.',
              type: 'object',
              properties: {
                runtimeStack: {
                  description: 'Runtime stack is used to determine the workflow file content for code base apps.',
                  type: 'string'
                },
                runtimeVersion: {
                  description: 'Runtime version is used to determine what build version to set in the workflow file.',
                  type: 'string'
                }
              }
            },
            containerConfiguration: {
              description: 'GitHub Action container configuration.',
              type: 'object',
              properties: {
                serverUrl: {
                  description: 'The server URL for the container registry where the build will be hosted.',
                  type: 'string'
                },
                imageName: {
                  description: 'The image name for the build.',
                  type: 'string'
                },
                username: {
                  description: 'The username used to upload the image to the container registry.',
                  type: 'string'
                },
                password: {
                  description: 'The password used to upload the image to the container registry.',
                  type: 'string',
                  'x-ms-secret': true
                }
              }
            },
            isLinux: {
              description: 'This will help determine the workflow configuration to select.',
              type: 'boolean'
            },
            generateWorkflowFile: {
              description: 'Workflow option to determine whether the workflow file should be generated and written to the repository.',
              type: 'boolean'
            }
          }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json).
