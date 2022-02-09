---
id: IpAllocation
title: IpAllocation
---
Provides a **IpAllocation** from the **Network** group
## Examples
### Create IpAllocation
```js
exports.createResources = () => [
  {
    type: "IpAllocation",
    group: "Network",
    name: "myIpAllocation",
    properties: () => ({
      properties: {
        type: "Hypernet",
        prefix: "3.2.5.0/24",
        allocationTags: {
          VNetID:
            "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/HypernetVnet1",
        },
      },
      location: "centraluseuap",
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      subnet: "mySubnet",
      virtualNetwork: "myVirtualNetwork",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the IpAllocation.',
      properties: {
        subnet: {
          readOnly: true,
          description: 'The Subnet that using the prefix of this IpAllocation resource.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        virtualNetwork: {
          readOnly: true,
          description: 'The VirtualNetwork that using the prefix of this IpAllocation resource.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        type: {
          description: 'The type for the IpAllocation.',
          type: 'string',
          enum: [ 'Undefined', 'Hypernet' ],
          'x-ms-enum': { name: 'IpAllocationType', modelAsString: true }
        },
        prefix: {
          type: 'string',
          description: 'The address prefix for the IpAllocation.'
        },
        prefixLength: {
          type: 'integer',
          'x-nullable': true,
          default: 0,
          description: 'The address prefix length for the IpAllocation.'
        },
        prefixType: {
          default: null,
          description: 'The address prefix Type for the IpAllocation.',
          type: 'string',
          enum: [ 'IPv4', 'IPv6' ],
          'x-ms-enum': { name: 'IPVersion', modelAsString: true }
        },
        ipamAllocationId: { type: 'string', description: 'The IPAM allocation ID.' },
        allocationTags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'IpAllocation tags.'
        }
      }
    },
    etag: {
      readOnly: true,
      type: 'string',
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
  description: 'IpAllocation resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/ipAllocation.json).
