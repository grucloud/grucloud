---
id: VirtualNetworkGateway
title: VirtualNetworkGateway
---
Provides a **VirtualNetworkGateway** from the **Network** group
## Examples
### UpdateVirtualNetworkGateway
```js
provider.Network.makeVirtualNetworkGateway({
  name: "myVirtualNetworkGateway",
  properties: () => ({
    properties: {
      ipConfigurations: [
        {
          properties: {
            privateIPAllocationMethod: "Dynamic",
            subnet: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/GatewaySubnet",
            },
            publicIPAddress: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/gwpip",
            },
          },
          name: "gwipconfig1",
        },
      ],
      gatewayType: "Vpn",
      vpnType: "RouteBased",
      enableBgp: false,
      activeActive: false,
      disableIPSecReplayProtection: false,
      enableDnsForwarding: true,
      natRules: [
        {
          name: "natRule1",
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vpngw/natRules/natRule1",
          properties: {
            type: "Static",
            mode: "EgressSnat",
            ipConfigurationId: "",
            internalMappings: [{ addressSpace: "10.10.0.0/24" }],
            externalMappings: [{ addressSpace: "50.0.0.0/24" }],
          },
        },
        {
          name: "natRule2",
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vpngw/natRules/natRule2",
          properties: {
            type: "Static",
            mode: "IngressSnat",
            ipConfigurationId: "",
            internalMappings: [{ addressSpace: "20.10.0.0/24" }],
            externalMappings: [{ addressSpace: "30.0.0.0/24" }],
          },
        },
      ],
      enableBgpRouteTranslationForNat: false,
      sku: { name: "VpnGw1", tier: "VpnGw1" },
      vpnClientConfiguration: {
        vpnClientProtocols: ["OpenVPN"],
        vpnClientRootCertificates: [],
        vpnClientRevokedCertificates: [],
        radiusServers: [
          {
            radiusServerAddress: "10.2.0.0",
            radiusServerScore: 20,
            radiusServerSecret: "radiusServerSecret",
          },
        ],
      },
      bgpSettings: {
        asn: 65515,
        bgpPeeringAddress: "10.0.1.30",
        peerWeight: 0,
      },
      customRoutes: { addressPrefixes: ["101.168.0.6/32"] },
    },
    location: "centralus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
    publicIpAddress: resources.Network.PublicIPAddress["myPublicIPAddress"],
    virtualHubIpConfiguration:
      resources.Network.VirtualHubIpConfiguration[
        "myVirtualHubIpConfiguration"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
- [PublicIPAddress](../Network/PublicIPAddress.md)
- [VirtualHubIpConfiguration](../Network/VirtualHubIpConfiguration.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the virtual network gateway.',
      properties: {
        ipConfigurations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the virtual network gateway ip configuration.',
                properties: {
                  privateIPAllocationMethod: {
                    description: 'The private IP address allocation method.',
                    type: 'string',
                    enum: [ 'Static', 'Dynamic' ],
                    'x-ms-enum': { name: 'IPAllocationMethod', modelAsString: true }
                  },
                  subnet: {
                    description: 'The reference to the subnet resource.',
                    properties: { id: [Object] },
                    'x-ms-azure-resource': true
                  },
                  publicIPAddress: {
                    description: 'The reference to the public IP resource.',
                    properties: { id: [Object] },
                    'x-ms-azure-resource': true
                  },
                  privateIPAddress: {
                    readOnly: true,
                    type: 'string',
                    description: 'Private IP Address for this gateway.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the virtual network gateway IP configuration resource.',
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
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'IP configuration for virtual network gateway.'
          },
          description: 'IP configurations for virtual network gateway.'
        },
        gatewayType: {
          type: 'string',
          description: 'The type of this virtual network gateway.',
          enum: [ 'Vpn', 'ExpressRoute', 'LocalGateway' ],
          'x-ms-enum': { name: 'VirtualNetworkGatewayType', modelAsString: true }
        },
        vpnType: {
          type: 'string',
          description: 'The type of this virtual network gateway.',
          enum: [ 'PolicyBased', 'RouteBased' ],
          'x-ms-enum': { name: 'VpnType', modelAsString: true }
        },
        vpnGatewayGeneration: {
          type: 'string',
          description: 'The generation for this VirtualNetworkGateway. Must be None if gatewayType is not VPN.',
          enum: [ 'None', 'Generation1', 'Generation2' ],
          'x-ms-enum': { name: 'VpnGatewayGeneration', modelAsString: true }
        },
        enableBgp: {
          type: 'boolean',
          description: 'Whether BGP is enabled for this virtual network gateway or not.'
        },
        enablePrivateIpAddress: {
          type: 'boolean',
          description: 'Whether private IP needs to be enabled on this gateway for connections or not.'
        },
        activeActive: { type: 'boolean', description: 'ActiveActive flag.' },
        disableIPSecReplayProtection: {
          type: 'boolean',
          description: 'disableIPSecReplayProtection flag.'
        },
        gatewayDefaultSite: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        sku: {
          description: 'The reference to the VirtualNetworkGatewaySku resource which represents the SKU selected for Virtual network gateway.',
          properties: {
            name: {
              type: 'string',
              description: 'Gateway SKU name.',
              enum: [
                'Basic',    'HighPerformance',
                'Standard', 'UltraPerformance',
                'VpnGw1',   'VpnGw2',
                'VpnGw3',   'VpnGw4',
                'VpnGw5',   'VpnGw1AZ',
                'VpnGw2AZ', 'VpnGw3AZ',
                'VpnGw4AZ', 'VpnGw5AZ',
                'ErGw1AZ',  'ErGw2AZ',
                'ErGw3AZ'
              ],
              'x-ms-enum': {
                name: 'VirtualNetworkGatewaySkuName',
                modelAsString: true
              }
            },
            tier: {
              type: 'string',
              description: 'Gateway SKU tier.',
              enum: [
                'Basic',    'HighPerformance',
                'Standard', 'UltraPerformance',
                'VpnGw1',   'VpnGw2',
                'VpnGw3',   'VpnGw4',
                'VpnGw5',   'VpnGw1AZ',
                'VpnGw2AZ', 'VpnGw3AZ',
                'VpnGw4AZ', 'VpnGw5AZ',
                'ErGw1AZ',  'ErGw2AZ',
                'ErGw3AZ'
              ],
              'x-ms-enum': {
                name: 'VirtualNetworkGatewaySkuTier',
                modelAsString: true
              }
            },
            capacity: {
              readOnly: true,
              type: 'integer',
              format: 'int32',
              description: 'The capacity.'
            }
          }
        },
        vpnClientConfiguration: {
          description: 'The reference to the VpnClientConfiguration resource which represents the P2S VpnClient configurations.',
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
            vpnClientRootCertificates: {
              type: 'array',
              items: {
                properties: {
                  properties: {
                    'x-ms-client-flatten': true,
                    description: 'Properties of the vpn client root certificate.',
                    properties: {
                      publicCertData: [Object],
                      provisioningState: [Object]
                    },
                    required: [ 'publicCertData' ]
                  },
                  name: {
                    type: 'string',
                    description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                  },
                  etag: {
                    readOnly: true,
                    type: 'string',
                    description: 'A unique read-only string that changes whenever the resource is updated.'
                  }
                },
                allOf: [
                  {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  }
                ],
                required: [ 'properties' ],
                description: 'VPN client root certificate of virtual network gateway.'
              },
              description: 'VpnClientRootCertificate for virtual network gateway.'
            },
            vpnClientRevokedCertificates: {
              type: 'array',
              items: {
                properties: {
                  properties: {
                    'x-ms-client-flatten': true,
                    description: 'Properties of the vpn client revoked certificate.',
                    properties: {
                      thumbprint: [Object],
                      provisioningState: [Object]
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
                  }
                },
                allOf: [
                  {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  }
                ],
                description: 'VPN client revoked certificate of virtual network gateway.'
              },
              description: 'VpnClientRevokedCertificate for Virtual network gateway.'
            },
            vpnClientProtocols: {
              type: 'array',
              items: {
                type: 'string',
                description: 'VPN client protocol enabled for the virtual network gateway.',
                enum: [ 'IkeV2', 'SSTP', 'OpenVPN' ],
                'x-ms-enum': { name: 'VpnClientProtocol', modelAsString: true }
              },
              description: 'VpnClientProtocols for Virtual network gateway.'
            },
            vpnAuthenticationTypes: {
              type: 'array',
              items: {
                type: 'string',
                description: 'VPN authentication types enabled for the virtual network gateway.',
                enum: [ 'Certificate', 'Radius', 'AAD' ],
                'x-ms-enum': { name: 'VpnAuthenticationType', modelAsString: true }
              },
              description: 'VPN authentication types for the virtual network gateway..'
            },
            vpnClientIpsecPolicies: {
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
              description: 'VpnClientIpsecPolicies for virtual network gateway P2S client.'
            },
            radiusServerAddress: {
              type: 'string',
              description: 'The radius server address property of the VirtualNetworkGateway resource for vpn client connection.'
            },
            radiusServerSecret: {
              type: 'string',
              description: 'The radius secret property of the VirtualNetworkGateway resource for vpn client connection.'
            },
            radiusServers: {
              type: 'array',
              items: {
                properties: {
                  radiusServerAddress: {
                    type: 'string',
                    description: 'The address of this radius server.'
                  },
                  radiusServerScore: {
                    type: 'integer',
                    format: 'int64',
                    description: 'The initial score assigned to this radius server.'
                  },
                  radiusServerSecret: {
                    type: 'string',
                    description: 'The secret used for this radius server.'
                  }
                },
                required: [ 'radiusServerAddress' ],
                description: 'Radius Server Settings.'
              },
              description: 'The radiusServers property for multiple radius server configuration.'
            },
            aadTenant: {
              type: 'string',
              description: 'The AADTenant property of the VirtualNetworkGateway resource for vpn client connection used for AAD authentication.'
            },
            aadAudience: {
              type: 'string',
              description: 'The AADAudience property of the VirtualNetworkGateway resource for vpn client connection used for AAD authentication.'
            },
            aadIssuer: {
              type: 'string',
              description: 'The AADIssuer property of the VirtualNetworkGateway resource for vpn client connection used for AAD authentication.'
            }
          }
        },
        bgpSettings: {
          description: "Virtual network gateway's BGP speaker settings.",
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
        customRoutes: {
          description: 'The reference to the address space resource which represents the custom routes address space specified by the customer for virtual network gateway and VpnClient.',
          properties: {
            addressPrefixes: {
              type: 'array',
              items: { type: 'string' },
              description: 'A list of address blocks reserved for this virtual network in CIDR notation.'
            }
          }
        },
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resource GUID property of the virtual network gateway resource.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the virtual network gateway resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        enableDnsForwarding: {
          type: 'boolean',
          description: 'Whether dns forwarding is enabled or not.'
        },
        inboundDnsForwardingEndpoint: {
          type: 'string',
          readOnly: true,
          description: 'The IP address allocated by the gateway to which dns requests can be sent.'
        },
        vNetExtendedLocationResourceId: {
          type: 'string',
          description: 'Customer vnet resource id. VirtualNetworkGateway of type local gateway is associated with the customer vnet.'
        },
        natRules: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the Virtual Network Gateway NAT rule.',
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
                      properties: [Object],
                      description: 'Vpn NatRule mapping.'
                    },
                    description: 'The private IP address internal mapping for NAT.'
                  },
                  externalMappings: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      description: 'Vpn NatRule mapping.'
                    },
                    description: 'The private IP address external mapping for NAT.'
                  },
                  ipConfigurationId: {
                    type: 'string',
                    description: 'The IP Configuration ID this NAT rule applies to.'
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
            description: 'VirtualNetworkGatewayNatRule Resource.'
          },
          description: 'NatRules for virtual network gateway.'
        },
        enableBgpRouteTranslationForNat: {
          type: 'boolean',
          description: 'EnableBgpRouteTranslationForNat flag.'
        }
      }
    },
    extendedLocation: {
      description: 'The extended location of type local virtual network gateway.',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the extended location.'
        },
        type: {
          description: 'The type of the extended location.',
          type: 'string',
          enum: [ 'EdgeZone' ],
          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }
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
  required: [ 'properties' ],
  description: 'A common class for general resource information.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualNetworkGateway.json).
