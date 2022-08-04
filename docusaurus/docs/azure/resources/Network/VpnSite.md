---
id: VpnSite
title: VpnSite
---
Provides a **VpnSite** from the **Network** group
## Examples
### VpnSiteCreate
```js
exports.createResources = () => [
  {
    type: "VpnSite",
    group: "Network",
    name: "myVpnSite",
    properties: () => ({
      tags: { key1: "value1" },
      location: "West US",
      properties: {
        virtualWan: {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualWANs/wan1",
        },
        addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
        isSecuritySite: false,
        vpnSiteLinks: [
          {
            name: "vpnSiteLink1",
            properties: {
              ipAddress: "50.50.50.56",
              fqdn: "link1.vpnsite1.contoso.com",
              linkProperties: {
                linkProviderName: "vendor1",
                linkSpeedInMbps: 0,
              },
              bgpProperties: { bgpPeeringAddress: "192.168.0.0", asn: 1234 },
            },
          },
        ],
        o365Policy: {
          breakOutCategories: { allow: true, optimize: true, default: false },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualWan: "myVirtualWan",
      virtualHubIpConfiguration: ["myVirtualHubIpConfiguration"],
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualWan](../Network/VirtualWan.md)
- [VirtualHubIpConfiguration](../Network/VirtualHubIpConfiguration.md)
## Swagger Schema
```js
{
  required: [ 'location' ],
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the VPN site.',
      properties: {
        virtualWan: {
          description: 'The VirtualWAN to which the vpnSite belongs.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        deviceProperties: {
          description: 'The device properties.',
          properties: {
            deviceVendor: {
              type: 'string',
              description: 'Name of the device Vendor.'
            },
            deviceModel: { type: 'string', description: 'Model of the device.' },
            linkSpeedInMbps: {
              type: 'integer',
              format: 'int32',
              description: 'Link speed.'
            }
          }
        },
        ipAddress: {
          type: 'string',
          description: 'The ip-address for the vpn-site.'
        },
        siteKey: {
          type: 'string',
          description: 'The key for vpn-site that can be used for connections.'
        },
        addressSpace: {
          description: 'The AddressSpace that contains an array of IP address ranges.',
          properties: {
            addressPrefixes: {
              type: 'array',
              items: { type: 'string' },
              description: 'A list of address blocks reserved for this virtual network in CIDR notation.'
            }
          }
        },
        bgpProperties: {
          description: 'The set of bgp properties.',
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
          description: 'The provisioning state of the VPN site resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        isSecuritySite: { type: 'boolean', description: 'IsSecuritySite flag.' },
        vpnSiteLinks: {
          type: 'array',
          description: 'List of all vpn site links.',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the VPN site link.',
                properties: {
                  linkProperties: {
                    description: 'The link provider properties.',
                    properties: {
                      linkProviderName: {
                        type: 'string',
                        description: 'Name of the link provider.'
                      },
                      linkSpeedInMbps: {
                        type: 'integer',
                        format: 'int32',
                        description: 'Link speed.'
                      }
                    }
                  },
                  ipAddress: {
                    type: 'string',
                    description: 'The ip-address for the vpn-site-link.'
                  },
                  fqdn: {
                    type: 'string',
                    description: 'FQDN of vpn-site-link.'
                  },
                  bgpProperties: {
                    description: 'The set of bgp properties.',
                    properties: {
                      asn: {
                        type: 'integer',
                        format: 'int64',
                        description: "The BGP speaker's ASN."
                      },
                      bgpPeeringAddress: {
                        type: 'string',
                        description: 'The BGP peering address and BGP identifier of this BGP speaker.'
                      }
                    }
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the VPN site link resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
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
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'VpnSiteLink Resource.'
          }
        },
        o365Policy: {
          readOnly: false,
          description: 'Office365 Policy.',
          properties: {
            breakOutCategories: {
              readOnly: false,
              description: 'Office365 breakout categories.',
              properties: {
                allow: {
                  type: 'boolean',
                  readOnly: false,
                  description: 'Flag to control allow category.'
                },
                optimize: {
                  type: 'boolean',
                  readOnly: false,
                  description: 'Flag to control optimize category.'
                },
                default: {
                  type: 'boolean',
                  readOnly: false,
                  description: 'Flag to control default category.'
                }
              }
            }
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
  description: 'VpnSite Resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualWan.json).
