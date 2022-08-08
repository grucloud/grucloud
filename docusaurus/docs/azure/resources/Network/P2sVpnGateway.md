---
id: P2sVpnGateway
title: P2sVpnGateway
---
Provides a **P2sVpnGateway** from the **Network** group
## Examples
### P2SVpnGatewayPut
```js
exports.createResources = () => [
  {
    type: "P2sVpnGateway",
    group: "Network",
    name: "myP2sVpnGateway",
    properties: () => ({
      location: "West US",
      tags: { key1: "value1" },
      properties: {
        virtualHub: {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1",
        },
        vpnServerConfiguration: {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnServerConfigurations/vpnServerConfiguration1",
        },
        p2SConnectionConfigurations: [
          {
            name: "P2SConnectionConfig1",
            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/p2sVpnGateways/p2sVpnGateway1/p2sConnectionConfigurations/P2SConnectionConfig1",
            properties: {
              vpnClientAddressPool: { addressPrefixes: ["101.3.0.0/16"] },
              routingConfiguration: {
                associatedRouteTable: {
                  id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable1",
                },
                propagatedRouteTables: {
                  labels: ["label1", "label2"],
                  ids: [
                    {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable1",
                    },
                    {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable2",
                    },
                    {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable3",
                    },
                  ],
                },
                vnetRoutes: { staticRoutes: [] },
              },
            },
          },
        ],
        vpnGatewayScaleUnit: 1,
        customDnsServers: ["1.1.1.1", "2.2.2.2"],
        isRoutingPreferenceInternet: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualHub: "myVirtualHub",
      routeTables: ["myRouteTable"],
      vpnServerConfiguration: "myVpnServerConfiguration",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHub](../Network/VirtualHub.md)
- [RouteTable](../Network/RouteTable.md)
- [VpnServerConfiguration](../Network/VpnServerConfiguration.md)
## Swagger Schema
```js
{
  required: [ 'location' ],
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the P2SVpnGateway.',
      properties: {
        virtualHub: {
          description: 'The VirtualHub to which the gateway belongs.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        p2SConnectionConfigurations: {
          type: 'array',
          description: 'List of all p2s connection configurations of the gateway.',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the P2S connection configuration.',
                properties: {
                  vpnClientAddressPool: {
                    description: 'The reference to the address space resource which represents Address space for P2S VpnClient.',
                    properties: {
                      addressPrefixes: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'A list of address blocks reserved for this virtual network in CIDR notation.'
                      }
                    }
                  },
                  routingConfiguration: {
                    description: 'The Routing Configuration indicating the associated and propagated route tables on this connection.',
                    properties: {
                      associatedRouteTable: {
                        description: 'The resource id RouteTable associated with this RoutingConfiguration.',
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          }
                        },
                        'x-ms-azure-resource': true
                      },
                      propagatedRouteTables: {
                        description: 'The list of RouteTables to advertise the routes to.',
                        properties: {
                          labels: {
                            type: 'array',
                            description: 'The list of labels.',
                            items: { type: 'string' }
                          },
                          ids: {
                            type: 'array',
                            description: 'The list of resource ids of all the RouteTables.',
                            items: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            }
                          }
                        }
                      },
                      vnetRoutes: {
                        description: 'List of routes that control routing from VirtualHub into a virtual network connection.',
                        properties: {
                          staticRoutes: {
                            type: 'array',
                            description: 'List of all Static Routes.',
                            items: {
                              description: 'List of all Static Routes.',
                              properties: {
                                name: [Object],
                                addressPrefixes: [Object],
                                nextHopIpAddress: [Object]
                              }
                            }
                          },
                          bgpConnections: {
                            type: 'array',
                            readOnly: true,
                            description: 'The list of references to HubBgpConnection objects.',
                            items: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            }
                          }
                        }
                      }
                    }
                  },
                  enableInternetSecurity: {
                    type: 'boolean',
                    description: 'Flag indicating whether the enable internet security flag is turned on for the P2S Connections or not.'
                  },
                  configurationPolicyGroupAssociations: {
                    type: 'array',
                    readOnly: true,
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'List of Configuration Policy Groups that this P2SConnectionConfiguration is attached to.'
                  },
                  previousConfigurationPolicyGroupAssociations: {
                    type: 'array',
                    readOnly: true,
                    items: {
                      type: 'object',
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the VpnServerConfigurationPolicyGroup.',
                          type: 'object',
                          properties: {
                            isDefault: {
                              type: 'boolean',
                              description: 'Shows if this is a Default VpnServerConfigurationPolicyGroup or not.'
                            },
                            priority: {
                              type: 'integer',
                              format: 'int32',
                              description: 'Priority for VpnServerConfigurationPolicyGroup.'
                            },
                            policyMembers: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'VpnServerConfiguration PolicyGroup member',
                                type: 'object'
                              },
                              description: 'Multiple PolicyMembers for VpnServerConfigurationPolicyGroup.',
                              'x-ms-identifiers': []
                            },
                            p2SConnectionConfigurations: {
                              type: 'array',
                              readOnly: true,
                              items: {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              },
                              description: 'List of references to P2SConnectionConfigurations.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the VpnServerConfigurationPolicyGroup resource.',
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
                        etag: {
                          type: 'string',
                          readOnly: true,
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        name: {
                          type: 'string',
                          description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Resource type.'
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
                      description: 'VpnServerConfigurationPolicyGroup Resource.'
                    },
                    description: 'List of previous Configuration Policy Groups that this P2SConnectionConfiguration was attached to.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the P2SConnectionConfiguration resource.',
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
                type: 'string',
                readOnly: true,
                description: 'A unique read-only string that changes whenever the resource is updated.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'P2SConnectionConfiguration Resource.'
          }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the P2S VPN gateway resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        vpnGatewayScaleUnit: {
          type: 'integer',
          format: 'int32',
          description: 'The scale unit for this p2s vpn gateway.'
        },
        vpnServerConfiguration: {
          description: 'The VpnServerConfiguration to which the p2sVpnGateway is attached to.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        vpnClientConnectionHealth: {
          readOnly: true,
          description: "All P2S VPN clients' connection health status.",
          properties: {
            totalIngressBytesTransferred: {
              readOnly: true,
              type: 'integer',
              format: 'int64',
              description: 'Total of the Ingress Bytes Transferred in this P2S Vpn connection.'
            },
            totalEgressBytesTransferred: {
              readOnly: true,
              type: 'integer',
              format: 'int64',
              description: 'Total of the Egress Bytes Transferred in this connection.'
            },
            vpnClientConnectionsCount: {
              type: 'integer',
              format: 'int32',
              description: 'The total of p2s vpn clients connected at this time to this P2SVpnGateway.'
            },
            allocatedIpAddresses: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of allocated ip addresses to the connected p2s vpn clients.'
            }
          }
        },
        customDnsServers: {
          type: 'array',
          description: 'List of all customer specified DNS servers IP addresses.',
          items: { type: 'string' }
        },
        isRoutingPreferenceInternet: {
          type: 'boolean',
          description: 'Enable Routing Preference property for the Public IP Interface of the P2SVpnGateway.'
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
  description: 'P2SVpnGateway Resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualWan.json).
