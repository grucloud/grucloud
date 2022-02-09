---
id: P2sVpnServerConfiguration
title: P2sVpnServerConfiguration
---
Provides a **P2sVpnServerConfiguration** from the **Network** group
## Examples
### P2SVpnServerConfigurationPut
```js
exports.createResources = () => [
  {
    type: "P2sVpnServerConfiguration",
    group: "Network",
    name: "myP2sVpnServerConfiguration",
    properties: () => ({
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
        p2SVpnServerConfigVpnClientRootCertificates: [
          {
            name: "p2sVpnServerConfigVpnClientRootCert1",
            properties: {
              publicCertData:
                "MIIC5zCCAc+gAwIBAgIQErQ0Hk4aDJxIA+Q5RagB+jANBgkqhkiG9w0BAQsFADAWMRQwEgYDVQQDDAtQMlNSb290Q2VydDAeFw0xNzEyMTQyMTA3MzhaFw0xODEyMTQyMTI3MzhaMBYxFDASBgNVBAMMC1AyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArP7/NQXmW7cQ/ZR1mv3Y3I29Lt7HTOqzo/1KUOoVH3NItbQIRAQbwKy3UWrOFz4eGNX2GWtNRMdCyWsKeqy9Ltsdfcm1IbKXkl84DFeU/ZacXu4Dl3xX3gV5du4TLZjEowJELyur11Ea2YcjPRQ/FzAF9/hGuboS1HZQEPLx4FdUs9OxCYOtc0MxBCwLfVTTRqarb0Ne+arNYd4kCzIhAke1nOyKAJBda5ZL+VHy3S5S8qGlD46jm8HXugmAkUygS4oIIXOmj/1O9sNAi3LN60zufSzCmP8Rm/iUGX+DHAGGiXxwZOKQLEDaZXKqoHjMPP0XudmSWwOIbyeQVrLhkwIDAQABozEwLzAOBgNVHQ8BAf8EBAMCAgQwHQYDVR0OBBYEFEfeNU2trYxNLF9ONmuJUsT13pKDMA0GCSqGSIb3DQEBCwUAA4IBAQBmM6RJzsGGipxyMhimHKN2xlkejhVsgBoTAhOU0llW9aUSwINJ9zFUGgI8IzUFy1VG776fchHp0LMRmPSIUYk5btEPxbsrPtumPuMH8EQGrS+Rt4pD+78c8H1fEPkq5CmDl/PKu4JoFGv+aFcE+Od0hlILstIF10Qysf++QXDolKfzJa/56bgMeYKFiju73loiRM57ns8ddXpfLl792UVpRkFU62LNns6Y1LKTwapmUF4IvIuAIzd6LZNOQng64LAKXtKnViJ1JQiXwf4CEzhgvAti3/ejpb3U90hsrUcyZi6wBv9bZLcAJRWpz61JNYliM1d1grSwQDKGXNQE4xuN",
            },
          },
        ],
        p2SVpnServerConfigVpnClientRevokedCertificates: [
          {
            name: "p2sVpnServerConfigVpnClientRevokedCert1",
            properties: {
              thumbprint: "83FFBFC8848B5A5836C94D0112367E16148A286F",
            },
          },
        ],
        radiusServerAddress: "8.9.9.9",
        radiusServerSecret: "<radiusServerSecret>",
        p2SVpnServerConfigRadiusServerRootCertificates: [
          {
            name: "p2sVpnServerConfigRadiusServerRootCert1",
            properties: {
              publicCertData:
                "MIIC5zCCAc+gAwIBAgIQErQ0Hk4aDJxIA+Q5RagB+jANBgkqhkiG9w0BAQsFADAWMRQwEgYDVQQDDAtQMlNSb290Q2VydDAeFw0xNzEyMTQyMTA3MzhaFw0xODEyMTQyMTI3MzhaMBYxFDASBgNVBAMMC1AyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArP7/NQXmW7cQ/ZR1mv3Y3I29Lt7HTOqzo/1KUOoVH3NItbQIRAQbwKy3UWrOFz4eGNX2GWtNRMdCyWsKeqy9Ltsdfcm1IbKXkl84DFeU/ZacXu4Dl3xX3gV5du4TLZjEowJELyur11Ea2YcjPRQ/FzAF9/hGuboS1HZQEPLx4FdUs9OxCYOtc0MxBCwLfVTTRqarb0Ne+arNYd4kCzIhAke1nOyKAJBda5ZL+VHy3S5S8qGlD46jm8HXugmAkUygS4oIIXOmj/1O9sNAi3LN60zufSzCmP8Rm/iUGX+DHAGGiXxwZOKQLEDaZXKqoHjMPP0XudmSWwOIbyeQVrLhkwIDAQABozEwLzAOBgNVHQ8BAf8EBAMCAgQwHQYDVR0OBBYEFEfeNU2trYxNLF9ONmuJUsT13pKDMA0GCSqGSIb3DQEBCwUAA4IBAQBmM6RJzsGGipxyMhimHKN2xlkejhVsgBoTAhOU0llW9aUSwINJ9zFUGgI8IzUFy1VG776fchHp0LMRmPSIUYk5btEPxbsrPtumPuMH8EQGrS+Rt4pD+78c8H1fEPkq5CmDl/PKu4JoFGv+aFcE+Od0hlILstIF10Qysf++QXDolKfzJa/56bgMeYKFiju73loiRM57ns8ddXpfLl792UVpRkFU62LNns6Y1LKTwapmUF4IvIuAIzd6LZNOQng64LAKXtKnViJ1JQiXwf4CEzhgvAti3/ejpb3U90hsrUcyZi6wBv9bZLcAJRWpz61JNYliM1d1grSwQDKGXNQE4xuM",
            },
          },
        ],
        p2SVpnServerConfigRadiusClientRootCertificates: [
          {
            name: "p2sVpnServerConfigRadiusClientRootCert1",
            properties: {
              thumbprint: "83FFBFC8848B5A5836C94D0112367E16148A286F",
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualWan: "myVirtualWan",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualWan](../Network/VirtualWan.md)
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
          description: 'The name of the P2SVpnServerConfiguration that is unique within a VirtualWan in a resource group. This name can be used to access the resource along with Paren VirtualWan resource name.'
        },
        vpnProtocols: {
          type: 'array',
          items: {
            type: 'string',
            description: 'VPN protocol enabled for the P2SVpnServerConfiguration.',
            enum: [ 'IkeV2', 'OpenVPN' ],
            'x-ms-enum': {
              name: 'VpnGatewayTunnelingProtocol',
              modelAsString: true
            }
          },
          description: 'VPN protocols for the P2SVpnServerConfiguration.'
        },
        p2SVpnServerConfigVpnClientRootCertificates: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the P2SVpnServerConfiguration VPN client root certificate.',
                properties: {
                  publicCertData: {
                    type: 'string',
                    description: 'The certificate public data.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the VPN client root certificate resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                },
                required: [ 'publicCertData' ]
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
              },
              etag: {
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
            required: [ 'properties' ],
            description: 'VPN client root certificate of P2SVpnServerConfiguration.'
          },
          description: 'VPN client root certificate of P2SVpnServerConfiguration.'
        },
        p2SVpnServerConfigVpnClientRevokedCertificates: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the vpn client revoked certificate.',
                properties: {
                  thumbprint: {
                    type: 'string',
                    description: 'The revoked VPN client certificate thumbprint.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the VPN client revoked certificate resource.',
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
            description: 'VPN client revoked certificate of P2SVpnServerConfiguration.'
          },
          description: 'VPN client revoked certificate of P2SVpnServerConfiguration.'
        },
        p2SVpnServerConfigRadiusServerRootCertificates: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the P2SVpnServerConfiguration Radius Server root certificate.',
                properties: {
                  publicCertData: {
                    type: 'string',
                    description: 'The certificate public data.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the radius server root certificate resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                },
                required: [ 'publicCertData' ]
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
              },
              etag: {
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
            required: [ 'properties' ],
            description: 'Radius Server root certificate of P2SVpnServerConfiguration.'
          },
          description: 'Radius Server root certificate of P2SVpnServerConfiguration.'
        },
        p2SVpnServerConfigRadiusClientRootCertificates: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the Radius client root certificate.',
                properties: {
                  thumbprint: {
                    type: 'string',
                    description: 'The Radius client root certificate thumbprint.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the radius client root certificate resource.',
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
            description: 'Radius client root certificate of P2SVpnServerConfiguration.'
          },
          description: 'Radius client root certificate of P2SVpnServerConfiguration.'
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
          description: 'VpnClientIpsecPolicies for P2SVpnServerConfiguration.'
        },
        radiusServerAddress: {
          type: 'string',
          description: 'The radius server address property of the P2SVpnServerConfiguration resource for point to site client connection.'
        },
        radiusServerSecret: {
          type: 'string',
          description: 'The radius secret property of the P2SVpnServerConfiguration resource for point to site client connection.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the P2S VPN server configuration resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        p2SVpnGateways: {
          type: 'array',
          readOnly: true,
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'List of references to P2SVpnGateways.'
        },
        etag: {
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
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'P2SVpnServerConfiguration Resource.'
}
```
## Misc
The resource version is `2019-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2019-07-01/virtualWan.json).
