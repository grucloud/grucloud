---
id: VirtualNetworkGatewayConnectionSharedKey
title: VirtualNetworkGatewayConnectionSharedKey
---
Provides a **VirtualNetworkGatewayConnectionSharedKey** from the **Network** group
## Examples
### SetVirtualNetworkGatewayConnectionSharedKey
```js
exports.createResources = () => [
  {
    type: "VirtualNetworkGatewayConnectionSharedKey",
    group: "Network",
    name: "myVirtualNetworkGatewayConnectionSharedKey",
    properties: () => ({ value: "AzureAbc123" }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualNetworkGatewayConnection: "myVirtualNetworkGatewayConnection",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetworkGatewayConnection](../Network/VirtualNetworkGatewayConnection.md)
## Swagger Schema
```js
{
  properties: {
    value: {
      type: 'string',
      description: 'The virtual network connection shared key value.'
    }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  required: [ 'value' ],
  description: 'Response for GetConnectionSharedKey API service call.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualNetworkGateway.json).
