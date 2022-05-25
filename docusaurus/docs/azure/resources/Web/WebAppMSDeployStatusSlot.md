---
id: WebAppMSDeployStatusSlot
title: WebAppMSDeployStatusSlot
---
Provides a **WebAppMSDeployStatusSlot** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [WebApp](../Web/WebApp.md)
- [WebAppSlot](../Web/WebAppSlot.md)
## Swagger Schema
```js
{
  description: 'MSDeploy ARM PUT information',
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
      description: 'Core resource properties',
      type: 'object',
      properties: {
        addOnPackages: {
          description: 'List of Add-On packages. Add-On packages implicitly enable the Do Not Delete MSDeploy rule.',
          type: 'array',
          items: {
            description: 'MSDeploy ARM PUT core information',
            type: 'object',
            properties: {
              packageUri: { description: 'Package URI', type: 'string' },
              connectionString: { description: 'SQL Connection String', type: 'string' },
              dbType: { description: 'Database Type', type: 'string' },
              setParametersXmlFileUri: {
                description: 'URI of MSDeploy Parameters file. Must not be set if SetParameters is used.',
                type: 'string'
              },
              setParameters: {
                description: 'MSDeploy Parameters. Must not be set if SetParametersXmlFileUri is used.',
                type: 'object',
                additionalProperties: { type: 'string' }
              },
              skipAppData: {
                description: 'Controls whether the MSDeploy operation skips the App_Data directory.\n' +
                  'If set to <code>true</code>, the existing App_Data directory on the destination\n' +
                  'will not be deleted, and any App_Data directory in the source will be ignored.\n' +
                  'Setting is <code>false</code> by default.',
                type: 'boolean'
              },
              appOffline: {
                description: 'Sets the AppOffline rule while the MSDeploy operation executes.\n' +
                  'Setting is <code>false</code> by default.',
                type: 'boolean'
              }
            }
          },
          'x-ms-identifiers': [ 'packageUri' ]
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
