---
id: ContainerAppsSourceControl
title: ContainerAppsSourceControl
---
Provides a **ContainerAppsSourceControl** from the **App** group
## Examples
### Create or Update Container App SourceControl
```js
exports.createResources = () => [
  {
    type: "ContainerAppsSourceControl",
    group: "App",
    name: "myContainerAppsSourceControl",
    properties: () => ({
      properties: {
        repoUrl: "https://github.com/xwang971/ghatest",
        branch: "master",
        githubActionConfiguration: {
          registryInfo: {
            registryUrl: "xwang971reg.azurecr.io",
            registryUserName: "xwang971reg",
            registryPassword: "<registrypassword>",
          },
          azureCredentials: {
            clientId: "<clientid>",
            clientSecret: "<clientsecret>",
            tenantId: "<tenantid>",
          },
          contextPath: "./",
          image: "image/tag",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      containerApp: "myContainerApp",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ContainerApp](../App/ContainerApp.md)
## Swagger Schema
```js
{
  description: 'Container App SourceControl.',
  type: 'object',
  allOf: [
    {
      title: 'Proxy Resource',
      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',
      type: 'object',
      allOf: [
        {
          title: 'Resource',
          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',
          type: 'object',
          properties: {
            id: {
              readOnly: true,
              type: 'string',
              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'
            },
            name: {
              readOnly: true,
              type: 'string',
              description: 'The name of the resource'
            },
            type: {
              readOnly: true,
              type: 'string',
              description: 'The type of the resource. E.g. "Microsoft.Compute/virtualMachines" or "Microsoft.Storage/storageAccounts"'
            },
            systemData: {
              readOnly: true,
              type: 'object',
              description: 'Azure Resource Manager metadata containing createdBy and modifiedBy information.',
              properties: {
                createdBy: {
                  type: 'string',
                  description: 'The identity that created the resource.'
                },
                createdByType: {
                  type: 'string',
                  description: 'The type of identity that created the resource.',
                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
                  'x-ms-enum': { name: 'createdByType', modelAsString: true }
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp of resource creation (UTC).'
                },
                lastModifiedBy: {
                  type: 'string',
                  description: 'The identity that last modified the resource.'
                },
                lastModifiedByType: {
                  type: 'string',
                  description: 'The type of identity that last modified the resource.',
                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
                  'x-ms-enum': { name: 'createdByType', modelAsString: true }
                },
                lastModifiedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp of resource last modification (UTC)'
                }
              }
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  properties: {
    properties: {
      description: 'SourceControl resource specific properties',
      type: 'object',
      properties: {
        operationState: {
          description: 'Current provisioning State of the operation',
          enum: [ 'InProgress', 'Succeeded', 'Failed', 'Canceled' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'SourceControlOperationState', modelAsString: true }
        },
        repoUrl: {
          description: 'The repo url which will be integrated to ContainerApp.',
          type: 'string'
        },
        branch: {
          description: 'The branch which will trigger the auto deployment',
          type: 'string'
        },
        githubActionConfiguration: {
          description: 'Container App Revision Template with all possible settings and the\n' +
            'defaults if user did not provide them. The defaults are populated\n' +
            'as they were at the creation time',
          type: 'object',
          properties: {
            registryInfo: {
              description: 'Registry configurations.',
              type: 'object',
              properties: {
                registryUrl: { description: 'registry server Url.', type: 'string' },
                registryUserName: { description: 'registry username.', type: 'string' },
                registryPassword: {
                  description: 'registry secret.',
                  type: 'string',
                  'x-ms-mutability': [ 'create', 'update' ],
                  'x-ms-secret': true
                }
              }
            },
            azureCredentials: {
              description: 'AzureCredentials configurations.',
              type: 'object',
              properties: {
                clientId: {
                  description: 'Client Id.',
                  type: 'string',
                  'x-ms-mutability': [ 'create', 'update' ],
                  'x-ms-secret': true
                },
                clientSecret: {
                  description: 'Client Secret.',
                  type: 'string',
                  'x-ms-mutability': [ 'create', 'update' ],
                  'x-ms-secret': true
                },
                tenantId: {
                  description: 'Tenant Id.',
                  type: 'string',
                  'x-ms-mutability': [ 'create', 'update' ],
                  'x-ms-secret': true
                },
                subscriptionId: { description: 'Subscription Id.', type: 'string' }
              }
            },
            contextPath: { description: 'Context path', type: 'string' },
            image: { description: 'Image name', type: 'string' },
            publishType: { description: 'Code or Image', type: 'string' },
            os: { description: 'Operation system', type: 'string' },
            runtimeStack: { description: 'Runtime stack', type: 'string' },
            runtimeVersion: { description: 'Runtime version', type: 'string' }
          }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/app/resource-manager/Microsoft.App/stable/2022-03-01/SourceControls.json).
