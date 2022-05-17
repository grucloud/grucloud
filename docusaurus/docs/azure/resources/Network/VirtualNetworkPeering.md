---
id: VirtualNetworkPeering
title: VirtualNetworkPeering
---
Provides a **VirtualNetworkPeering** from the **Network** group
## Examples
### Create peering
```js
exports.createResources = () => [
  {
    type: "VirtualNetworkPeering",
    group: "Network",
    name: "myVirtualNetworkPeering",
    properties: () => ({
      properties: {
        allowVirtualNetworkAccess: true,
        allowForwardedTraffic: true,
        allowGatewayTransit: false,
        useRemoteGateways: false,
        remoteVirtualNetwork: {
          id: "/subscriptions/subid/resourceGroups/peerTest/providers/Microsoft.Network/virtualNetworks/vnet2",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualNetwork: "myVirtualNetwork",
    }),
  },
];

```

### Sync Peering
```js
exports.createResources = () => [
  {
    type: "VirtualNetworkPeering",
    group: "Network",
    name: "myVirtualNetworkPeering",
    properties: () => ({
      properties: {
        allowVirtualNetworkAccess: true,
        allowForwardedTraffic: true,
        allowGatewayTransit: false,
        useRemoteGateways: false,
        remoteVirtualNetwork: {
          id: "/subscriptions/subid/resourceGroups/peerTest/providers/Microsoft.Network/virtualNetworks/vnet2",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualNetwork: "myVirtualNetwork",
    }),
  },
];

```

### Create peering with remote virtual network encryption
```js
exports.createResources = () => [
  {
    type: "VirtualNetworkPeering",
    group: "Network",
    name: "myVirtualNetworkPeering",
    properties: () => ({
      properties: {
        allowVirtualNetworkAccess: true,
        allowForwardedTraffic: true,
        allowGatewayTransit: false,
        useRemoteGateways: false,
        remoteVirtualNetwork: {
          id: "/subscriptions/subid/resourceGroups/peerTest/providers/Microsoft.Network/virtualNetworks/vnet2",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualNetwork: "myVirtualNetwork",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the virtual network peering.',
      properties: {
        allowVirtualNetworkAccess: {
          type: 'boolean',
          description: 'Whether the VMs in the local virtual network space would be able to access the VMs in remote virtual network space.'
        },
        allowForwardedTraffic: {
          type: 'boolean',
          description: 'Whether the forwarded traffic from the VMs in the local virtual network will be allowed/disallowed in remote virtual network.'
        },
        allowGatewayTransit: {
          type: 'boolean',
          description: 'If gateway links can be used in remote virtual networking to link to this virtual network.'
        },
        useRemoteGateways: {
          type: 'boolean',
          description: 'If remote gateways can be used on this virtual network. If the flag is set to true, and allowGatewayTransit on remote peering is also true, virtual network will use gateways of remote virtual network for transit. Only one peering can have this flag set to true. This flag cannot be set if virtual network already has a gateway.'
        },
        remoteVirtualNetwork: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        remoteAddressSpace: {
          description: 'The reference to the address space peered with the remote virtual network.',
          properties: {
            addressPrefixes: {
              type: 'array',
              items: { type: 'string' },
              description: 'A list of address blocks reserved for this virtual network in CIDR notation.'
            }
          }
        },
        remoteVirtualNetworkAddressSpace: {
          description: 'The reference to the current address space of the remote virtual network.',
          properties: {
            addressPrefixes: {
              type: 'array',
              items: { type: 'string' },
              description: 'A list of address blocks reserved for this virtual network in CIDR notation.'
            }
          }
        },
        remoteBgpCommunities: {
          default: null,
          description: "The reference to the remote virtual network's Bgp Communities.",
          properties: {
            virtualNetworkCommunity: {
              type: 'string',
              description: 'The BGP community associated with the virtual network.'
            },
            regionalCommunity: {
              type: 'string',
              readOnly: true,
              description: 'The BGP community associated with the region of the virtual network.'
            }
          },
          required: [ 'virtualNetworkCommunity' ]
        },
        remoteVirtualNetworkEncryption: {
          readOnly: true,
          default: null,
          description: "The reference to the remote virtual network's encryption",
          type: 'object',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Indicates if encryption is enabled on the virtual network.'
            },
            enforcement: {
              type: 'string',
              description: 'If the encrypted VNet allows VM that does not support encryption',
              enum: [ 'DropUnencrypted', 'AllowUnencrypted' ],
              'x-ms-enum': {
                name: 'VirtualNetworkEncryptionEnforcement',
                modelAsString: true
              }
            }
          },
          required: [ 'enabled' ]
        },
        peeringState: {
          type: 'string',
          description: 'The status of the virtual network peering.',
          enum: [ 'Initiated', 'Connected', 'Disconnected' ],
          'x-ms-enum': { name: 'VirtualNetworkPeeringState', modelAsString: true }
        },
        peeringSyncLevel: {
          type: 'string',
          description: 'The peering sync status of the virtual network peering.',
          enum: [
            'FullyInSync',
            'RemoteNotInSync',
            'LocalNotInSync',
            'LocalAndRemoteNotInSync'
          ],
          'x-ms-enum': { name: 'VirtualNetworkPeeringLevel', modelAsString: true }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the virtual network peering resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        doNotVerifyRemoteGateways: {
          type: 'boolean',
          description: 'If we need to verify the provisioning state of the remote gateway.'
        },
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resourceGuid property of the Virtual Network peering resource.'
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
    type: { type: 'string', description: 'Resource type.' }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Peerings in a virtual network resource.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualNetwork.json).
