---
id: ExpressRouteCircuitConnection
title: ExpressRouteCircuitConnection
---
Provides a **ExpressRouteCircuitConnection** from the **Network** group
## Examples
### ExpressRouteCircuitConnectionCreate
```js
exports.createResources = () => [
  {
    type: "ExpressRouteCircuitConnection",
    group: "Network",
    name: "myExpressRouteCircuitConnection",
    properties: () => ({
      properties: {
        expressRouteCircuitPeering: {
          id: "/subscriptions/subid1/resourceGroups/dedharcktinit/providers/Microsoft.Network/expressRouteCircuits/dedharcktlocal/peerings/AzurePrivatePeering",
        },
        peerExpressRouteCircuitPeering: {
          id: "/subscriptions/subid2/resourceGroups/dedharcktpeer/providers/Microsoft.Network/expressRouteCircuits/dedharcktremote/peerings/AzurePrivatePeering",
        },
        authorizationKey: "946a1918-b7a2-4917-b43c-8c4cdaee006a",
        addressPrefix: "10.0.0.0/29",
        ipv6CircuitConnectionConfig: { addressPrefix: "aa:bb::/125" },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      expressRouteCircuitPeering: "myExpressRouteCircuitPeering",
      circuit: "myExpressRouteCircuit",
      peering: "myExpressRouteCircuitPeering",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ExpressRouteCircuitPeering](../Network/ExpressRouteCircuitPeering.md)
- [ExpressRouteCircuit](../Network/ExpressRouteCircuit.md)
- [ExpressRouteCircuitPeering](../Network/ExpressRouteCircuitPeering.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the express route circuit connection.',
      properties: {
        expressRouteCircuitPeering: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        peerExpressRouteCircuitPeering: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        addressPrefix: {
          type: 'string',
          description: '/29 IP address space to carve out Customer addresses for tunnels.'
        },
        authorizationKey: { type: 'string', description: 'The authorization key.' },
        ipv6CircuitConnectionConfig: {
          description: 'IPv6 Address PrefixProperties of the express route circuit connection.',
          properties: {
            addressPrefix: {
              type: 'string',
              description: '/125 IP address space to carve out customer addresses for global reach.'
            },
            circuitConnectionStatus: {
              readOnly: true,
              description: 'Express Route Circuit connection state.',
              type: 'string',
              enum: [ 'Connected', 'Connecting', 'Disconnected' ],
              'x-ms-enum': { name: 'CircuitConnectionStatus', modelAsString: true }
            }
          }
        },
        circuitConnectionStatus: {
          description: 'Express Route Circuit connection state.',
          type: 'string',
          readOnly: true,
          enum: [ 'Connected', 'Connecting', 'Disconnected' ],
          'x-ms-enum': { name: 'CircuitConnectionStatus', modelAsString: true }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the express route circuit connection resource.',
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
  description: 'Express Route Circuit Connection in an ExpressRouteCircuitPeering resource.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/expressRouteCircuit.json).
