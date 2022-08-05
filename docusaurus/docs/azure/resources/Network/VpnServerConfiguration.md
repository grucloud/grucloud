---
id: VpnServerConfiguration
title: VpnServerConfiguration
---
Provides a **VpnServerConfiguration** from the **Network** group
## Examples
### VpnServerConfigurationCreate
```js
exports.createResources = () => [
  {
    type: "VpnServerConfiguration",
    group: "Network",
    name: "myVpnServerConfiguration",
    properties: () => ({
      tags: { key1: "value1" },
      location: "West US",
      properties: {
        vpnProtocols: ["IkeV2"],
        vpnClientIpsecPolicies: [
          {
            saLifeTimeSeconds: 86472,
            saDataSizeKilobytes: 429497,
            ipsecEncryption: "AES256",
            ipsecIntegrity: "SHA256",
            ikeEncryption: "AES256",
            ikeIntegrity: "SHA384",
            dhGroup: "DHGroup14",
            pfsGroup: "PFS14",
          },
        ],
        configurationPolicyGroups: [
          {
            name: "policyGroup1",
            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnServerConfigurations/vpnServerConfiguration1/vpnServerConfigurationPolicyGroups/policyGroup1",
            properties: {
              isDefault: true,
              priority: 0,
              policyMembers: [
                {
                  name: "policy1",
                  attributeType: "RadiusAzureGroupId",
                  attributeValue: "6ad1bd08",
                },
              ],
            },
          },
          {
            name: "policyGroup2",
            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnServerConfigurations/vpnServerConfiguration1/vpnServerConfigurationPolicyGroups/policyGroup2",
            properties: {
              isDefault: true,
              priority: 0,
              policyMembers: [
                {
                  name: "policy2",
                  attributeType: "CertificateGroupId",
                  attributeValue: "red.com",
                },
              ],
            },
          },
        ],
        vpnClientRootCertificates: [
          {
            name: "vpnServerConfigVpnClientRootCert1",
            publicCertData:
              "MIIC5zCCAc+gAwIBAgIQErQ0Hk4aDJxIA+Q5RagB+jANBgkqhkiG9w0BAQsFADAWMRQwEgYDVQQDDAtQMlNSb290Q2VydDAeFw0xNzEyMTQyMTA3MzhaFw0xODEyMTQyMTI3MzhaMBYxFDASBgNVBAMMC1AyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArP7/NQXmW7cQ/ZR1mv3Y3I29Lt7HTOqzo/1KUOoVH3NItbQIRAQbwKy3UWrOFz4eGNX2GWtNRMdCyWsKeqy9Ltsdfcm1IbKXkl84DFeU/ZacXu4Dl3xX3gV5du4TLZjEowJELyur11Ea2YcjPRQ/FzAF9/hGuboS1HZQEPLx4FdUs9OxCYOtc0MxBCwLfVTTRqarb0Ne+arNYd4kCzIhAke1nOyKAJBda5ZL+VHy3S5S8qGlD46jm8HXugmAkUygS4oIIXOmj/1O9sNAi3LN60zufSzCmP8Rm/iUGX+DHAGGiXxwZOKQLEDaZXKqoHjMPP0XudmSWwOIbyeQVrLhkwIDAQABozEwLzAOBgNVHQ8BAf8EBAMCAgQwHQYDVR0OBBYEFEfeNU2trYxNLF9ONmuJUsT13pKDMA0GCSqGSIb3DQEBCwUAA4IBAQBmM6RJzsGGipxyMhimHKN2xlkejhVsgBoTAhOU0llW9aUSwINJ9zFUGgI8IzUFy1VG776fchHp0LMRmPSIUYk5btEPxbsrPtumPuMH8EQGrS+Rt4pD+78c8H1fEPkq5CmDl/PKu4JoFGv+aFcE+Od0hlILstIF10Qysf++QXDolKfzJa/56bgMeYKFiju73loiRM57ns8ddXpfLl792UVpRkFU62LNns6Y1LKTwapmUF4IvIuAIzd6LZNOQng64LAKXtKnViJ1JQiXwf4CEzhgvAti3/ejpb3U90hsrUcyZi6wBv9bZLcAJRWpz61JNYliM1d1grSwQDKGXNQE4xuN",
          },
        ],
        vpnClientRevokedCertificates: [
          {
            name: "vpnServerConfigVpnClientRevokedCert1",
            thumbprint: "83FFBFC8848B5A5836C94D0112367E16148A286F",
          },
        ],
        radiusServers: [
          {
            radiusServerAddress: "10.0.0.0",
            radiusServerScore: 25,
            radiusServerSecret: "radiusServerSecret",
          },
        ],
        radiusServerRootCertificates: [
          {
            name: "vpnServerConfigRadiusServerRootCer1",
            publicCertData:
              "MIIC5zCCAc+gAwIBAgIQErQ0Hk4aDJxIA+Q5RagB+jANBgkqhkiG9w0BAQsFADAWMRQwEgYDVQQDDAtQMlNSb290Q2VydDAeFw0xNzEyMTQyMTA3MzhaFw0xODEyMTQyMTI3MzhaMBYxFDASBgNVBAMMC1AyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArP7/NQXmW7cQ/ZR1mv3Y3I29Lt7HTOqzo/1KUOoVH3NItbQIRAQbwKy3UWrOFz4eGNX2GWtNRMdCyWsKeqy9Ltsdfcm1IbKXkl84DFeU/ZacXu4Dl3xX3gV5du4TLZjEowJELyur11Ea2YcjPRQ/FzAF9/hGuboS1HZQEPLx4FdUs9OxCYOtc0MxBCwLfVTTRqarb0Ne+arNYd4kCzIhAke1nOyKAJBda5ZL+VHy3S5S8qGlD46jm8HXugmAkUygS4oIIXOmj/1O9sNAi3LN60zufSzCmP8Rm/iUGX+DHAGGiXxwZOKQLEDaZXKqoHjMPP0XudmSWwOIbyeQVrLhkwIDAQABozEwLzAOBgNVHQ8BAf8EBAMCAgQwHQYDVR0OBBYEFEfeNU2trYxNLF9ONmuJUsT13pKDMA0GCSqGSIb3DQEBCwUAA4IBAQBmM6RJzsGGipxyMhimHKN2xlkejhVsgBoTAhOU0llW9aUSwINJ9zFUGgI8IzUFy1VG776fchHp0LMRmPSIUYk5btEPxbsrPtumPuMH8EQGrS+Rt4pD+78c8H1fEPkq5CmDl/PKu4JoFGv+aFcE+Od0hlILstIF10Qysf++QXDolKfzJa/56bgMeYKFiju73loiRM57ns8ddXpfLl792UVpRkFU62LNns6Y1LKTwapmUF4IvIuAIzd6LZNOQng64LAKXtKnViJ1JQiXwf4CEzhgvAti3/ejpb3U90hsrUcyZi6wBv9bZLcAJRWpz61JNYliM1d1grSwQDKGXNQE4xuM",
          },
        ],
        radiusClientRootCertificates: [
          {
            name: "vpnServerConfigRadiusClientRootCert1",
            thumbprint: "83FFBFC8848B5A5836C94D0112367E16148A286F",
          },
        ],
      },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the P2SVpnServer configuration.',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the VpnServerConfiguration that is unique within a resource group.'
        },
        vpnProtocols: {
          type: 'array',
          items: {
            type: 'string',
            description: 'VPN protocol enabled for the VpnServerConfiguration.',
            enum: [ 'IkeV2', 'OpenVPN' ],
            'x-ms-enum': {
              name: 'VpnGatewayTunnelingProtocol',
              modelAsString: true
            }
          },
          description: 'VPN protocols for the VpnServerConfiguration.'
        },
        vpnAuthenticationTypes: {
          type: 'array',
          items: {
            type: 'string',
            description: 'VPN authentication types enabled for the VpnServerConfiguration.',
            enum: [ 'Certificate', 'Radius', 'AAD' ],
            'x-ms-enum': { name: 'VpnAuthenticationType', modelAsString: true }
          },
          description: 'VPN authentication types for the VpnServerConfiguration.'
        },
        vpnClientRootCertificates: {
          type: 'array',
          items: {
            properties: {
              name: { type: 'string', description: 'The certificate name.' },
              publicCertData: {
                type: 'string',
                description: 'The certificate public data.'
              }
            },
            description: 'Properties of VPN client root certificate of VpnServerConfiguration.'
          },
          description: 'VPN client root certificate of VpnServerConfiguration.'
        },
        vpnClientRevokedCertificates: {
          type: 'array',
          items: {
            properties: {
              name: { type: 'string', description: 'The certificate name.' },
              thumbprint: {
                type: 'string',
                description: 'The revoked VPN client certificate thumbprint.'
              }
            },
            description: 'Properties of the revoked VPN client certificate of VpnServerConfiguration.'
          },
          description: 'VPN client revoked certificate of VpnServerConfiguration.'
        },
        radiusServerRootCertificates: {
          type: 'array',
          items: {
            properties: {
              name: { type: 'string', description: 'The certificate name.' },
              publicCertData: {
                type: 'string',
                description: 'The certificate public data.'
              }
            },
            description: 'Properties of Radius Server root certificate of VpnServerConfiguration.'
          },
          description: 'Radius Server root certificate of VpnServerConfiguration.'
        },
        radiusClientRootCertificates: {
          type: 'array',
          items: {
            properties: {
              name: { type: 'string', description: 'The certificate name.' },
              thumbprint: {
                type: 'string',
                description: 'The Radius client root certificate thumbprint.'
              }
            },
            description: 'Properties of the Radius client root certificate of VpnServerConfiguration.'
          },
          description: 'Radius client root certificate of VpnServerConfiguration.'
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
          description: 'VpnClientIpsecPolicies for VpnServerConfiguration.'
        },
        radiusServerAddress: {
          type: 'string',
          description: 'The radius server address property of the VpnServerConfiguration resource for point to site client connection.'
        },
        radiusServerSecret: {
          type: 'string',
          description: 'The radius secret property of the VpnServerConfiguration resource for point to site client connection.'
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
          description: 'Multiple Radius Server configuration for VpnServerConfiguration.'
        },
        aadAuthenticationParameters: {
          description: 'The set of aad vpn authentication parameters.',
          properties: {
            aadTenant: {
              type: 'string',
              description: 'AAD Vpn authentication parameter AAD tenant.'
            },
            aadAudience: {
              type: 'string',
              description: 'AAD Vpn authentication parameter AAD audience.'
            },
            aadIssuer: {
              type: 'string',
              description: 'AAD Vpn authentication parameter AAD issuer.'
            }
          }
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: "The provisioning state of the VpnServerConfiguration resource. Possible values are: 'Updating', 'Deleting', and 'Failed'."
        },
        p2SVpnGateways: {
          type: 'array',
          readOnly: true,
          items: {
            required: [ 'location' ],
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the P2SVpnGateway.',
                properties: {
                  virtualHub: {
                    description: 'The VirtualHub to which the gateway belongs.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
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
                              properties: { addressPrefixes: [Object] }
                            },
                            routingConfiguration: {
                              description: 'The Routing Configuration indicating the associated and propagated route tables on this connection.',
                              properties: {
                                associatedRouteTable: [Object],
                                propagatedRouteTables: [Object],
                                vnetRoutes: [Object]
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
                                properties: [Object],
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
                                properties: [Object],
                                allOf: [Array],
                                description: 'VpnServerConfigurationPolicyGroup Resource.'
                              },
                              description: 'List of previous Configuration Policy Groups that this P2SConnectionConfiguration was attached to.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the P2SConnectionConfiguration resource.',
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
                          type: 'string',
                          readOnly: true,
                          description: 'A unique read-only string that changes whenever the resource is updated.'
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
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
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
          },
          description: 'List of references to P2SVpnGateways.'
        },
        configurationPolicyGroups: {
          type: 'array',
          description: 'List of all VpnServerConfigurationPolicyGroups.',
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
                      properties: {
                        name: {
                          type: 'string',
                          description: 'Name of the VpnServerConfigurationPolicyGroupMember.'
                        },
                        attributeType: {
                          type: 'string',
                          description: 'The Vpn Policy member attribute type.',
                          enum: [
                            'CertificateGroupId',
                            'AADGroupId',
                            'RadiusAzureGroupId'
                          ],
                          'x-ms-enum': {
                            name: 'VpnPolicyMemberAttributeType',
                            modelAsString: true
                          }
                        },
                        attributeValue: {
                          type: 'string',
                          description: 'The value of Attribute used for this VpnServerConfigurationPolicyGroupMember.'
                        }
                      },
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
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'List of references to P2SConnectionConfigurations.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the VpnServerConfigurationPolicyGroup resource.',
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
            description: 'VpnServerConfigurationPolicyGroup Resource.'
          }
        },
        etag: {
          readOnly: true,
          type: 'string',
          description: 'A unique read-only string that changes whenever the resource is updated.'
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
  description: 'VpnServerConfiguration Resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualWan.json).
