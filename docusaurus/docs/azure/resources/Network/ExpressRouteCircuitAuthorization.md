---
id: ExpressRouteCircuitAuthorization
title: ExpressRouteCircuitAuthorization
---
Provides a **ExpressRouteCircuitAuthorization** from the **Network** group
## Examples
### Create ExpressRouteCircuit Authorization
```js
exports.createResources = () => [
  {
    type: "ExpressRouteCircuitAuthorization",
    group: "Network",
    name: "myExpressRouteCircuitAuthorization",
    properties: () => ({ properties: {} }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      circuit: "myExpressRouteCircuit",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ExpressRouteCircuit](../Network/ExpressRouteCircuit.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the express route circuit authorization.',
      properties: {
        authorizationKey: { type: 'string', description: 'The authorization key.' },
        authorizationUseStatus: {
          type: 'string',
          description: 'The authorization use status.',
          enum: [ 'Available', 'InUse' ],
          'x-ms-enum': { name: 'AuthorizationUseStatus', modelAsString: true }
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
  ],
  description: 'Authorization in an ExpressRouteCircuit resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/expressRouteCircuit.json).
