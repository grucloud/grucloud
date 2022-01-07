---
id: VpnGateway
title: VpnGateway
---
Provides a **VpnGateway** from the **Network** group
## Examples
### VpnGatewayPut
```js
provider.Network.makeVpnGateway({
  name: "myVpnGateway",
  properties: () => ({
    location: "westcentralus",
    tags: { key1: "value1" },
    properties: {
      virtualHub: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1",
      },
      connections: [
        {
          name: "vpnConnection1",
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
                  egressNatRules: [
                    {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnGateways/gateway1/natRules/nat03",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      bgpSettings: {
        asn: 65515,
        peerWeight: 0,
        bgpPeeringAddresses: [
          {
            ipconfigurationId: "Instance0",
            customBgpIpAddresses: ["169.254.21.5"],
          },
          {
            ipconfigurationId: "Instance1",
            customBgpIpAddresses: ["169.254.21.10"],
          },
        ],
      },
      natRules: [
        {
          name: "nat03",
          properties: {
            type: "Static",
            mode: "EgressSnat",
            internalMappings: [{ addressSpace: "0.0.0.0/26" }],
            externalMappings: [{ addressSpace: "192.168.0.0/26" }],
            ipConfigurationId: "",
          },
        },
      ],
      isRoutingPreferenceInternet: false,
      enableBgpRouteTranslationForNat: false,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
    vpnSite: resources.Network.VpnSite["myVpnSite"],
    routeTable: resources.Network.RouteTable["myRouteTable"],
    virtualHubIpConfiguration:
      resources.Network.VirtualHubIpConfiguration[
        "myVirtualHubIpConfiguration"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHub](../Network/VirtualHub.md)
- [VpnSite](../Network/VpnSite.md)
- [RouteTable](../Network/RouteTable.md)
- [VirtualHubIpConfiguration](../Network/VirtualHubIpConfiguration.md)
## Swagger Schema
```js
{
  required: [ 'location' ],
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the VPN gateway.',
      properties: {
        virtualHub: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        connections: {
          type: 'array',
          description: 'List of all vpn connections to the gateway.',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the VPN connection.',
                properties: {
                  remoteVpnSite: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
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
                  enableInternetSecurity: {
                    type: 'boolean',
                    description: 'Enable internet security.'
                  },
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
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
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
                              enum: [
                                'Default',
                                'ResponderOnly',
                                'InitiatorOnly'
                              ],
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
                            enableBgp: {
                              type: 'boolean',
                              description: 'EnableBgp flag.'
                            },
                            usePolicyBasedTrafficSelectors: {
                              type: 'boolean',
                              description: 'Enable policy-based traffic selectors.'
                            },
                            ipsecPolicies: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                required: [Array],
                                description: 'An IPSec Policy configuration for a virtual network gateway connection.'
                              },
                              description: 'The IPSec Policies to be considered by this connection.'
                            },
                            enableRateLimiting: {
                              type: 'boolean',
                              description: 'EnableBgp flag.'
                            },
                            useLocalAzureIpAddress: {
                              type: 'boolean',
                              description: 'Use local azure ip to initiate connection.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the VPN site link connection resource.',
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
                            },
                            ingressNatRules: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              },
                              description: 'List of ingress NatRules.'
                            },
                            egressNatRules: {
                              type: 'array',
                              items: {
                                properties: [Object],
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
                      description: 'VpnSiteLinkConnection Resource.'
                    }
                  },
                  routingConfiguration: {
                    description: 'The Routing Configuration indicating the associated and propagated route tables on this connection.',
                    properties: {
                      associatedRouteTable: {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          }
                        },
                        description: 'Reference to another subresource.',
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
        },
        bgpSettings: {
          description: "Local network gateway's BGP speaker settings.",
          properties: {
            asn: {
              type: 'integer',
              format: 'int64',
              minimum: 0,
              maximum: 4294967295,
              description: "The BGP speaker's ASN."
            },
            bgpPeeringAddress: {
              type: 'string',
              description: 'The BGP peering address and BGP identifier of this BGP speaker.'
            },
            peerWeight: {
              type: 'integer',
              format: 'int32',
              description: 'The weight added to routes learned from this BGP speaker.'
            },
            bgpPeeringAddresses: {
              type: 'array',
              items: {
                properties: {
                  ipconfigurationId: {
                    type: 'string',
                    description: 'The ID of IP configuration which belongs to gateway.'
                  },
                  defaultBgpIpAddresses: {
                    readOnly: true,
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The list of default BGP peering addresses which belong to IP configuration.'
                  },
                  customBgpIpAddresses: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The list of custom BGP peering addresses which belong to IP configuration.'
                  },
                  tunnelIpAddresses: {
                    readOnly: true,
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The list of tunnel public IP addresses which belong to IP configuration.'
                  }
                },
                description: 'Properties of IPConfigurationBgpPeeringAddress.'
              },
              description: 'BGP peering address with IP configuration ID for virtual network gateway.'
            }
          }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the VPN gateway resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        vpnGatewayScaleUnit: {
          type: 'integer',
          format: 'int32',
          description: 'The scale unit for this vpn gateway.'
        },
        ipConfigurations: {
          type: 'array',
          readOnly: true,
          description: 'List of all IPs configured on the gateway.',
          items: {
            description: 'IP Configuration of a VPN Gateway Resource.',
            properties: {
              id: {
                type: 'string',
                description: 'The identifier of the IP configuration for a VPN Gateway.'
              },
              publicIpAddress: {
                type: 'string',
                description: 'The public IP address of this IP configuration.'
              },
              privateIpAddress: {
                type: 'string',
                description: 'The private IP address of this IP configuration.'
              }
            }
          }
        },
        enableBgpRouteTranslationForNat: {
          type: 'boolean',
          description: 'Enable BGP routes translation for NAT on this VpnGateway.'
        },
        isRoutingPreferenceInternet: {
          type: 'boolean',
          description: 'Enable Routing Preference property for the Public IP Interface of the VpnGateway.'
        },
        natRules: {
          type: 'array',
          description: 'List of all the nat Rules associated with the gateway.',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the VpnGateway NAT rule.',
                properties: {
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the NAT Rule resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  type: {
                    type: 'string',
                    description: 'The type of NAT rule for VPN NAT.',
                    enum: [ 'Static', 'Dynamic' ],
                    'x-ms-enum': { name: 'VpnNatRuleType', modelAsString: true }
                  },
                  mode: {
                    type: 'string',
                    description: 'The Source NAT direction of a VPN NAT.',
                    enum: [ 'EgressSnat', 'IngressSnat' ],
                    'x-ms-enum': { name: 'VpnNatRuleMode', modelAsString: true }
                  },
                  internalMappings: {
                    type: 'array',
                    items: {
                      properties: {
                        addressSpace: {
                          type: 'string',
                          description: 'Address space for Vpn NatRule mapping.'
                        },
                        portRange: {
                          type: 'string',
                          description: 'Port range for Vpn NatRule mapping.'
                        }
                      },
                      description: 'Vpn NatRule mapping.'
                    },
                    description: 'The private IP address internal mapping for NAT.'
                  },
                  externalMappings: {
                    type: 'array',
                    items: {
                      properties: {
                        addressSpace: {
                          type: 'string',
                          description: 'Address space for Vpn NatRule mapping.'
                        },
                        portRange: {
                          type: 'string',
                          description: 'Port range for Vpn NatRule mapping.'
                        }
                      },
                      description: 'Vpn NatRule mapping.'
                    },
                    description: 'The private IP address external mapping for NAT.'
                  },
                  ipConfigurationId: {
                    type: 'string',
                    description: 'The IP Configuration ID this NAT rule applies to.'
                  },
                  egressVpnSiteLinkConnections: {
                    type: 'array',
                    readOnly: true,
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'List of egress VpnSiteLinkConnections.'
                  },
                  ingressVpnSiteLinkConnections: {
                    type: 'array',
                    readOnly: true,
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'List of ingress VpnSiteLinkConnections.'
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
            description: 'VpnGatewayNatRule Resource.'
          }
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
  description: 'VpnGateway Resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
