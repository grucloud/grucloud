---
id: VirtualWan
title: VirtualWan
---
Provides a **VirtualWan** from the **Network** group
## Examples
### VirtualWANCreate
```js
exports.createResources = () => [
  {
    type: "VirtualWan",
    group: "Network",
    name: "myVirtualWan",
    properties: () => ({
      location: "West US",
      tags: { key1: "value1" },
      properties: { disableVpnEncryption: false, type: "Basic" },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  required: [ 'location' ],
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the virtual WAN.',
      properties: {
        disableVpnEncryption: {
          type: 'boolean',
          description: 'Vpn encryption to be disabled or not.'
        },
        virtualHubs: {
          type: 'array',
          readOnly: true,
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'List of VirtualHubs in the VirtualWAN.'
        },
        vpnSites: {
          type: 'array',
          readOnly: true,
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'List of VpnSites in the VirtualWAN.'
        },
        allowBranchToBranchTraffic: {
          type: 'boolean',
          description: 'True if branch to branch traffic is allowed.'
        },
        allowVnetToVnetTraffic: {
          type: 'boolean',
          description: 'True if Vnet to Vnet traffic is allowed.'
        },
        office365LocalBreakoutCategory: {
          description: 'The office local breakout category.',
          type: 'string',
          readOnly: true,
          enum: [ 'Optimize', 'OptimizeAndAllow', 'All', 'None' ],
          'x-ms-enum': { name: 'OfficeTrafficCategory', modelAsString: true }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the virtual WAN resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        type: { type: 'string', description: 'The type of the VirtualWAN.' }
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
  description: 'VirtualWAN Resource.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualWan.json).
