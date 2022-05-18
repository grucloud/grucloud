"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5295],{3905:function(e,n,r){r.d(n,{Zo:function(){return u},kt:function(){return g}});var t=r(67294);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function s(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function a(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var p=t.createContext({}),c=function(e){var n=t.useContext(p),r=n;return e&&(r="function"==typeof e?e(n):s(s({},n),e)),r},u=function(e){var n=c(e.components);return t.createElement(p.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},l=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),l=c(r),g=i,y=l["".concat(p,".").concat(g)]||l[g]||d[g]||o;return r?t.createElement(y,s(s({ref:n},u),{},{components:r})):t.createElement(y,s({ref:n},u))}));function g(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=r.length,s=new Array(o);s[0]=l;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a.mdxType="string"==typeof e?e:i,s[1]=a;for(var c=2;c<o;c++)s[c]=r[c];return t.createElement.apply(null,s)}return t.createElement.apply(null,r)}l.displayName="MDXCreateElement"},79073:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return a},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return u},default:function(){return l}});var t=r(87462),i=r(63366),o=(r(67294),r(3905)),s=["components"],a={id:"VpnServerConfiguration",title:"VpnServerConfiguration"},p=void 0,c={unversionedId:"azure/resources/Network/VpnServerConfiguration",id:"azure/resources/Network/VpnServerConfiguration",isDocsHomePage:!1,title:"VpnServerConfiguration",description:"Provides a VpnServerConfiguration from the Network group",source:"@site/docs/azure/resources/Network/VpnServerConfiguration.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/VpnServerConfiguration",permalink:"/docs/azure/resources/Network/VpnServerConfiguration",tags:[],version:"current",frontMatter:{id:"VpnServerConfiguration",title:"VpnServerConfiguration"},sidebar:"docs",previous:{title:"VpnGateway",permalink:"/docs/azure/resources/Network/VpnGateway"},next:{title:"VpnSite",permalink:"/docs/azure/resources/Network/VpnSite"}},u=[{value:"Examples",id:"examples",children:[{value:"VpnServerConfigurationCreate",id:"vpnserverconfigurationcreate",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],d={toc:u};function l(e){var n=e.components,r=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,t.Z)({},d,r,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"VpnServerConfiguration")," from the ",(0,o.kt)("strong",{parentName:"p"},"Network")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"vpnserverconfigurationcreate"},"VpnServerConfigurationCreate"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VpnServerConfiguration",\n    group: "Network",\n    name: "myVpnServerConfiguration",\n    properties: () => ({\n      tags: { key1: "value1" },\n      location: "West US",\n      properties: {\n        vpnProtocols: ["IkeV2"],\n        vpnClientIpsecPolicies: [\n          {\n            saLifeTimeSeconds: 86472,\n            saDataSizeKilobytes: 429497,\n            ipsecEncryption: "AES256",\n            ipsecIntegrity: "SHA256",\n            ikeEncryption: "AES256",\n            ikeIntegrity: "SHA384",\n            dhGroup: "DHGroup14",\n            pfsGroup: "PFS14",\n          },\n        ],\n        configurationPolicyGroups: [\n          {\n            name: "policyGroup1",\n            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnServerConfigurations/vpnServerConfiguration1/vpnServerConfigurationPolicyGroups/policyGroup1",\n            properties: {\n              isDefault: true,\n              priority: 0,\n              policyMembers: [\n                {\n                  name: "policy1",\n                  attributeType: "RadiusAzureGroupId",\n                  attributeValue: "6ad1bd08",\n                },\n              ],\n            },\n          },\n          {\n            name: "policyGroup2",\n            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnServerConfigurations/vpnServerConfiguration1/vpnServerConfigurationPolicyGroups/policyGroup2",\n            properties: {\n              isDefault: true,\n              priority: 0,\n              policyMembers: [\n                {\n                  name: "policy2",\n                  attributeType: "CertificateGroupId",\n                  attributeValue: "red.com",\n                },\n              ],\n            },\n          },\n        ],\n        vpnClientRootCertificates: [\n          {\n            name: "vpnServerConfigVpnClientRootCert1",\n            publicCertData:\n              "MIIC5zCCAc+gAwIBAgIQErQ0Hk4aDJxIA+Q5RagB+jANBgkqhkiG9w0BAQsFADAWMRQwEgYDVQQDDAtQMlNSb290Q2VydDAeFw0xNzEyMTQyMTA3MzhaFw0xODEyMTQyMTI3MzhaMBYxFDASBgNVBAMMC1AyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArP7/NQXmW7cQ/ZR1mv3Y3I29Lt7HTOqzo/1KUOoVH3NItbQIRAQbwKy3UWrOFz4eGNX2GWtNRMdCyWsKeqy9Ltsdfcm1IbKXkl84DFeU/ZacXu4Dl3xX3gV5du4TLZjEowJELyur11Ea2YcjPRQ/FzAF9/hGuboS1HZQEPLx4FdUs9OxCYOtc0MxBCwLfVTTRqarb0Ne+arNYd4kCzIhAke1nOyKAJBda5ZL+VHy3S5S8qGlD46jm8HXugmAkUygS4oIIXOmj/1O9sNAi3LN60zufSzCmP8Rm/iUGX+DHAGGiXxwZOKQLEDaZXKqoHjMPP0XudmSWwOIbyeQVrLhkwIDAQABozEwLzAOBgNVHQ8BAf8EBAMCAgQwHQYDVR0OBBYEFEfeNU2trYxNLF9ONmuJUsT13pKDMA0GCSqGSIb3DQEBCwUAA4IBAQBmM6RJzsGGipxyMhimHKN2xlkejhVsgBoTAhOU0llW9aUSwINJ9zFUGgI8IzUFy1VG776fchHp0LMRmPSIUYk5btEPxbsrPtumPuMH8EQGrS+Rt4pD+78c8H1fEPkq5CmDl/PKu4JoFGv+aFcE+Od0hlILstIF10Qysf++QXDolKfzJa/56bgMeYKFiju73loiRM57ns8ddXpfLl792UVpRkFU62LNns6Y1LKTwapmUF4IvIuAIzd6LZNOQng64LAKXtKnViJ1JQiXwf4CEzhgvAti3/ejpb3U90hsrUcyZi6wBv9bZLcAJRWpz61JNYliM1d1grSwQDKGXNQE4xuN",\n          },\n        ],\n        vpnClientRevokedCertificates: [\n          {\n            name: "vpnServerConfigVpnClientRevokedCert1",\n            thumbprint: "83FFBFC8848B5A5836C94D0112367E16148A286F",\n          },\n        ],\n        radiusServers: [\n          {\n            radiusServerAddress: "10.0.0.0",\n            radiusServerScore: 25,\n            radiusServerSecret: "radiusServerSecret",\n          },\n        ],\n        radiusServerRootCertificates: [\n          {\n            name: "vpnServerConfigRadiusServerRootCer1",\n            publicCertData:\n              "MIIC5zCCAc+gAwIBAgIQErQ0Hk4aDJxIA+Q5RagB+jANBgkqhkiG9w0BAQsFADAWMRQwEgYDVQQDDAtQMlNSb290Q2VydDAeFw0xNzEyMTQyMTA3MzhaFw0xODEyMTQyMTI3MzhaMBYxFDASBgNVBAMMC1AyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArP7/NQXmW7cQ/ZR1mv3Y3I29Lt7HTOqzo/1KUOoVH3NItbQIRAQbwKy3UWrOFz4eGNX2GWtNRMdCyWsKeqy9Ltsdfcm1IbKXkl84DFeU/ZacXu4Dl3xX3gV5du4TLZjEowJELyur11Ea2YcjPRQ/FzAF9/hGuboS1HZQEPLx4FdUs9OxCYOtc0MxBCwLfVTTRqarb0Ne+arNYd4kCzIhAke1nOyKAJBda5ZL+VHy3S5S8qGlD46jm8HXugmAkUygS4oIIXOmj/1O9sNAi3LN60zufSzCmP8Rm/iUGX+DHAGGiXxwZOKQLEDaZXKqoHjMPP0XudmSWwOIbyeQVrLhkwIDAQABozEwLzAOBgNVHQ8BAf8EBAMCAgQwHQYDVR0OBBYEFEfeNU2trYxNLF9ONmuJUsT13pKDMA0GCSqGSIb3DQEBCwUAA4IBAQBmM6RJzsGGipxyMhimHKN2xlkejhVsgBoTAhOU0llW9aUSwINJ9zFUGgI8IzUFy1VG776fchHp0LMRmPSIUYk5btEPxbsrPtumPuMH8EQGrS+Rt4pD+78c8H1fEPkq5CmDl/PKu4JoFGv+aFcE+Od0hlILstIF10Qysf++QXDolKfzJa/56bgMeYKFiju73loiRM57ns8ddXpfLl792UVpRkFU62LNns6Y1LKTwapmUF4IvIuAIzd6LZNOQng64LAKXtKnViJ1JQiXwf4CEzhgvAti3/ejpb3U90hsrUcyZi6wBv9bZLcAJRWpz61JNYliM1d1grSwQDKGXNQE4xuM",\n          },\n        ],\n        radiusClientRootCertificates: [\n          {\n            name: "vpnServerConfigRadiusClientRootCert1",\n            thumbprint: "83FFBFC8848B5A5836C94D0112367E16148A286F",\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the P2SVpnServer configuration.',\n      properties: {\n        name: {\n          type: 'string',\n          description: 'The name of the VpnServerConfiguration that is unique within a resource group.'\n        },\n        vpnProtocols: {\n          type: 'array',\n          items: {\n            type: 'string',\n            description: 'VPN protocol enabled for the VpnServerConfiguration.',\n            enum: [ 'IkeV2', 'OpenVPN' ],\n            'x-ms-enum': {\n              name: 'VpnGatewayTunnelingProtocol',\n              modelAsString: true\n            }\n          },\n          description: 'VPN protocols for the VpnServerConfiguration.'\n        },\n        vpnAuthenticationTypes: {\n          type: 'array',\n          items: {\n            type: 'string',\n            description: 'VPN authentication types enabled for the VpnServerConfiguration.',\n            enum: [ 'Certificate', 'Radius', 'AAD' ],\n            'x-ms-enum': { name: 'VpnAuthenticationType', modelAsString: true }\n          },\n          description: 'VPN authentication types for the VpnServerConfiguration.'\n        },\n        vpnClientRootCertificates: {\n          type: 'array',\n          items: {\n            properties: {\n              name: { type: 'string', description: 'The certificate name.' },\n              publicCertData: {\n                type: 'string',\n                description: 'The certificate public data.'\n              }\n            },\n            description: 'Properties of VPN client root certificate of VpnServerConfiguration.'\n          },\n          description: 'VPN client root certificate of VpnServerConfiguration.'\n        },\n        vpnClientRevokedCertificates: {\n          type: 'array',\n          items: {\n            properties: {\n              name: { type: 'string', description: 'The certificate name.' },\n              thumbprint: {\n                type: 'string',\n                description: 'The revoked VPN client certificate thumbprint.'\n              }\n            },\n            description: 'Properties of the revoked VPN client certificate of VpnServerConfiguration.'\n          },\n          description: 'VPN client revoked certificate of VpnServerConfiguration.'\n        },\n        radiusServerRootCertificates: {\n          type: 'array',\n          items: {\n            properties: {\n              name: { type: 'string', description: 'The certificate name.' },\n              publicCertData: {\n                type: 'string',\n                description: 'The certificate public data.'\n              }\n            },\n            description: 'Properties of Radius Server root certificate of VpnServerConfiguration.'\n          },\n          description: 'Radius Server root certificate of VpnServerConfiguration.'\n        },\n        radiusClientRootCertificates: {\n          type: 'array',\n          items: {\n            properties: {\n              name: { type: 'string', description: 'The certificate name.' },\n              thumbprint: {\n                type: 'string',\n                description: 'The Radius client root certificate thumbprint.'\n              }\n            },\n            description: 'Properties of the Radius client root certificate of VpnServerConfiguration.'\n          },\n          description: 'Radius client root certificate of VpnServerConfiguration.'\n        },\n        vpnClientIpsecPolicies: {\n          type: 'array',\n          items: {\n            properties: {\n              saLifeTimeSeconds: {\n                type: 'integer',\n                format: 'int32',\n                description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) lifetime in seconds for a site to site VPN tunnel.'\n              },\n              saDataSizeKilobytes: {\n                type: 'integer',\n                format: 'int32',\n                description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) payload size in KB for a site to site VPN tunnel.'\n              },\n              ipsecEncryption: {\n                description: 'The IPSec encryption algorithm (IKE phase 1).',\n                type: 'string',\n                enum: [\n                  'None',      'DES',\n                  'DES3',      'AES128',\n                  'AES192',    'AES256',\n                  'GCMAES128', 'GCMAES192',\n                  'GCMAES256'\n                ],\n                'x-ms-enum': { name: 'IpsecEncryption', modelAsString: true }\n              },\n              ipsecIntegrity: {\n                description: 'The IPSec integrity algorithm (IKE phase 1).',\n                type: 'string',\n                enum: [\n                  'MD5',\n                  'SHA1',\n                  'SHA256',\n                  'GCMAES128',\n                  'GCMAES192',\n                  'GCMAES256'\n                ],\n                'x-ms-enum': { name: 'IpsecIntegrity', modelAsString: true }\n              },\n              ikeEncryption: {\n                description: 'The IKE encryption algorithm (IKE phase 2).',\n                type: 'string',\n                enum: [\n                  'DES',\n                  'DES3',\n                  'AES128',\n                  'AES192',\n                  'AES256',\n                  'GCMAES256',\n                  'GCMAES128'\n                ],\n                'x-ms-enum': { name: 'IkeEncryption', modelAsString: true }\n              },\n              ikeIntegrity: {\n                description: 'The IKE integrity algorithm (IKE phase 2).',\n                type: 'string',\n                enum: [\n                  'MD5',\n                  'SHA1',\n                  'SHA256',\n                  'SHA384',\n                  'GCMAES256',\n                  'GCMAES128'\n                ],\n                'x-ms-enum': { name: 'IkeIntegrity', modelAsString: true }\n              },\n              dhGroup: {\n                description: 'The DH Group used in IKE Phase 1 for initial SA.',\n                type: 'string',\n                enum: [\n                  'None',\n                  'DHGroup1',\n                  'DHGroup2',\n                  'DHGroup14',\n                  'DHGroup2048',\n                  'ECP256',\n                  'ECP384',\n                  'DHGroup24'\n                ],\n                'x-ms-enum': { name: 'DhGroup', modelAsString: true }\n              },\n              pfsGroup: {\n                description: 'The Pfs Group used in IKE Phase 2 for new child SA.',\n                type: 'string',\n                enum: [\n                  'None',   'PFS1',\n                  'PFS2',   'PFS2048',\n                  'ECP256', 'ECP384',\n                  'PFS24',  'PFS14',\n                  'PFSMM'\n                ],\n                'x-ms-enum': { name: 'PfsGroup', modelAsString: true }\n              }\n            },\n            required: [\n              'saLifeTimeSeconds',\n              'saDataSizeKilobytes',\n              'ipsecEncryption',\n              'ipsecIntegrity',\n              'ikeEncryption',\n              'ikeIntegrity',\n              'dhGroup',\n              'pfsGroup'\n            ],\n            description: 'An IPSec Policy configuration for a virtual network gateway connection.'\n          },\n          description: 'VpnClientIpsecPolicies for VpnServerConfiguration.'\n        },\n        radiusServerAddress: {\n          type: 'string',\n          description: 'The radius server address property of the VpnServerConfiguration resource for point to site client connection.'\n        },\n        radiusServerSecret: {\n          type: 'string',\n          description: 'The radius secret property of the VpnServerConfiguration resource for point to site client connection.'\n        },\n        radiusServers: {\n          type: 'array',\n          items: {\n            properties: {\n              radiusServerAddress: {\n                type: 'string',\n                description: 'The address of this radius server.'\n              },\n              radiusServerScore: {\n                type: 'integer',\n                format: 'int64',\n                description: 'The initial score assigned to this radius server.'\n              },\n              radiusServerSecret: {\n                type: 'string',\n                description: 'The secret used for this radius server.'\n              }\n            },\n            required: [ 'radiusServerAddress' ],\n            description: 'Radius Server Settings.'\n          },\n          description: 'Multiple Radius Server configuration for VpnServerConfiguration.'\n        },\n        aadAuthenticationParameters: {\n          description: 'The set of aad vpn authentication parameters.',\n          properties: {\n            aadTenant: {\n              type: 'string',\n              description: 'AAD Vpn authentication parameter AAD tenant.'\n            },\n            aadAudience: {\n              type: 'string',\n              description: 'AAD Vpn authentication parameter AAD audience.'\n            },\n            aadIssuer: {\n              type: 'string',\n              description: 'AAD Vpn authentication parameter AAD issuer.'\n            }\n          }\n        },\n        provisioningState: {\n          readOnly: true,\n          type: 'string',\n          description: \"The provisioning state of the VpnServerConfiguration resource. Possible values are: 'Updating', 'Deleting', and 'Failed'.\"\n        },\n        p2SVpnGateways: {\n          type: 'array',\n          readOnly: true,\n          items: {\n            required: [ 'location' ],\n            properties: {\n              properties: {\n                'x-ms-client-flatten': true,\n                description: 'Properties of the P2SVpnGateway.',\n                properties: {\n                  virtualHub: {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  },\n                  p2SConnectionConfigurations: {\n                    type: 'array',\n                    description: 'List of all p2s connection configurations of the gateway.',\n                    items: {\n                      properties: {\n                        properties: {\n                          'x-ms-client-flatten': true,\n                          description: 'Properties of the P2S connection configuration.',\n                          properties: {\n                            vpnClientAddressPool: {\n                              description: 'The reference to the address space resource which represents Address space for P2S VpnClient.',\n                              properties: { addressPrefixes: [Object] }\n                            },\n                            routingConfiguration: {\n                              description: 'The Routing Configuration indicating the associated and propagated route tables on this connection.',\n                              properties: {\n                                associatedRouteTable: [Object],\n                                propagatedRouteTables: [Object],\n                                vnetRoutes: [Object]\n                              }\n                            },\n                            enableInternetSecurity: {\n                              type: 'boolean',\n                              description: 'Flag indicating whether the enable internet security flag is turned on for the P2S Connections or not.'\n                            },\n                            configurationPolicyGroupAssociations: {\n                              type: 'array',\n                              readOnly: true,\n                              items: {\n                                properties: [Object],\n                                description: 'Reference to another subresource.',\n                                'x-ms-azure-resource': true\n                              },\n                              description: 'List of Configuration Policy Groups that this P2SConnectionConfiguration is attached to.'\n                            },\n                            previousConfigurationPolicyGroupAssociations: {\n                              type: 'array',\n                              readOnly: true,\n                              items: {\n                                type: 'object',\n                                properties: [Object],\n                                allOf: [Array],\n                                description: 'VpnServerConfigurationPolicyGroup Resource.'\n                              },\n                              description: 'List of previous Configuration Policy Groups that this P2SConnectionConfiguration was attached to.'\n                            },\n                            provisioningState: {\n                              readOnly: true,\n                              description: 'The provisioning state of the P2SConnectionConfiguration resource.',\n                              type: 'string',\n                              enum: [\n                                'Succeeded',\n                                'Updating',\n                                'Deleting',\n                                'Failed'\n                              ],\n                              'x-ms-enum': {\n                                name: 'ProvisioningState',\n                                modelAsString: true\n                              }\n                            }\n                          }\n                        },\n                        name: {\n                          type: 'string',\n                          description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n                        },\n                        etag: {\n                          type: 'string',\n                          readOnly: true,\n                          description: 'A unique read-only string that changes whenever the resource is updated.'\n                        }\n                      },\n                      allOf: [\n                        {\n                          properties: {\n                            id: {\n                              type: 'string',\n                              description: 'Resource ID.'\n                            }\n                          },\n                          description: 'Reference to another subresource.',\n                          'x-ms-azure-resource': true\n                        }\n                      ],\n                      description: 'P2SConnectionConfiguration Resource.'\n                    }\n                  },\n                  provisioningState: {\n                    readOnly: true,\n                    description: 'The provisioning state of the P2S VPN gateway resource.',\n                    type: 'string',\n                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n                  },\n                  vpnGatewayScaleUnit: {\n                    type: 'integer',\n                    format: 'int32',\n                    description: 'The scale unit for this p2s vpn gateway.'\n                  },\n                  vpnServerConfiguration: {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  },\n                  vpnClientConnectionHealth: {\n                    readOnly: true,\n                    description: \"All P2S VPN clients' connection health status.\",\n                    properties: {\n                      totalIngressBytesTransferred: {\n                        readOnly: true,\n                        type: 'integer',\n                        format: 'int64',\n                        description: 'Total of the Ingress Bytes Transferred in this P2S Vpn connection.'\n                      },\n                      totalEgressBytesTransferred: {\n                        readOnly: true,\n                        type: 'integer',\n                        format: 'int64',\n                        description: 'Total of the Egress Bytes Transferred in this connection.'\n                      },\n                      vpnClientConnectionsCount: {\n                        type: 'integer',\n                        format: 'int32',\n                        description: 'The total of p2s vpn clients connected at this time to this P2SVpnGateway.'\n                      },\n                      allocatedIpAddresses: {\n                        type: 'array',\n                        items: { type: 'string' },\n                        description: 'List of allocated ip addresses to the connected p2s vpn clients.'\n                      }\n                    }\n                  },\n                  customDnsServers: {\n                    type: 'array',\n                    description: 'List of all customer specified DNS servers IP addresses.',\n                    items: { type: 'string' }\n                  },\n                  isRoutingPreferenceInternet: {\n                    type: 'boolean',\n                    description: 'Enable Routing Preference property for the Public IP Interface of the P2SVpnGateway.'\n                  }\n                }\n              },\n              etag: {\n                type: 'string',\n                readOnly: true,\n                description: 'A unique read-only string that changes whenever the resource is updated.'\n              }\n            },\n            allOf: [\n              {\n                properties: {\n                  id: { type: 'string', description: 'Resource ID.' },\n                  name: {\n                    readOnly: true,\n                    type: 'string',\n                    description: 'Resource name.'\n                  },\n                  type: {\n                    readOnly: true,\n                    type: 'string',\n                    description: 'Resource type.'\n                  },\n                  location: { type: 'string', description: 'Resource location.' },\n                  tags: {\n                    type: 'object',\n                    additionalProperties: { type: 'string' },\n                    description: 'Resource tags.'\n                  }\n                },\n                description: 'Common resource representation.',\n                'x-ms-azure-resource': true\n              }\n            ],\n            description: 'P2SVpnGateway Resource.'\n          },\n          description: 'List of references to P2SVpnGateways.'\n        },\n        configurationPolicyGroups: {\n          type: 'array',\n          description: 'List of all VpnServerConfigurationPolicyGroups.',\n          items: {\n            type: 'object',\n            properties: {\n              properties: {\n                'x-ms-client-flatten': true,\n                description: 'Properties of the VpnServerConfigurationPolicyGroup.',\n                type: 'object',\n                properties: {\n                  isDefault: {\n                    type: 'boolean',\n                    description: 'Shows if this is a Default VpnServerConfigurationPolicyGroup or not.'\n                  },\n                  priority: {\n                    type: 'integer',\n                    format: 'int32',\n                    description: 'Priority for VpnServerConfigurationPolicyGroup.'\n                  },\n                  policyMembers: {\n                    type: 'array',\n                    items: {\n                      properties: {\n                        name: {\n                          type: 'string',\n                          description: 'Name of the VpnServerConfigurationPolicyGroupMember.'\n                        },\n                        attributeType: {\n                          type: 'string',\n                          description: 'The Vpn Policy member attribute type.',\n                          enum: [\n                            'CertificateGroupId',\n                            'AADGroupId',\n                            'RadiusAzureGroupId'\n                          ],\n                          'x-ms-enum': {\n                            name: 'VpnPolicyMemberAttributeType',\n                            modelAsString: true\n                          }\n                        },\n                        attributeValue: {\n                          type: 'string',\n                          description: 'The value of Attribute used for this VpnServerConfigurationPolicyGroupMember.'\n                        }\n                      },\n                      description: 'VpnServerConfiguration PolicyGroup member',\n                      type: 'object'\n                    },\n                    description: 'Multiple PolicyMembers for VpnServerConfigurationPolicyGroup.',\n                    'x-ms-identifiers': []\n                  },\n                  p2SConnectionConfigurations: {\n                    type: 'array',\n                    readOnly: true,\n                    items: {\n                      properties: {\n                        id: { type: 'string', description: 'Resource ID.' }\n                      },\n                      description: 'Reference to another subresource.',\n                      'x-ms-azure-resource': true\n                    },\n                    description: 'List of references to P2SConnectionConfigurations.'\n                  },\n                  provisioningState: {\n                    readOnly: true,\n                    description: 'The provisioning state of the VpnServerConfigurationPolicyGroup resource.',\n                    type: 'string',\n                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n                  }\n                }\n              },\n              etag: {\n                type: 'string',\n                readOnly: true,\n                description: 'A unique read-only string that changes whenever the resource is updated.'\n              },\n              name: {\n                type: 'string',\n                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n              },\n              type: {\n                readOnly: true,\n                type: 'string',\n                description: 'Resource type.'\n              }\n            },\n            allOf: [\n              {\n                properties: { id: { type: 'string', description: 'Resource ID.' } },\n                description: 'Reference to another subresource.',\n                'x-ms-azure-resource': true\n              }\n            ],\n            description: 'VpnServerConfigurationPolicyGroup Resource.'\n          }\n        },\n        etag: {\n          readOnly: true,\n          type: 'string',\n          description: 'A unique read-only string that changes whenever the resource is updated.'\n        }\n      }\n    },\n    name: {\n      type: 'string',\n      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: {\n        id: { type: 'string', description: 'Resource ID.' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type.'\n        },\n        location: { type: 'string', description: 'Resource location.' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags.'\n        }\n      },\n      description: 'Common resource representation.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'VpnServerConfiguration Resource.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualWan.json"},"here"),"."))}l.isMDXComponent=!0}}]);