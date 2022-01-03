---
id: ExpressRouteCircuitPeering
title: ExpressRouteCircuitPeering
---
Provides a **ExpressRouteCircuitPeering** from the **Network** group
## Examples
### Create ExpressRouteCircuit Peerings
```js
provider.Network.makeExpressRouteCircuitPeering({
  name: "myExpressRouteCircuitPeering",
  properties: () => ({
    properties: {
      peerASN: 200,
      primaryPeerAddressPrefix: "192.168.16.252/30",
      secondaryPeerAddressPrefix: "192.168.18.252/30",
      vlanId: 200,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    routeFilter: resources.Network.RouteFilter["myRouteFilter"],
    expressRouteConnection:
      resources.Network.ExpressRouteConnection["myExpressRouteConnection"],
    circuit: resources.Network.ExpressRouteCircuit["myExpressRouteCircuit"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [RouteFilter](../Network/RouteFilter.md)
- [ExpressRouteConnection](../Network/ExpressRouteConnection.md)
- [ExpressRouteCircuit](../Network/ExpressRouteCircuit.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the express route circuit peering.',
      properties: {
        peeringType: {
          description: 'The peering type.',
          type: 'string',
          enum: [
            'AzurePublicPeering',
            'AzurePrivatePeering',
            'MicrosoftPeering'
          ],
          'x-ms-enum': { name: 'ExpressRoutePeeringType', modelAsString: true }
        },
        state: {
          description: 'The peering state.',
          type: 'string',
          enum: [ 'Disabled', 'Enabled' ],
          'x-ms-enum': { name: 'ExpressRoutePeeringState', modelAsString: true }
        },
        azureASN: {
          type: 'integer',
          format: 'int32',
          description: 'The Azure ASN.'
        },
        peerASN: {
          type: 'integer',
          format: 'int64',
          minimum: 1,
          maximum: 4294967295,
          description: 'The peer ASN.'
        },
        primaryPeerAddressPrefix: { type: 'string', description: 'The primary address prefix.' },
        secondaryPeerAddressPrefix: {
          type: 'string',
          description: 'The secondary address prefix.'
        },
        primaryAzurePort: { type: 'string', description: 'The primary port.' },
        secondaryAzurePort: { type: 'string', description: 'The secondary port.' },
        sharedKey: { type: 'string', description: 'The shared key.' },
        vlanId: {
          type: 'integer',
          format: 'int32',
          description: 'The VLAN ID.'
        },
        microsoftPeeringConfig: {
          description: 'The Microsoft peering configuration.',
          properties: {
            advertisedPublicPrefixes: {
              type: 'array',
              items: { type: 'string' },
              description: 'The reference to AdvertisedPublicPrefixes.'
            },
            advertisedCommunities: {
              type: 'array',
              items: { type: 'string' },
              description: 'The communities of bgp peering. Specified for microsoft peering.'
            },
            advertisedPublicPrefixesState: {
              readOnly: true,
              type: 'string',
              description: 'The advertised public prefix state of the Peering resource.',
              enum: [
                'NotConfigured',
                'Configuring',
                'Configured',
                'ValidationNeeded'
              ],
              'x-ms-enum': {
                name: 'ExpressRouteCircuitPeeringAdvertisedPublicPrefixState',
                modelAsString: true
              }
            },
            legacyMode: {
              type: 'integer',
              format: 'int32',
              description: 'The legacy mode of the peering.'
            },
            customerASN: {
              type: 'integer',
              format: 'int32',
              description: 'The CustomerASN of the peering.'
            },
            routingRegistryName: {
              type: 'string',
              description: 'The RoutingRegistryName of the configuration.'
            }
          }
        },
        stats: {
          description: 'The peering stats of express route circuit.',
          properties: {
            primarybytesIn: {
              type: 'integer',
              format: 'int64',
              description: 'The Primary BytesIn of the peering.'
            },
            primarybytesOut: {
              type: 'integer',
              format: 'int64',
              description: 'The primary BytesOut of the peering.'
            },
            secondarybytesIn: {
              type: 'integer',
              format: 'int64',
              description: 'The secondary BytesIn of the peering.'
            },
            secondarybytesOut: {
              type: 'integer',
              format: 'int64',
              description: 'The secondary BytesOut of the peering.'
            }
          }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the express route circuit peering resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        gatewayManagerEtag: { type: 'string', description: 'The GatewayManager Etag.' },
        lastModifiedBy: {
          readOnly: true,
          type: 'string',
          description: 'Who was the last to modify the peering.'
        },
        routeFilter: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        ipv6PeeringConfig: {
          description: 'The IPv6 peering configuration.',
          properties: {
            primaryPeerAddressPrefix: {
              type: 'string',
              description: 'The primary address prefix.'
            },
            secondaryPeerAddressPrefix: {
              type: 'string',
              description: 'The secondary address prefix.'
            },
            microsoftPeeringConfig: {
              description: 'The Microsoft peering configuration.',
              properties: {
                advertisedPublicPrefixes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'The reference to AdvertisedPublicPrefixes.'
                },
                advertisedCommunities: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'The communities of bgp peering. Specified for microsoft peering.'
                },
                advertisedPublicPrefixesState: {
                  readOnly: true,
                  type: 'string',
                  description: 'The advertised public prefix state of the Peering resource.',
                  enum: [
                    'NotConfigured',
                    'Configuring',
                    'Configured',
                    'ValidationNeeded'
                  ],
                  'x-ms-enum': {
                    name: 'ExpressRouteCircuitPeeringAdvertisedPublicPrefixState',
                    modelAsString: true
                  }
                },
                legacyMode: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The legacy mode of the peering.'
                },
                customerASN: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The CustomerASN of the peering.'
                },
                routingRegistryName: {
                  type: 'string',
                  description: 'The RoutingRegistryName of the configuration.'
                }
              }
            },
            routeFilter: {
              properties: { id: { type: 'string', description: 'Resource ID.' } },
              description: 'Reference to another subresource.',
              'x-ms-azure-resource': true
            },
            state: {
              type: 'string',
              description: 'The state of peering.',
              enum: [ 'Disabled', 'Enabled' ],
              'x-ms-enum': {
                name: 'ExpressRouteCircuitPeeringState',
                modelAsString: true
              }
            }
          }
        },
        expressRouteConnection: {
          description: 'The ExpressRoute connection.',
          properties: {
            id: {
              type: 'string',
              readOnly: true,
              description: 'The ID of the ExpressRouteConnection.'
            }
          }
        },
        connections: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the express route circuit connection.',
                properties: {
                  expressRouteCircuitPeering: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  peerExpressRouteCircuitPeering: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  addressPrefix: {
                    type: 'string',
                    description: '/29 IP address space to carve out Customer addresses for tunnels.'
                  },
                  authorizationKey: {
                    type: 'string',
                    description: 'The authorization key.'
                  },
                  ipv6CircuitConnectionConfig: {
                    description: 'IPv6 Address PrefixProperties of the express route circuit connection.',
                    properties: {
                      addressPrefix: [Object],
                      circuitConnectionStatus: [Object]
                    }
                  },
                  circuitConnectionStatus: {
                    description: 'Express Route Circuit connection state.',
                    type: 'string',
                    readOnly: true,
                    enum: [ 'Connected', 'Connecting', 'Disconnected' ],
                    'x-ms-enum': {
                      name: 'CircuitConnectionStatus',
                      modelAsString: true
                    }
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
          },
          description: 'The list of circuit connections associated with Azure Private Peering for this circuit.'
        },
        peeredConnections: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the peer express route circuit connection.',
                properties: {
                  expressRouteCircuitPeering: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  peerExpressRouteCircuitPeering: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  addressPrefix: {
                    type: 'string',
                    description: '/29 IP address space to carve out Customer addresses for tunnels.'
                  },
                  circuitConnectionStatus: {
                    description: 'Express Route Circuit connection state.',
                    type: 'string',
                    readOnly: true,
                    enum: [ 'Connected', 'Connecting', 'Disconnected' ],
                    'x-ms-enum': {
                      name: 'CircuitConnectionStatus',
                      modelAsString: true
                    }
                  },
                  connectionName: {
                    type: 'string',
                    description: 'The name of the express route circuit connection resource.'
                  },
                  authResourceGuid: {
                    type: 'string',
                    description: 'The resource guid of the authorization used for the express route circuit connection.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the peer express route circuit connection resource.',
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
            description: 'Peer Express Route Circuit Connection in an ExpressRouteCircuitPeering resource.'
          },
          readOnly: true,
          description: 'The list of peered circuit connections associated with Azure Private Peering for this circuit.'
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
  description: 'Peering in an ExpressRouteCircuit resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/expressRouteCircuit.json).
