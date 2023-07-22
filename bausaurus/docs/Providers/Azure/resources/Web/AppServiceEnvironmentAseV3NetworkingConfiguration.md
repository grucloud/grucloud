---
id: AppServiceEnvironmentAseV3NetworkingConfiguration
title: AppServiceEnvironmentAseV3NetworkingConfiguration
---
Provides a **AppServiceEnvironmentAseV3NetworkingConfiguration** from the **Web** group
## Examples
### Update networking configuration of an App Service Environment.
```js
exports.createResources = () => [
  {
    type: "AppServiceEnvironmentAseV3NetworkingConfiguration",
    group: "Web",
    name: "myAppServiceEnvironmentAseV3NetworkingConfiguration",
    properties: () => ({
      properties: { ftpEnabled: true, remoteDebugEnabled: true },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      name: "myAppServiceEnvironment",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [AppServiceEnvironment](../Web/AppServiceEnvironment.md)
## Swagger Schema
```json
{
  description: 'Full view of networking configuration for an ASE.',
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
      description: 'AseV3NetworkingConfiguration resource specific properties',
      type: 'object',
      properties: {
        windowsOutboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },
        linuxOutboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },
        externalInboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },
        internalInboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },
        allowNewPrivateEndpointConnections: {
          description: 'Property to enable and disable new private endpoint connection creation on ASE',
          type: 'boolean'
        },
        ftpEnabled: {
          description: 'Property to enable and disable FTP on ASEV3',
          type: 'boolean'
        },
        remoteDebugEnabled: {
          description: 'Property to enable and disable Remote Debug on ASEV3',
          type: 'boolean'
        },
        inboundIpAddressOverride: {
          description: 'Customer provided Inbound IP Address. Only able to be set on Ase create.',
          type: 'string'
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/AppServiceEnvironments.json).
