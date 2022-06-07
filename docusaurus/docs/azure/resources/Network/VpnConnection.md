---
id: VpnConnection
title: VpnConnection
---
Provides a **VpnConnection** from the **Network** group
## Examples
### VpnConnectionPut
```js
exports.createResources = () => [
  {
    type: "VpnConnection",
    group: "Network",
    name: "myVpnConnection",
    properties: () => ({
      properties: {
        remoteVpnSite: {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnSites/vpnSite1",
        },
        vpnLinkConnections: [
          {
            name: "Connection-Link1",
            properties: {
              vpnSiteLink: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnSites/vpnSite1/vpnSiteLinks/siteLink1",
              },
              connectionBandwidth: 200,
              vpnConnectionProtocolType: "IKEv2",
              sharedKey: "key",
              vpnLinkConnectionMode: "Default",
              usePolicyBasedTrafficSelectors: false,
            },
          },
        ],
        trafficSelectorPolicies: [],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      vpnSite: ["myVpnSite"],
      virtualHubIpConfiguration: ["myVirtualHubIpConfiguration"],
      routeTable: "myRouteTable",
      gateway: "myVpnGateway",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VpnSite](../Network/VpnSite.md)
- [VirtualHubIpConfiguration](../Network/VirtualHubIpConfiguration.md)
- [RouteTable](../Network/RouteTable.md)
- [VpnGateway](../Network/VpnGateway.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the VPN connection.',
      properties: {
        remoteVpnSite: {
          description: 'Id of the connected vpn site.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        routingWeight: {
          type: 'integer',
          format: 'int32',
          description: 'Routing weight for vpn connection.'
        },
        dpdTimeoutSeconds: {
          type: 'integer',
          format: 'int32',
          description: 'DPD timeout in seconds for vpn connection.'
        },
        connectionStatus: {
          description: 'The connection status.',
          type: 'string',
          readOnly: true,
          enum: [ 'Unknown', 'Connecting', 'Connected', 'NotConnected' ],
          'x-ms-enum': { name: 'VpnConnectionStatus', modelAsString: true }
        },
        vpnConnectionProtocolType: {
          description: 'Connection protocol used for this connection.',
          type: 'string',
          enum: [ 'IKEv2', 'IKEv1' ],
          'x-ms-enum': {
            name: 'VirtualNetworkGatewayConnectionProtocol',
            modelAsString: true
          }
        },
        ingressBytesTransferred: {
          type: 'integer',
          format: 'int64',
          readOnly: true,
          description: 'Ingress bytes transferred.'
        },
        egressBytesTransferred: {
          type: 'integer',
          format: 'int64',
          readOnly: true,
          description: 'Egress bytes transferred.'
        },
        connectionBandwidth: {
          type: 'integer',
          format: 'int32',
          description: 'Expected bandwidth in MBPS.'
        },
        sharedKey: {
          type: 'string',
          description: 'SharedKey for the vpn connection.'
        },
        enableBgp: { type: 'boolean', description: 'EnableBgp flag.' },
        usePolicyBasedTrafficSelectors: {
          type: 'boolean',
          description: 'Enable policy-based traffic selectors.'
        },
        ipsecPolicies: {
          type: 'array',
          items: {
            properties: {
              saLifeTimeSeconds: {
                type: 'integer',
                format: 'int32',
                description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) lifetime in seconds for a site to site VPN tunnel.'
              },
              saDataSizeKilobytes: {
                type: 'integer',
                format: 'int32',
                description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) payload size in KB for a site to site VPN tunnel.'
              },
              ipsecEncryption: {
                description: 'The IPSec encryption algorithm (IKE phase 1).',
                type: 'string',
                enum: [
                  'None',      'DES',
                  'DES3',      'AES128',
                  'AES192',    'AES256',
                  'GCMAES128', 'GCMAES192',
                  'GCMAES256'
                ],
                'x-ms-enum': { name: 'IpsecEncryption', modelAsString: true }
              },
              ipsecIntegrity: {
                description: 'The IPSec integrity algorithm (IKE phase 1).',
                type: 'string',
                enum: [
                  'MD5',
                  'SHA1',
                  'SHA256',
                  'GCMAES128',
                  'GCMAES192',
                  'GCMAES256'
                ],
                'x-ms-enum': { name: 'IpsecIntegrity', modelAsString: true }
              },
              ikeEncryption: {
                description: 'The IKE encryption algorithm (IKE phase 2).',
                type: 'string',
                enum: [
                  'DES',
                  'DES3',
                  'AES128',
                  'AES192',
                  'AES256',
                  'GCMAES256',
                  'GCMAES128'
                ],
                'x-ms-enum': { name: 'IkeEncryption', modelAsString: true }
              },
              ikeIntegrity: {
                description: 'The IKE integrity algorithm (IKE phase 2).',
                type: 'string',
                enum: [
                  'MD5',
                  'SHA1',
                  'SHA256',
                  'SHA384',
                  'GCMAES256',
                  'GCMAES128'
                ],
                'x-ms-enum': { name: 'IkeIntegrity', modelAsString: true }
              },
              dhGroup: {
                description: 'The DH Group used in IKE Phase 1 for initial SA.',
                type: 'string',
                enum: [
                  'None',
                  'DHGroup1',
                  'DHGroup2',
                  'DHGroup14',
                  'DHGroup2048',
                  'ECP256',
                  'ECP384',
                  'DHGroup24'
                ],
                'x-ms-enum': { name: 'DhGroup', modelAsString: true }
              },
              pfsGroup: {
                description: 'The Pfs Group used in IKE Phase 2 for new child SA.',
                type: 'string',
                enum: [
                  'None',   'PFS1',
                  'PFS2',   'PFS2048',
                  'ECP256', 'ECP384',
                  'PFS24',  'PFS14',
                  'PFSMM'
                ],
                'x-ms-enum': { name: 'PfsGroup', modelAsString: true }
              }
            },
            required: [
              'saLifeTimeSeconds',
              'saDataSizeKilobytes',
              'ipsecEncryption',
              'ipsecIntegrity',
              'ikeEncryption',
              'ikeIntegrity',
              'dhGroup',
              'pfsGroup'
            ],
            description: 'An IPSec Policy configuration for a virtual network gateway connection.'
          },
          description: 'The IPSec Policies to be considered by this connection.'
        },
        trafficSelectorPolicies: {
          type: 'array',
          items: {
            properties: {
              localAddressRanges: {
                type: 'array',
                items: { type: 'string' },
                description: 'A collection of local address spaces in CIDR format.'
              },
              remoteAddressRanges: {
                type: 'array',
                items: { type: 'string' },
                description: 'A collection of remote address spaces in CIDR format.'
              }
            },
            required: [ 'localAddressRanges', 'remoteAddressRanges' ],
            description: 'An traffic selector policy for a virtual network gateway connection.'
          },
          description: 'The Traffic Selector Policies to be considered by this connection.'
        },
        enableRateLimiting: { type: 'boolean', description: 'EnableBgp flag.' },
        enableInternetSecurity: { type: 'boolean', description: 'Enable internet security.' },
        useLocalAzureIpAddress: {
          type: 'boolean',
          description: 'Use local azure ip to initiate connection.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the VPN connection resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        vpnLinkConnections: {
          type: 'array',
          description: 'List of all vpn site link connections to the gateway.',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the VPN site link connection.',
                properties: {
                  vpnSiteLink: {
                    description: 'Id of the connected vpn site link.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  routingWeight: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Routing weight for vpn connection.'
                  },
                  vpnLinkConnectionMode: {
                    type: 'string',
                    description: 'Vpn link connection mode.',
                    enum: [ 'Default', 'ResponderOnly', 'InitiatorOnly' ],
                    'x-ms-enum': {
                      name: 'VpnLinkConnectionMode',
                      modelAsString: true
                    }
                  },
                  connectionStatus: {
                    description: 'The connection status.',
                    type: 'string',
                    readOnly: true,
                    enum: [
                      'Unknown',
                      'Connecting',
                      'Connected',
                      'NotConnected'
                    ],
                    'x-ms-enum': {
                      name: 'VpnConnectionStatus',
                      modelAsString: true
                    }
                  },
                  vpnConnectionProtocolType: {
                    description: 'Connection protocol used for this connection.',
                    type: 'string',
                    enum: [ 'IKEv2', 'IKEv1' ],
                    'x-ms-enum': {
                      name: 'VirtualNetworkGatewayConnectionProtocol',
                      modelAsString: true
                    }
                  },
                  ingressBytesTransferred: {
                    type: 'integer',
                    format: 'int64',
                    readOnly: true,
                    description: 'Ingress bytes transferred.'
                  },
                  egressBytesTransferred: {
                    type: 'integer',
                    format: 'int64',
                    readOnly: true,
                    description: 'Egress bytes transferred.'
                  },
                  connectionBandwidth: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Expected bandwidth in MBPS.'
                  },
                  sharedKey: {
                    type: 'string',
                    description: 'SharedKey for the vpn connection.'
                  },
                  enableBgp: { type: 'boolean', description: 'EnableBgp flag.' },
                  vpnGatewayCustomBgpAddresses: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        ipConfigurationId: {
                          type: 'string',
                          description: 'The IpconfigurationId of ipconfiguration which belongs to gateway.'
                        },
                        customBgpIpAddress: {
                          type: 'string',
                          description: 'The custom BgpPeeringAddress which belongs to IpconfigurationId.'
                        }
                      },
                      required: [ 'ipConfigurationId', 'customBgpIpAddress' ],
                      description: 'GatewayCustomBgpIpAddressIpConfiguration for a virtual network gateway connection.'
                    },
                    description: 'vpnGatewayCustomBgpAddresses used by this connection.',
                    'x-ms-identifiers': []
                  },
                  usePolicyBasedTrafficSelectors: {
                    type: 'boolean',
                    description: 'Enable policy-based traffic selectors.'
                  },
                  ipsecPolicies: {
                    type: 'array',
                    items: {
                      properties: {
                        saLifeTimeSeconds: {
                          type: 'integer',
                          format: 'int32',
                          description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) lifetime in seconds for a site to site VPN tunnel.'
                        },
                        saDataSizeKilobytes: {
                          type: 'integer',
                          format: 'int32',
                          description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) payload size in KB for a site to site VPN tunnel.'
                        },
                        ipsecEncryption: {
                          description: 'The IPSec encryption algorithm (IKE phase 1).',
                          type: 'string',
                          enum: [
                            'None',      'DES',
                            'DES3',      'AES128',
                            'AES192',    'AES256',
                            'GCMAES128', 'GCMAES192',
                            'GCMAES256'
                          ],
                          'x-ms-enum': {
                            name: 'IpsecEncryption',
                            modelAsString: true
                          }
                        },
                        ipsecIntegrity: {
                          description: 'The IPSec integrity algorithm (IKE phase 1).',
                          type: 'string',
                          enum: [
                            'MD5',
                            'SHA1',
                            'SHA256',
                            'GCMAES128',
                            'GCMAES192',
                            'GCMAES256'
                          ],
                          'x-ms-enum': {
                            name: 'IpsecIntegrity',
                            modelAsString: true
                          }
                        },
                        ikeEncryption: {
                          description: 'The IKE encryption algorithm (IKE phase 2).',
                          type: 'string',
                          enum: [
                            'DES',
                            'DES3',
                            'AES128',
                            'AES192',
                            'AES256',
                            'GCMAES256',
                            'GCMAES128'
                          ],
                          'x-ms-enum': {
                            name: 'IkeEncryption',
                            modelAsString: true
                          }
                        },
                        ikeIntegrity: {
                          description: 'The IKE integrity algorithm (IKE phase 2).',
                          type: 'string',
                          enum: [
                            'MD5',
                            'SHA1',
                            'SHA256',
                            'SHA384',
                            'GCMAES256',
                            'GCMAES128'
                          ],
                          'x-ms-enum': { name: 'IkeIntegrity', modelAsString: true }
                        },
                        dhGroup: {
                          description: 'The DH Group used in IKE Phase 1 for initial SA.',
                          type: 'string',
                          enum: [
                            'None',
                            'DHGroup1',
                            'DHGroup2',
                            'DHGroup14',
                            'DHGroup2048',
                            'ECP256',
                            'ECP384',
                            'DHGroup24'
                          ],
                          'x-ms-enum': { name: 'DhGroup', modelAsString: true }
                        },
                        pfsGroup: {
                          description: 'The Pfs Group used in IKE Phase 2 for new child SA.',
                          type: 'string',
                          enum: [
                            'None',   'PFS1',
                            'PFS2',   'PFS2048',
                            'ECP256', 'ECP384',
                            'PFS24',  'PFS14',
                            'PFSMM'
                          ],
                          'x-ms-enum': { name: 'PfsGroup', modelAsString: true }
                        }
                      },
                      required: [
                        'saLifeTimeSeconds',
                        'saDataSizeKilobytes',
                        'ipsecEncryption',
                        'ipsecIntegrity',
                        'ikeEncryption',
                        'ikeIntegrity',
                        'dhGroup',
                        'pfsGroup'
                      ],
                      description: 'An IPSec Policy configuration for a virtual network gateway connection.'
                    },
                    description: 'The IPSec Policies to be considered by this connection.'
                  },
                  enableRateLimiting: { type: 'boolean', description: 'EnableBgp flag.' },
                  useLocalAzureIpAddress: {
                    type: 'boolean',
                    description: 'Use local azure ip to initiate connection.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the VPN site link connection resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  ingressNatRules: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'List of ingress NatRules.'
                  },
                  egressNatRules: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'List of egress NatRules.'
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
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Resource type.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'VpnSiteLinkConnection Resource.'
          }
        },
        routingConfiguration: {
          description: 'The Routing Configuration indicating the associated and propagated route tables on this connection.',
          properties: {
            associatedRouteTable: {
              description: 'The resource id RouteTable associated with this RoutingConfiguration.',
              properties: { id: { type: 'string', description: 'Resource ID.' } },
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
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
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
                      name: {
                        type: 'string',
                        description: 'The name of the StaticRoute that is unique within a VnetRoute.'
                      },
                      addressPrefixes: {
                        type: 'array',
                        description: 'List of all address prefixes.',
                        items: { type: 'string' }
                      },
                      nextHopIpAddress: {
                        type: 'string',
                        description: 'The ip address of the next hop.'
                      }
                    }
                  }
                },
                bgpConnections: {
                  type: 'array',
                  readOnly: true,
                  description: 'The list of references to HubBgpConnection objects.',
                  items: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  }
                }
              }
            }
          }
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
  description: 'VpnConnection Resource.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualWan.json).
