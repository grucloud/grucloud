---
id: ExpressRouteCircuit
title: ExpressRouteCircuit
---
Provides a **ExpressRouteCircuit** from the **Network** group
## Examples
### Create ExpressRouteCircuit
```js
provider.Network.makeExpressRouteCircuit({
  name: "myExpressRouteCircuit",
  properties: () => ({
    sku: {
      name: "Standard_MeteredData",
      tier: "Standard",
      family: "MeteredData",
    },
    properties: {
      authorizations: [],
      peerings: [],
      allowClassicOperations: false,
      serviceProviderProperties: {
        serviceProviderName: "Equinix",
        peeringLocation: "Silicon Valley",
        bandwidthInMbps: 200,
      },
    },
    location: "Brazil South",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    routeFilter: resources.Network.RouteFilter["myRouteFilter"],
    expressRouteConnection:
      resources.Network.ExpressRouteConnection["myExpressRouteConnection"],
    route: resources.Network.Route["myRoute"],
  }),
});

```

### Create ExpressRouteCircuit on ExpressRoutePort
```js
provider.Network.makeExpressRouteCircuit({
  name: "myExpressRouteCircuit",
  properties: () => ({
    location: "westus",
    sku: {
      name: "Premium_MeteredData",
      tier: "Premium",
      family: "MeteredData",
    },
    properties: {
      expressRoutePort: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/expressRoutePorts/portName",
      },
      bandwidthInGbps: 10,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    routeFilter: resources.Network.RouteFilter["myRouteFilter"],
    expressRouteConnection:
      resources.Network.ExpressRouteConnection["myExpressRouteConnection"],
    route: resources.Network.Route["myRoute"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [RouteFilter](../Network/RouteFilter.md)
- [ExpressRouteConnection](../Network/ExpressRouteConnection.md)
- [Route](../Network/Route.md)
## Swagger Schema
```js
{
  properties: {
    sku: {
      description: 'The SKU.',
      properties: {
        name: { type: 'string', description: 'The name of the SKU.' },
        tier: {
          type: 'string',
          description: 'The tier of the SKU.',
          enum: [ 'Standard', 'Premium', 'Basic', 'Local' ],
          'x-ms-enum': { name: 'ExpressRouteCircuitSkuTier', modelAsString: true }
        },
        family: {
          type: 'string',
          description: 'The family of the SKU.',
          enum: [ 'UnlimitedData', 'MeteredData' ],
          'x-ms-enum': { name: 'ExpressRouteCircuitSkuFamily', modelAsString: true }
        }
      }
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the express route circuit.',
      properties: {
        allowClassicOperations: { type: 'boolean', description: 'Allow classic operations.' },
        circuitProvisioningState: {
          type: 'string',
          description: 'The CircuitProvisioningState state of the resource.'
        },
        serviceProviderProvisioningState: {
          description: 'The ServiceProviderProvisioningState state of the resource.',
          type: 'string',
          enum: [
            'NotProvisioned',
            'Provisioning',
            'Provisioned',
            'Deprovisioning'
          ],
          'x-ms-enum': {
            name: 'ServiceProviderProvisioningState',
            modelAsString: true
          }
        },
        authorizations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the express route circuit authorization.',
                properties: {
                  authorizationKey: {
                    type: 'string',
                    description: 'The authorization key.'
                  },
                  authorizationUseStatus: {
                    type: 'string',
                    description: 'The authorization use status.',
                    enum: [ 'Available', 'InUse' ],
                    'x-ms-enum': {
                      name: 'AuthorizationUseStatus',
                      modelAsString: true
                    }
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
          },
          description: 'The list of authorizations.'
        },
        peerings: {
          type: 'array',
          items: {
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
                    'x-ms-enum': {
                      name: 'ExpressRoutePeeringType',
                      modelAsString: true
                    }
                  },
                  state: {
                    description: 'The peering state.',
                    type: 'string',
                    enum: [ 'Disabled', 'Enabled' ],
                    'x-ms-enum': {
                      name: 'ExpressRoutePeeringState',
                      modelAsString: true
                    }
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
                  primaryPeerAddressPrefix: {
                    type: 'string',
                    description: 'The primary address prefix.'
                  },
                  secondaryPeerAddressPrefix: {
                    type: 'string',
                    description: 'The secondary address prefix.'
                  },
                  primaryAzurePort: { type: 'string', description: 'The primary port.' },
                  secondaryAzurePort: {
                    type: 'string',
                    description: 'The secondary port.'
                  },
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
                  gatewayManagerEtag: {
                    type: 'string',
                    description: 'The GatewayManager Etag.'
                  },
                  lastModifiedBy: {
                    readOnly: true,
                    type: 'string',
                    description: 'Who was the last to modify the peering.'
                  },
                  routeFilter: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
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
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          }
                        },
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
                              enum: [
                                'Connected',
                                'Connecting',
                                'Disconnected'
                              ],
                              'x-ms-enum': {
                                name: 'CircuitConnectionStatus',
                                modelAsString: true
                              }
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the express route circuit connection resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
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
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
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
                              enum: [
                                'Connected',
                                'Connecting',
                                'Disconnected'
                              ],
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
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
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
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
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
          },
          description: 'The list of peerings.'
        },
        serviceKey: { type: 'string', description: 'The ServiceKey.' },
        serviceProviderNotes: { type: 'string', description: 'The ServiceProviderNotes.' },
        serviceProviderProperties: {
          description: 'The ServiceProviderProperties.',
          properties: {
            serviceProviderName: { type: 'string', description: 'The serviceProviderName.' },
            peeringLocation: { type: 'string', description: 'The peering location.' },
            bandwidthInMbps: {
              type: 'integer',
              format: 'int32',
              description: 'The BandwidthInMbps.'
            }
          }
        },
        expressRoutePort: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        bandwidthInGbps: {
          type: 'number',
          description: 'The bandwidth of the circuit when the circuit is provisioned on an ExpressRoutePort resource.'
        },
        stag: {
          readOnly: true,
          type: 'integer',
          format: 'int32',
          description: 'The identifier of the circuit traffic. Outer tag for QinQ encapsulation.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the express route circuit resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        gatewayManagerEtag: { type: 'string', description: 'The GatewayManager Etag.' },
        globalReachEnabled: {
          type: 'boolean',
          description: 'Flag denoting global reach status.'
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
  description: 'ExpressRouteCircuit resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/expressRouteCircuit.json).
