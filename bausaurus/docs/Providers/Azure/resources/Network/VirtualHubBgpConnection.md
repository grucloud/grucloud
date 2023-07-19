---
id: VirtualHubBgpConnection
title: VirtualHubBgpConnection
---
Provides a **VirtualHubBgpConnection** from the **Network** group
## Examples
### VirtualHubRouteTableV2Put
```js
exports.createResources = () => [
  {
    type: "VirtualHubBgpConnection",
    group: "Network",
    name: "myVirtualHubBgpConnection",
    properties: () => ({
      properties: {
        peerIp: "192.168.1.5",
        peerAsn: 20000,
        hubVirtualNetworkConnection: {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/hub1/hubVirtualNetworkConnections/hubVnetConn1",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      hubVirtualNetworkConnection: "myHubVirtualNetworkConnection",
      virtualHub: "myVirtualHub",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [HubVirtualNetworkConnection](../Network/HubVirtualNetworkConnection.md)
- [VirtualHub](../Network/VirtualHub.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'The properties of the Bgp connections.',
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
        hubVirtualNetworkConnection: {
          description: 'The reference to the HubVirtualNetworkConnection resource.',
          readOnly: false,
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        provisioningState: {
          description: 'The provisioning state of the resource.',
          readOnly: true,
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        connectionState: {
          type: 'string',
          description: 'The current state of the VirtualHub to Peer.',
          readOnly: true,
          enum: [ 'Unknown', 'Connecting', 'Connected', 'NotConnected' ],
          'x-ms-enum': { name: 'HubBgpConnectionStatus', modelAsString: true }
        }
      }
    },
    name: { type: 'string', description: 'Name of the connection.' },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    type: { type: 'string', readOnly: true, description: 'Connection type.' }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Virtual Appliance Site resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualWan.json).
