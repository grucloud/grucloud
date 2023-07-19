---
id: VirtualRouterPeering
title: VirtualRouterPeering
---
Provides a **VirtualRouterPeering** from the **Network** group
## Examples
### Create Virtual Router Peering
```js
exports.createResources = () => [
  {
    type: "VirtualRouterPeering",
    group: "Network",
    name: "myVirtualRouterPeering",
    properties: () => ({
      properties: { peerIp: "192.168.1.5", peerAsn: 20000 },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualRouter: "myVirtualRouter",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualRouter](../Network/VirtualRouter.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'The properties of the Virtual Router Peering.',
      properties: {
        peerAsn: {
          type: 'integer',
          readOnly: false,
          format: 'int64',
          minimum: 0,
          maximum: 4294967295,
          description: 'Peer ASN.'
        },
        peerIp: { type: 'string', readOnly: false, description: 'Peer IP.' },
        provisioningState: {
          description: 'The provisioning state of the resource.',
          readOnly: true,
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    name: {
      type: 'string',
      description: 'Name of the virtual router peering that is unique within a virtual router.'
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    type: { type: 'string', readOnly: true, description: 'Peering type.' }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Virtual Router Peering resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualRouter.json).
