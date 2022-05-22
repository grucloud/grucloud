"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[16353],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return g}});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var p=r.createContext({}),u=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},c=function(e){var n=u(e.components);return r.createElement(p.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},l=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),l=u(t),g=i,y=l["".concat(p,".").concat(g)]||l[g]||d[g]||o;return t?r.createElement(y,s(s({ref:n},c),{},{components:t})):r.createElement(y,s({ref:n},c))}));function g(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,s=new Array(o);s[0]=l;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a.mdxType="string"==typeof e?e:i,s[1]=a;for(var u=2;u<o;u++)s[u]=t[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}l.displayName="MDXCreateElement"},1881:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return a},contentTitle:function(){return p},metadata:function(){return u},toc:function(){return c},default:function(){return l}});var r=t(87462),i=t(63366),o=(t(67294),t(3905)),s=["components"],a={id:"VirtualNetworkGateway",title:"VirtualNetworkGateway"},p=void 0,u={unversionedId:"azure/resources/Network/VirtualNetworkGateway",id:"azure/resources/Network/VirtualNetworkGateway",isDocsHomePage:!1,title:"VirtualNetworkGateway",description:"Provides a VirtualNetworkGateway from the Network group",source:"@site/docs/azure/resources/Network/VirtualNetworkGateway.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/VirtualNetworkGateway",permalink:"/docs/azure/resources/Network/VirtualNetworkGateway",tags:[],version:"current",frontMatter:{id:"VirtualNetworkGateway",title:"VirtualNetworkGateway"},sidebar:"docs",previous:{title:"VirtualNetwork",permalink:"/docs/azure/resources/Network/VirtualNetwork"},next:{title:"VirtualNetworkGatewayConnection",permalink:"/docs/azure/resources/Network/VirtualNetworkGatewayConnection"}},c=[{value:"Examples",id:"examples",children:[{value:"UpdateVirtualNetworkGateway",id:"updatevirtualnetworkgateway",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],d={toc:c};function l(e){var n=e.components,t=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"VirtualNetworkGateway")," from the ",(0,o.kt)("strong",{parentName:"p"},"Network")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"updatevirtualnetworkgateway"},"UpdateVirtualNetworkGateway"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VirtualNetworkGateway",\n    group: "Network",\n    name: "myVirtualNetworkGateway",\n    properties: () => ({\n      properties: {\n        ipConfigurations: [\n          {\n            properties: {\n              privateIPAllocationMethod: "Dynamic",\n              subnet: {\n                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/GatewaySubnet",\n              },\n              publicIPAddress: {\n                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/gwpip",\n              },\n            },\n            name: "gwipconfig1",\n          },\n        ],\n        gatewayType: "Vpn",\n        vpnType: "RouteBased",\n        enableBgp: false,\n        activeActive: false,\n        disableIPSecReplayProtection: false,\n        enableDnsForwarding: true,\n        natRules: [\n          {\n            name: "natRule1",\n            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vpngw/natRules/natRule1",\n            properties: {\n              type: "Static",\n              mode: "EgressSnat",\n              ipConfigurationId: "",\n              internalMappings: [{ addressSpace: "10.10.0.0/24" }],\n              externalMappings: [{ addressSpace: "50.0.0.0/24" }],\n            },\n          },\n          {\n            name: "natRule2",\n            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vpngw/natRules/natRule2",\n            properties: {\n              type: "Static",\n              mode: "IngressSnat",\n              ipConfigurationId: "",\n              internalMappings: [{ addressSpace: "20.10.0.0/24" }],\n              externalMappings: [{ addressSpace: "30.0.0.0/24" }],\n            },\n          },\n        ],\n        enableBgpRouteTranslationForNat: false,\n        sku: { name: "VpnGw1", tier: "VpnGw1" },\n        vpnClientConfiguration: {\n          vpnClientProtocols: ["OpenVPN"],\n          vpnClientRootCertificates: [],\n          vpnClientRevokedCertificates: [],\n          radiusServers: [\n            {\n              radiusServerAddress: "10.2.0.0",\n              radiusServerScore: 20,\n              radiusServerSecret: "radiusServerSecret",\n            },\n          ],\n        },\n        bgpSettings: {\n          asn: 65515,\n          bgpPeeringAddress: "10.0.1.30",\n          peerWeight: 0,\n        },\n        customRoutes: { addressPrefixes: ["101.168.0.6/32"] },\n      },\n      location: "centralus",\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      subnet: "mySubnet",\n      publicIpAddress: "myPublicIPAddress",\n      virtualHubIpConfiguration: "myVirtualHubIpConfiguration",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/Subnet"},"Subnet")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"../Network/PublicIPAddress.md"},"PublicIPAddress")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualHubIpConfiguration"},"VirtualHubIpConfiguration"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the virtual network gateway.',\n      properties: {\n        ipConfigurations: {\n          type: 'array',\n          items: {\n            properties: {\n              properties: {\n                'x-ms-client-flatten': true,\n                description: 'Properties of the virtual network gateway ip configuration.',\n                properties: {\n                  privateIPAllocationMethod: {\n                    description: 'The private IP address allocation method.',\n                    type: 'string',\n                    enum: [ 'Static', 'Dynamic' ],\n                    'x-ms-enum': { name: 'IPAllocationMethod', modelAsString: true }\n                  },\n                  subnet: {\n                    description: 'The reference to the subnet resource.',\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    'x-ms-azure-resource': true\n                  },\n                  publicIPAddress: {\n                    description: 'The reference to the public IP resource.',\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    'x-ms-azure-resource': true\n                  },\n                  privateIPAddress: {\n                    readOnly: true,\n                    type: 'string',\n                    description: 'Private IP Address for this gateway.'\n                  },\n                  provisioningState: {\n                    readOnly: true,\n                    description: 'The provisioning state of the virtual network gateway IP configuration resource.',\n                    type: 'string',\n                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n                  }\n                }\n              },\n              name: {\n                type: 'string',\n                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n              },\n              etag: {\n                readOnly: true,\n                type: 'string',\n                description: 'A unique read-only string that changes whenever the resource is updated.'\n              }\n            },\n            allOf: [\n              {\n                properties: { id: { type: 'string', description: 'Resource ID.' } },\n                description: 'Reference to another subresource.',\n                'x-ms-azure-resource': true\n              }\n            ],\n            description: 'IP configuration for virtual network gateway.'\n          },\n          description: 'IP configurations for virtual network gateway.'\n        },\n        gatewayType: {\n          type: 'string',\n          description: 'The type of this virtual network gateway.',\n          enum: [ 'Vpn', 'ExpressRoute', 'LocalGateway' ],\n          'x-ms-enum': { name: 'VirtualNetworkGatewayType', modelAsString: true }\n        },\n        vpnType: {\n          type: 'string',\n          description: 'The type of this virtual network gateway.',\n          enum: [ 'PolicyBased', 'RouteBased' ],\n          'x-ms-enum': { name: 'VpnType', modelAsString: true }\n        },\n        vpnGatewayGeneration: {\n          type: 'string',\n          description: 'The generation for this VirtualNetworkGateway. Must be None if gatewayType is not VPN.',\n          enum: [ 'None', 'Generation1', 'Generation2' ],\n          'x-ms-enum': { name: 'VpnGatewayGeneration', modelAsString: true }\n        },\n        enableBgp: {\n          type: 'boolean',\n          description: 'Whether BGP is enabled for this virtual network gateway or not.'\n        },\n        enablePrivateIpAddress: {\n          type: 'boolean',\n          description: 'Whether private IP needs to be enabled on this gateway for connections or not.'\n        },\n        activeActive: { type: 'boolean', description: 'ActiveActive flag.' },\n        disableIPSecReplayProtection: {\n          type: 'boolean',\n          description: 'disableIPSecReplayProtection flag.'\n        },\n        gatewayDefaultSite: {\n          description: 'The reference to the LocalNetworkGateway resource which represents local network site having default routes. Assign Null value in case of removing existing default site setting.',\n          properties: { id: { type: 'string', description: 'Resource ID.' } },\n          'x-ms-azure-resource': true\n        },\n        sku: {\n          description: 'The reference to the VirtualNetworkGatewaySku resource which represents the SKU selected for Virtual network gateway.',\n          properties: {\n            name: {\n              type: 'string',\n              description: 'Gateway SKU name.',\n              enum: [\n                'Basic',    'HighPerformance',\n                'Standard', 'UltraPerformance',\n                'VpnGw1',   'VpnGw2',\n                'VpnGw3',   'VpnGw4',\n                'VpnGw5',   'VpnGw1AZ',\n                'VpnGw2AZ', 'VpnGw3AZ',\n                'VpnGw4AZ', 'VpnGw5AZ',\n                'ErGw1AZ',  'ErGw2AZ',\n                'ErGw3AZ'\n              ],\n              'x-ms-enum': {\n                name: 'VirtualNetworkGatewaySkuName',\n                modelAsString: true\n              }\n            },\n            tier: {\n              type: 'string',\n              description: 'Gateway SKU tier.',\n              enum: [\n                'Basic',    'HighPerformance',\n                'Standard', 'UltraPerformance',\n                'VpnGw1',   'VpnGw2',\n                'VpnGw3',   'VpnGw4',\n                'VpnGw5',   'VpnGw1AZ',\n                'VpnGw2AZ', 'VpnGw3AZ',\n                'VpnGw4AZ', 'VpnGw5AZ',\n                'ErGw1AZ',  'ErGw2AZ',\n                'ErGw3AZ'\n              ],\n              'x-ms-enum': {\n                name: 'VirtualNetworkGatewaySkuTier',\n                modelAsString: true\n              }\n            },\n            capacity: {\n              readOnly: true,\n              type: 'integer',\n              format: 'int32',\n              description: 'The capacity.'\n            }\n          }\n        },\n        vpnClientConfiguration: {\n          description: 'The reference to the VpnClientConfiguration resource which represents the P2S VpnClient configurations.',\n          properties: {\n            vpnClientAddressPool: {\n              description: 'The reference to the address space resource which represents Address space for P2S VpnClient.',\n              properties: {\n                addressPrefixes: {\n                  type: 'array',\n                  items: { type: 'string' },\n                  description: 'A list of address blocks reserved for this virtual network in CIDR notation.'\n                }\n              }\n            },\n            vpnClientRootCertificates: {\n              type: 'array',\n              items: {\n                properties: {\n                  properties: {\n                    'x-ms-client-flatten': true,\n                    description: 'Properties of the vpn client root certificate.',\n                    properties: {\n                      publicCertData: {\n                        type: 'string',\n                        description: 'The certificate public data.'\n                      },\n                      provisioningState: {\n                        readOnly: true,\n                        description: 'The provisioning state of the VPN client root certificate resource.',\n                        type: 'string',\n                        enum: [\n                          'Succeeded',\n                          'Updating',\n                          'Deleting',\n                          'Failed'\n                        ],\n                        'x-ms-enum': {\n                          name: 'ProvisioningState',\n                          modelAsString: true\n                        }\n                      }\n                    },\n                    required: [ 'publicCertData' ]\n                  },\n                  name: {\n                    type: 'string',\n                    description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n                  },\n                  etag: {\n                    readOnly: true,\n                    type: 'string',\n                    description: 'A unique read-only string that changes whenever the resource is updated.'\n                  }\n                },\n                allOf: [\n                  {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  }\n                ],\n                required: [ 'properties' ],\n                description: 'VPN client root certificate of virtual network gateway.'\n              },\n              description: 'VpnClientRootCertificate for virtual network gateway.'\n            },\n            vpnClientRevokedCertificates: {\n              type: 'array',\n              items: {\n                properties: {\n                  properties: {\n                    'x-ms-client-flatten': true,\n                    description: 'Properties of the vpn client revoked certificate.',\n                    properties: {\n                      thumbprint: {\n                        type: 'string',\n                        description: 'The revoked VPN client certificate thumbprint.'\n                      },\n                      provisioningState: {\n                        readOnly: true,\n                        description: 'The provisioning state of the VPN client revoked certificate resource.',\n                        type: 'string',\n                        enum: [\n                          'Succeeded',\n                          'Updating',\n                          'Deleting',\n                          'Failed'\n                        ],\n                        'x-ms-enum': {\n                          name: 'ProvisioningState',\n                          modelAsString: true\n                        }\n                      }\n                    }\n                  },\n                  name: {\n                    type: 'string',\n                    description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n                  },\n                  etag: {\n                    readOnly: true,\n                    type: 'string',\n                    description: 'A unique read-only string that changes whenever the resource is updated.'\n                  }\n                },\n                allOf: [\n                  {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  }\n                ],\n                description: 'VPN client revoked certificate of virtual network gateway.'\n              },\n              description: 'VpnClientRevokedCertificate for Virtual network gateway.'\n            },\n            vpnClientProtocols: {\n              type: 'array',\n              items: {\n                type: 'string',\n                description: 'VPN client protocol enabled for the virtual network gateway.',\n                enum: [ 'IkeV2', 'SSTP', 'OpenVPN' ],\n                'x-ms-enum': { name: 'VpnClientProtocol', modelAsString: true }\n              },\n              description: 'VpnClientProtocols for Virtual network gateway.'\n            },\n            vpnAuthenticationTypes: {\n              type: 'array',\n              items: {\n                type: 'string',\n                description: 'VPN authentication types enabled for the virtual network gateway.',\n                enum: [ 'Certificate', 'Radius', 'AAD' ],\n                'x-ms-enum': { name: 'VpnAuthenticationType', modelAsString: true }\n              },\n              description: 'VPN authentication types for the virtual network gateway..'\n            },\n            vpnClientIpsecPolicies: {\n              type: 'array',\n              items: {\n                properties: {\n                  saLifeTimeSeconds: {\n                    type: 'integer',\n                    format: 'int32',\n                    description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) lifetime in seconds for a site to site VPN tunnel.'\n                  },\n                  saDataSizeKilobytes: {\n                    type: 'integer',\n                    format: 'int32',\n                    description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) payload size in KB for a site to site VPN tunnel.'\n                  },\n                  ipsecEncryption: {\n                    description: 'The IPSec encryption algorithm (IKE phase 1).',\n                    type: 'string',\n                    enum: [\n                      'None',      'DES',\n                      'DES3',      'AES128',\n                      'AES192',    'AES256',\n                      'GCMAES128', 'GCMAES192',\n                      'GCMAES256'\n                    ],\n                    'x-ms-enum': { name: 'IpsecEncryption', modelAsString: true }\n                  },\n                  ipsecIntegrity: {\n                    description: 'The IPSec integrity algorithm (IKE phase 1).',\n                    type: 'string',\n                    enum: [\n                      'MD5',\n                      'SHA1',\n                      'SHA256',\n                      'GCMAES128',\n                      'GCMAES192',\n                      'GCMAES256'\n                    ],\n                    'x-ms-enum': { name: 'IpsecIntegrity', modelAsString: true }\n                  },\n                  ikeEncryption: {\n                    description: 'The IKE encryption algorithm (IKE phase 2).',\n                    type: 'string',\n                    enum: [\n                      'DES',\n                      'DES3',\n                      'AES128',\n                      'AES192',\n                      'AES256',\n                      'GCMAES256',\n                      'GCMAES128'\n                    ],\n                    'x-ms-enum': { name: 'IkeEncryption', modelAsString: true }\n                  },\n                  ikeIntegrity: {\n                    description: 'The IKE integrity algorithm (IKE phase 2).',\n                    type: 'string',\n                    enum: [\n                      'MD5',\n                      'SHA1',\n                      'SHA256',\n                      'SHA384',\n                      'GCMAES256',\n                      'GCMAES128'\n                    ],\n                    'x-ms-enum': { name: 'IkeIntegrity', modelAsString: true }\n                  },\n                  dhGroup: {\n                    description: 'The DH Group used in IKE Phase 1 for initial SA.',\n                    type: 'string',\n                    enum: [\n                      'None',\n                      'DHGroup1',\n                      'DHGroup2',\n                      'DHGroup14',\n                      'DHGroup2048',\n                      'ECP256',\n                      'ECP384',\n                      'DHGroup24'\n                    ],\n                    'x-ms-enum': { name: 'DhGroup', modelAsString: true }\n                  },\n                  pfsGroup: {\n                    description: 'The Pfs Group used in IKE Phase 2 for new child SA.',\n                    type: 'string',\n                    enum: [\n                      'None',   'PFS1',\n                      'PFS2',   'PFS2048',\n                      'ECP256', 'ECP384',\n                      'PFS24',  'PFS14',\n                      'PFSMM'\n                    ],\n                    'x-ms-enum': { name: 'PfsGroup', modelAsString: true }\n                  }\n                },\n                required: [\n                  'saLifeTimeSeconds',\n                  'saDataSizeKilobytes',\n                  'ipsecEncryption',\n                  'ipsecIntegrity',\n                  'ikeEncryption',\n                  'ikeIntegrity',\n                  'dhGroup',\n                  'pfsGroup'\n                ],\n                description: 'An IPSec Policy configuration for a virtual network gateway connection.'\n              },\n              description: 'VpnClientIpsecPolicies for virtual network gateway P2S client.'\n            },\n            radiusServerAddress: {\n              type: 'string',\n              description: 'The radius server address property of the VirtualNetworkGateway resource for vpn client connection.'\n            },\n            radiusServerSecret: {\n              type: 'string',\n              description: 'The radius secret property of the VirtualNetworkGateway resource for vpn client connection.'\n            },\n            radiusServers: {\n              type: 'array',\n              items: {\n                properties: {\n                  radiusServerAddress: {\n                    type: 'string',\n                    description: 'The address of this radius server.'\n                  },\n                  radiusServerScore: {\n                    type: 'integer',\n                    format: 'int64',\n                    description: 'The initial score assigned to this radius server.'\n                  },\n                  radiusServerSecret: {\n                    type: 'string',\n                    description: 'The secret used for this radius server.'\n                  }\n                },\n                required: [ 'radiusServerAddress' ],\n                description: 'Radius Server Settings.'\n              },\n              description: 'The radiusServers property for multiple radius server configuration.'\n            },\n            aadTenant: {\n              type: 'string',\n              description: 'The AADTenant property of the VirtualNetworkGateway resource for vpn client connection used for AAD authentication.'\n            },\n            aadAudience: {\n              type: 'string',\n              description: 'The AADAudience property of the VirtualNetworkGateway resource for vpn client connection used for AAD authentication.'\n            },\n            aadIssuer: {\n              type: 'string',\n              description: 'The AADIssuer property of the VirtualNetworkGateway resource for vpn client connection used for AAD authentication.'\n            }\n          }\n        },\n        bgpSettings: {\n          description: \"Virtual network gateway's BGP speaker settings.\",\n          properties: {\n            asn: {\n              type: 'integer',\n              format: 'int64',\n              minimum: 0,\n              maximum: 4294967295,\n              description: \"The BGP speaker's ASN.\"\n            },\n            bgpPeeringAddress: {\n              type: 'string',\n              description: 'The BGP peering address and BGP identifier of this BGP speaker.'\n            },\n            peerWeight: {\n              type: 'integer',\n              format: 'int32',\n              description: 'The weight added to routes learned from this BGP speaker.'\n            },\n            bgpPeeringAddresses: {\n              type: 'array',\n              items: {\n                properties: {\n                  ipconfigurationId: {\n                    type: 'string',\n                    description: 'The ID of IP configuration which belongs to gateway.'\n                  },\n                  defaultBgpIpAddresses: {\n                    readOnly: true,\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: 'The list of default BGP peering addresses which belong to IP configuration.'\n                  },\n                  customBgpIpAddresses: {\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: 'The list of custom BGP peering addresses which belong to IP configuration.'\n                  },\n                  tunnelIpAddresses: {\n                    readOnly: true,\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: 'The list of tunnel public IP addresses which belong to IP configuration.'\n                  }\n                },\n                description: 'Properties of IPConfigurationBgpPeeringAddress.'\n              },\n              description: 'BGP peering address with IP configuration ID for virtual network gateway.'\n            }\n          }\n        },\n        customRoutes: {\n          description: 'The reference to the address space resource which represents the custom routes address space specified by the customer for virtual network gateway and VpnClient.',\n          properties: {\n            addressPrefixes: {\n              type: 'array',\n              items: { type: 'string' },\n              description: 'A list of address blocks reserved for this virtual network in CIDR notation.'\n            }\n          }\n        },\n        resourceGuid: {\n          readOnly: true,\n          type: 'string',\n          description: 'The resource GUID property of the virtual network gateway resource.'\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the virtual network gateway resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        enableDnsForwarding: {\n          type: 'boolean',\n          description: 'Whether dns forwarding is enabled or not.'\n        },\n        inboundDnsForwardingEndpoint: {\n          type: 'string',\n          readOnly: true,\n          description: 'The IP address allocated by the gateway to which dns requests can be sent.'\n        },\n        vNetExtendedLocationResourceId: {\n          type: 'string',\n          description: 'Customer vnet resource id. VirtualNetworkGateway of type local gateway is associated with the customer vnet.'\n        },\n        natRules: {\n          type: 'array',\n          items: {\n            properties: {\n              properties: {\n                'x-ms-client-flatten': true,\n                description: 'Properties of the Virtual Network Gateway NAT rule.',\n                properties: {\n                  provisioningState: {\n                    readOnly: true,\n                    description: 'The provisioning state of the NAT Rule resource.',\n                    type: 'string',\n                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n                  },\n                  type: {\n                    type: 'string',\n                    description: 'The type of NAT rule for VPN NAT.',\n                    enum: [ 'Static', 'Dynamic' ],\n                    'x-ms-enum': { name: 'VpnNatRuleType', modelAsString: true }\n                  },\n                  mode: {\n                    type: 'string',\n                    description: 'The Source NAT direction of a VPN NAT.',\n                    enum: [ 'EgressSnat', 'IngressSnat' ],\n                    'x-ms-enum': { name: 'VpnNatRuleMode', modelAsString: true }\n                  },\n                  internalMappings: {\n                    type: 'array',\n                    items: {\n                      properties: {\n                        addressSpace: {\n                          type: 'string',\n                          description: 'Address space for Vpn NatRule mapping.'\n                        },\n                        portRange: {\n                          type: 'string',\n                          description: 'Port range for Vpn NatRule mapping.'\n                        }\n                      },\n                      description: 'Vpn NatRule mapping.'\n                    },\n                    description: 'The private IP address internal mapping for NAT.'\n                  },\n                  externalMappings: {\n                    type: 'array',\n                    items: {\n                      properties: {\n                        addressSpace: {\n                          type: 'string',\n                          description: 'Address space for Vpn NatRule mapping.'\n                        },\n                        portRange: {\n                          type: 'string',\n                          description: 'Port range for Vpn NatRule mapping.'\n                        }\n                      },\n                      description: 'Vpn NatRule mapping.'\n                    },\n                    description: 'The private IP address external mapping for NAT.'\n                  },\n                  ipConfigurationId: {\n                    type: 'string',\n                    description: 'The IP Configuration ID this NAT rule applies to.'\n                  }\n                }\n              },\n              name: {\n                type: 'string',\n                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n              },\n              etag: {\n                type: 'string',\n                readOnly: true,\n                description: 'A unique read-only string that changes whenever the resource is updated.'\n              },\n              type: {\n                readOnly: true,\n                type: 'string',\n                description: 'Resource type.'\n              }\n            },\n            allOf: [\n              {\n                properties: { id: { type: 'string', description: 'Resource ID.' } },\n                description: 'Reference to another subresource.',\n                'x-ms-azure-resource': true\n              }\n            ],\n            description: 'VirtualNetworkGatewayNatRule Resource.'\n          },\n          description: 'NatRules for virtual network gateway.'\n        },\n        enableBgpRouteTranslationForNat: {\n          type: 'boolean',\n          description: 'EnableBgpRouteTranslationForNat flag.'\n        }\n      }\n    },\n    extendedLocation: {\n      description: 'The extended location of type local virtual network gateway.',\n      properties: {\n        name: {\n          type: 'string',\n          description: 'The name of the extended location.'\n        },\n        type: {\n          description: 'The type of the extended location.',\n          type: 'string',\n          enum: [ 'EdgeZone' ],\n          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }\n        }\n      }\n    },\n    etag: {\n      readOnly: true,\n      type: 'string',\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: {\n        id: { type: 'string', description: 'Resource ID.' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type.'\n        },\n        location: { type: 'string', description: 'Resource location.' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags.'\n        }\n      },\n      description: 'Common resource representation.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  required: [ 'properties' ],\n  description: 'A common class for general resource information.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualNetworkGateway.json"},"here"),"."))}l.isMDXComponent=!0}}]);