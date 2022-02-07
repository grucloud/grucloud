---
id: VirtualRouter
title: VirtualRouter
---
Provides a **VirtualRouter** from the **Network** group
## Examples
### Create VirtualRouter
```js
provider.Network.makeVirtualRouter({
  name: "myVirtualRouter",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    properties: {
      hostedGateway: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vnetGateway",
      },
    },
  }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    subnet: "mySubnet",
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the Virtual Router.',
      properties: {
        virtualRouterAsn: {
          type: 'integer',
          readOnly: false,
          format: 'int64',
          minimum: 0,
          maximum: 4294967295,
          description: 'VirtualRouter ASN.'
        },
        virtualRouterIps: {
          type: 'array',
          readOnly: false,
          description: 'VirtualRouter IPs.',
          items: { type: 'string' }
        },
        hostedSubnet: {
          readOnly: false,
          description: 'The Subnet on which VirtualRouter is hosted.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        hostedGateway: {
          readOnly: false,
          description: 'The Gateway on which VirtualRouter is hosted.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        peerings: {
          type: 'array',
          readOnly: true,
          description: 'List of references to VirtualRouterPeerings.',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          }
        },
        provisioningState: {
          description: 'The provisioning state of the resource.',
          readOnly: true,
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    }
  },
  allOf: [
    {
      properties: {
        id: { type: 'string', description: 'Resource ID.' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type.'
        },
        location: { type: 'string', description: 'Resource location.' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags.'
        }
      },
      description: 'Common resource representation.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'VirtualRouter Resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualRouter.json).
