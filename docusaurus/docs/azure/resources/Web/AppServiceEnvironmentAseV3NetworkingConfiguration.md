---
id: AppServiceEnvironmentAseV3NetworkingConfiguration
title: AppServiceEnvironmentAseV3NetworkingConfiguration
---
Provides a **AppServiceEnvironmentAseV3NetworkingConfiguration** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [AppServiceEnvironment](../Web/AppServiceEnvironment.md)
## Swagger Schema
```js
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
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/AppServiceEnvironments.json).
