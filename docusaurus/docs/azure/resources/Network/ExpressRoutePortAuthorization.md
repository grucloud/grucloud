---
id: ExpressRoutePortAuthorization
title: ExpressRoutePortAuthorization
---
Provides a **ExpressRoutePortAuthorization** from the **Network** group
## Examples
### Create ExpressRoutePort Authorization
```js
exports.createResources = () => [
  {
    type: "ExpressRoutePortAuthorization",
    group: "Network",
    name: "myExpressRoutePortAuthorization",
    properties: () => ({ properties: {} }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      expressRoutePort: "myExpressRoutePortAuthorization",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ExpressRoutePortAuthorization](../Network/ExpressRoutePortAuthorization.md)
## Swagger Schema
```js
{
  type: 'object',
  title: 'ExpressRoute Port Authorization',
  description: 'ExpressRoutePort Authorization resource definition.',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'ExpressRoutePort properties.',
      type: 'object',
      title: 'ExpressRoute Port Authorization Properties',
      properties: {
        authorizationKey: {
          readOnly: true,
          type: 'string',
          description: 'The authorization key.'
        },
        authorizationUseStatus: {
          readOnly: true,
          type: 'string',
          description: 'The authorization use status.',
          enum: [ 'Available', 'InUse' ],
          'x-ms-enum': {
            name: 'ExpressRoutePortAuthorizationUseStatus',
            modelAsString: true
          }
        },
        circuitResourceUri: {
          readOnly: true,
          type: 'string',
          description: 'The reference to the ExpressRoute circuit resource using the authorization.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the authorization resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    name: {
      type: 'string',
      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
    },
    etag: {
      readOnly: true,
      type: 'string',
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    type: {
      readOnly: true,
      type: 'string',
      description: 'Type of the resource.'
    }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ]
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/expressRoutePort.json).
