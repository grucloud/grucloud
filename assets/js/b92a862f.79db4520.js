"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4303],{3905:function(n,e,t){t.d(e,{Zo:function(){return u},kt:function(){return m}});var r=t(67294);function i(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function o(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,r)}return t}function s(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?o(Object(t),!0).forEach((function(e){i(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}function c(n,e){if(null==n)return{};var t,r,i=function(n,e){if(null==n)return{};var t,r,i={},o=Object.keys(n);for(r=0;r<o.length;r++)t=o[r],e.indexOf(t)>=0||(i[t]=n[t]);return i}(n,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(n);for(r=0;r<o.length;r++)t=o[r],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(n,t)&&(i[t]=n[t])}return i}var a=r.createContext({}),p=function(n){var e=r.useContext(a),t=e;return n&&(t="function"==typeof n?n(e):s(s({},e),n)),t},u=function(n){var e=p(n.components);return r.createElement(a.Provider,{value:e},n.children)},d={inlineCode:"code",wrapper:function(n){var e=n.children;return r.createElement(r.Fragment,{},e)}},l=r.forwardRef((function(n,e){var t=n.components,i=n.mdxType,o=n.originalType,a=n.parentName,u=c(n,["components","mdxType","originalType","parentName"]),l=p(t),m=i,y=l["".concat(a,".").concat(m)]||l[m]||d[m]||o;return t?r.createElement(y,s(s({ref:e},u),{},{components:t})):r.createElement(y,s({ref:e},u))}));function m(n,e){var t=arguments,i=e&&e.mdxType;if("string"==typeof n||i){var o=t.length,s=new Array(o);s[0]=l;var c={};for(var a in e)hasOwnProperty.call(e,a)&&(c[a]=e[a]);c.originalType=n,c.mdxType="string"==typeof n?n:i,s[1]=c;for(var p=2;p<o;p++)s[p]=t[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}l.displayName="MDXCreateElement"},70419:function(n,e,t){t.r(e),t.d(e,{frontMatter:function(){return c},contentTitle:function(){return a},metadata:function(){return p},toc:function(){return u},default:function(){return l}});var r=t(87462),i=t(63366),o=(t(67294),t(3905)),s=["components"],c={id:"VpnConnection",title:"VpnConnection"},a=void 0,p={unversionedId:"azure/resources/Network/VpnConnection",id:"azure/resources/Network/VpnConnection",isDocsHomePage:!1,title:"VpnConnection",description:"Provides a VpnConnection from the Network group",source:"@site/docs/azure/resources/Network/VpnConnection.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/VpnConnection",permalink:"/docs/azure/resources/Network/VpnConnection",tags:[],version:"current",frontMatter:{id:"VpnConnection",title:"VpnConnection"},sidebar:"docs",previous:{title:"VirtualWan",permalink:"/docs/azure/resources/Network/VirtualWan"},next:{title:"VpnGateway",permalink:"/docs/azure/resources/Network/VpnGateway"}},u=[{value:"Examples",id:"examples",children:[{value:"VpnConnectionPut",id:"vpnconnectionput",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],d={toc:u};function l(n){var e=n.components,t=(0,i.Z)(n,s);return(0,o.kt)("wrapper",(0,r.Z)({},d,t,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"VpnConnection")," from the ",(0,o.kt)("strong",{parentName:"p"},"Network")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"vpnconnectionput"},"VpnConnectionPut"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VpnConnection",\n    group: "Network",\n    name: "myVpnConnection",\n    properties: () => ({\n      properties: {\n        remoteVpnSite: {\n          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnSites/vpnSite1",\n        },\n        vpnLinkConnections: [\n          {\n            name: "Connection-Link1",\n            properties: {\n              vpnSiteLink: {\n                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnSites/vpnSite1/vpnSiteLinks/siteLink1",\n              },\n              connectionBandwidth: 200,\n              vpnConnectionProtocolType: "IKEv2",\n              sharedKey: "key",\n              vpnLinkConnectionMode: "Default",\n              usePolicyBasedTrafficSelectors: false,\n            },\n          },\n        ],\n        trafficSelectorPolicies: [],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      vpnSite: "myVpnSite",\n      routeTable: "myRouteTable",\n      gateway: "myVpnGateway",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VpnSite"},"VpnSite")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/RouteTable"},"RouteTable")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VpnGateway"},"VpnGateway"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the VPN connection.',\n      properties: {\n        remoteVpnSite: {\n          properties: { id: { type: 'string', description: 'Resource ID.' } },\n          description: 'Reference to another subresource.',\n          'x-ms-azure-resource': true\n        },\n        routingWeight: {\n          type: 'integer',\n          format: 'int32',\n          description: 'Routing weight for vpn connection.'\n        },\n        dpdTimeoutSeconds: {\n          type: 'integer',\n          format: 'int32',\n          description: 'DPD timeout in seconds for vpn connection.'\n        },\n        connectionStatus: {\n          description: 'The connection status.',\n          type: 'string',\n          readOnly: true,\n          enum: [ 'Unknown', 'Connecting', 'Connected', 'NotConnected' ],\n          'x-ms-enum': { name: 'VpnConnectionStatus', modelAsString: true }\n        },\n        vpnConnectionProtocolType: {\n          description: 'Connection protocol used for this connection.',\n          type: 'string',\n          enum: [ 'IKEv2', 'IKEv1' ],\n          'x-ms-enum': {\n            name: 'VirtualNetworkGatewayConnectionProtocol',\n            modelAsString: true\n          }\n        },\n        ingressBytesTransferred: {\n          type: 'integer',\n          format: 'int64',\n          readOnly: true,\n          description: 'Ingress bytes transferred.'\n        },\n        egressBytesTransferred: {\n          type: 'integer',\n          format: 'int64',\n          readOnly: true,\n          description: 'Egress bytes transferred.'\n        },\n        connectionBandwidth: {\n          type: 'integer',\n          format: 'int32',\n          description: 'Expected bandwidth in MBPS.'\n        },\n        sharedKey: {\n          type: 'string',\n          description: 'SharedKey for the vpn connection.'\n        },\n        enableBgp: { type: 'boolean', description: 'EnableBgp flag.' },\n        usePolicyBasedTrafficSelectors: {\n          type: 'boolean',\n          description: 'Enable policy-based traffic selectors.'\n        },\n        ipsecPolicies: {\n          type: 'array',\n          items: {\n            properties: {\n              saLifeTimeSeconds: {\n                type: 'integer',\n                format: 'int32',\n                description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) lifetime in seconds for a site to site VPN tunnel.'\n              },\n              saDataSizeKilobytes: {\n                type: 'integer',\n                format: 'int32',\n                description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) payload size in KB for a site to site VPN tunnel.'\n              },\n              ipsecEncryption: {\n                description: 'The IPSec encryption algorithm (IKE phase 1).',\n                type: 'string',\n                enum: [\n                  'None',      'DES',\n                  'DES3',      'AES128',\n                  'AES192',    'AES256',\n                  'GCMAES128', 'GCMAES192',\n                  'GCMAES256'\n                ],\n                'x-ms-enum': { name: 'IpsecEncryption', modelAsString: true }\n              },\n              ipsecIntegrity: {\n                description: 'The IPSec integrity algorithm (IKE phase 1).',\n                type: 'string',\n                enum: [\n                  'MD5',\n                  'SHA1',\n                  'SHA256',\n                  'GCMAES128',\n                  'GCMAES192',\n                  'GCMAES256'\n                ],\n                'x-ms-enum': { name: 'IpsecIntegrity', modelAsString: true }\n              },\n              ikeEncryption: {\n                description: 'The IKE encryption algorithm (IKE phase 2).',\n                type: 'string',\n                enum: [\n                  'DES',\n                  'DES3',\n                  'AES128',\n                  'AES192',\n                  'AES256',\n                  'GCMAES256',\n                  'GCMAES128'\n                ],\n                'x-ms-enum': { name: 'IkeEncryption', modelAsString: true }\n              },\n              ikeIntegrity: {\n                description: 'The IKE integrity algorithm (IKE phase 2).',\n                type: 'string',\n                enum: [\n                  'MD5',\n                  'SHA1',\n                  'SHA256',\n                  'SHA384',\n                  'GCMAES256',\n                  'GCMAES128'\n                ],\n                'x-ms-enum': { name: 'IkeIntegrity', modelAsString: true }\n              },\n              dhGroup: {\n                description: 'The DH Group used in IKE Phase 1 for initial SA.',\n                type: 'string',\n                enum: [\n                  'None',\n                  'DHGroup1',\n                  'DHGroup2',\n                  'DHGroup14',\n                  'DHGroup2048',\n                  'ECP256',\n                  'ECP384',\n                  'DHGroup24'\n                ],\n                'x-ms-enum': { name: 'DhGroup', modelAsString: true }\n              },\n              pfsGroup: {\n                description: 'The Pfs Group used in IKE Phase 2 for new child SA.',\n                type: 'string',\n                enum: [\n                  'None',   'PFS1',\n                  'PFS2',   'PFS2048',\n                  'ECP256', 'ECP384',\n                  'PFS24',  'PFS14',\n                  'PFSMM'\n                ],\n                'x-ms-enum': { name: 'PfsGroup', modelAsString: true }\n              }\n            },\n            required: [\n              'saLifeTimeSeconds',\n              'saDataSizeKilobytes',\n              'ipsecEncryption',\n              'ipsecIntegrity',\n              'ikeEncryption',\n              'ikeIntegrity',\n              'dhGroup',\n              'pfsGroup'\n            ],\n            description: 'An IPSec Policy configuration for a virtual network gateway connection.'\n          },\n          description: 'The IPSec Policies to be considered by this connection.'\n        },\n        trafficSelectorPolicies: {\n          type: 'array',\n          items: {\n            properties: {\n              localAddressRanges: {\n                type: 'array',\n                items: { type: 'string' },\n                description: 'A collection of local address spaces in CIDR format.'\n              },\n              remoteAddressRanges: {\n                type: 'array',\n                items: { type: 'string' },\n                description: 'A collection of remote address spaces in CIDR format.'\n              }\n            },\n            required: [ 'localAddressRanges', 'remoteAddressRanges' ],\n            description: 'An traffic selector policy for a virtual network gateway connection.'\n          },\n          description: 'The Traffic Selector Policies to be considered by this connection.'\n        },\n        enableRateLimiting: { type: 'boolean', description: 'EnableBgp flag.' },\n        enableInternetSecurity: { type: 'boolean', description: 'Enable internet security.' },\n        useLocalAzureIpAddress: {\n          type: 'boolean',\n          description: 'Use local azure ip to initiate connection.'\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the VPN connection resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        vpnLinkConnections: {\n          type: 'array',\n          description: 'List of all vpn site link connections to the gateway.',\n          items: {\n            properties: {\n              properties: {\n                'x-ms-client-flatten': true,\n                description: 'Properties of the VPN site link connection.',\n                properties: {\n                  vpnSiteLink: {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  },\n                  routingWeight: {\n                    type: 'integer',\n                    format: 'int32',\n                    description: 'Routing weight for vpn connection.'\n                  },\n                  vpnLinkConnectionMode: {\n                    type: 'string',\n                    description: 'Vpn link connection mode.',\n                    enum: [ 'Default', 'ResponderOnly', 'InitiatorOnly' ],\n                    'x-ms-enum': {\n                      name: 'VpnLinkConnectionMode',\n                      modelAsString: true\n                    }\n                  },\n                  connectionStatus: {\n                    description: 'The connection status.',\n                    type: 'string',\n                    readOnly: true,\n                    enum: [\n                      'Unknown',\n                      'Connecting',\n                      'Connected',\n                      'NotConnected'\n                    ],\n                    'x-ms-enum': {\n                      name: 'VpnConnectionStatus',\n                      modelAsString: true\n                    }\n                  },\n                  vpnConnectionProtocolType: {\n                    description: 'Connection protocol used for this connection.',\n                    type: 'string',\n                    enum: [ 'IKEv2', 'IKEv1' ],\n                    'x-ms-enum': {\n                      name: 'VirtualNetworkGatewayConnectionProtocol',\n                      modelAsString: true\n                    }\n                  },\n                  ingressBytesTransferred: {\n                    type: 'integer',\n                    format: 'int64',\n                    readOnly: true,\n                    description: 'Ingress bytes transferred.'\n                  },\n                  egressBytesTransferred: {\n                    type: 'integer',\n                    format: 'int64',\n                    readOnly: true,\n                    description: 'Egress bytes transferred.'\n                  },\n                  connectionBandwidth: {\n                    type: 'integer',\n                    format: 'int32',\n                    description: 'Expected bandwidth in MBPS.'\n                  },\n                  sharedKey: {\n                    type: 'string',\n                    description: 'SharedKey for the vpn connection.'\n                  },\n                  enableBgp: { type: 'boolean', description: 'EnableBgp flag.' },\n                  vpnGatewayCustomBgpAddresses: {\n                    type: 'array',\n                    items: {\n                      type: 'object',\n                      properties: {\n                        ipConfigurationId: {\n                          type: 'string',\n                          description: 'The IpconfigurationId of ipconfiguration which belongs to gateway.'\n                        },\n                        customBgpIpAddress: {\n                          type: 'string',\n                          description: 'The custom BgpPeeringAddress which belongs to IpconfigurationId.'\n                        }\n                      },\n                      required: [ 'ipConfigurationId', 'customBgpIpAddress' ],\n                      description: 'GatewayCustomBgpIpAddressIpConfiguration for a virtual network gateway connection.'\n                    },\n                    description: 'vpnGatewayCustomBgpAddresses used by this connection.',\n                    'x-ms-identifiers': []\n                  },\n                  usePolicyBasedTrafficSelectors: {\n                    type: 'boolean',\n                    description: 'Enable policy-based traffic selectors.'\n                  },\n                  ipsecPolicies: {\n                    type: 'array',\n                    items: {\n                      properties: {\n                        saLifeTimeSeconds: {\n                          type: 'integer',\n                          format: 'int32',\n                          description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) lifetime in seconds for a site to site VPN tunnel.'\n                        },\n                        saDataSizeKilobytes: {\n                          type: 'integer',\n                          format: 'int32',\n                          description: 'The IPSec Security Association (also called Quick Mode or Phase 2 SA) payload size in KB for a site to site VPN tunnel.'\n                        },\n                        ipsecEncryption: {\n                          description: 'The IPSec encryption algorithm (IKE phase 1).',\n                          type: 'string',\n                          enum: [\n                            'None',      'DES',\n                            'DES3',      'AES128',\n                            'AES192',    'AES256',\n                            'GCMAES128', 'GCMAES192',\n                            'GCMAES256'\n                          ],\n                          'x-ms-enum': {\n                            name: 'IpsecEncryption',\n                            modelAsString: true\n                          }\n                        },\n                        ipsecIntegrity: {\n                          description: 'The IPSec integrity algorithm (IKE phase 1).',\n                          type: 'string',\n                          enum: [\n                            'MD5',\n                            'SHA1',\n                            'SHA256',\n                            'GCMAES128',\n                            'GCMAES192',\n                            'GCMAES256'\n                          ],\n                          'x-ms-enum': {\n                            name: 'IpsecIntegrity',\n                            modelAsString: true\n                          }\n                        },\n                        ikeEncryption: {\n                          description: 'The IKE encryption algorithm (IKE phase 2).',\n                          type: 'string',\n                          enum: [\n                            'DES',\n                            'DES3',\n                            'AES128',\n                            'AES192',\n                            'AES256',\n                            'GCMAES256',\n                            'GCMAES128'\n                          ],\n                          'x-ms-enum': {\n                            name: 'IkeEncryption',\n                            modelAsString: true\n                          }\n                        },\n                        ikeIntegrity: {\n                          description: 'The IKE integrity algorithm (IKE phase 2).',\n                          type: 'string',\n                          enum: [\n                            'MD5',\n                            'SHA1',\n                            'SHA256',\n                            'SHA384',\n                            'GCMAES256',\n                            'GCMAES128'\n                          ],\n                          'x-ms-enum': { name: 'IkeIntegrity', modelAsString: true }\n                        },\n                        dhGroup: {\n                          description: 'The DH Group used in IKE Phase 1 for initial SA.',\n                          type: 'string',\n                          enum: [\n                            'None',\n                            'DHGroup1',\n                            'DHGroup2',\n                            'DHGroup14',\n                            'DHGroup2048',\n                            'ECP256',\n                            'ECP384',\n                            'DHGroup24'\n                          ],\n                          'x-ms-enum': { name: 'DhGroup', modelAsString: true }\n                        },\n                        pfsGroup: {\n                          description: 'The Pfs Group used in IKE Phase 2 for new child SA.',\n                          type: 'string',\n                          enum: [\n                            'None',   'PFS1',\n                            'PFS2',   'PFS2048',\n                            'ECP256', 'ECP384',\n                            'PFS24',  'PFS14',\n                            'PFSMM'\n                          ],\n                          'x-ms-enum': { name: 'PfsGroup', modelAsString: true }\n                        }\n                      },\n                      required: [\n                        'saLifeTimeSeconds',\n                        'saDataSizeKilobytes',\n                        'ipsecEncryption',\n                        'ipsecIntegrity',\n                        'ikeEncryption',\n                        'ikeIntegrity',\n                        'dhGroup',\n                        'pfsGroup'\n                      ],\n                      description: 'An IPSec Policy configuration for a virtual network gateway connection.'\n                    },\n                    description: 'The IPSec Policies to be considered by this connection.'\n                  },\n                  enableRateLimiting: { type: 'boolean', description: 'EnableBgp flag.' },\n                  useLocalAzureIpAddress: {\n                    type: 'boolean',\n                    description: 'Use local azure ip to initiate connection.'\n                  },\n                  provisioningState: {\n                    readOnly: true,\n                    description: 'The provisioning state of the VPN site link connection resource.',\n                    type: 'string',\n                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n                  },\n                  ingressNatRules: {\n                    type: 'array',\n                    items: {\n                      properties: {\n                        id: { type: 'string', description: 'Resource ID.' }\n                      },\n                      description: 'Reference to another subresource.',\n                      'x-ms-azure-resource': true\n                    },\n                    description: 'List of ingress NatRules.'\n                  },\n                  egressNatRules: {\n                    type: 'array',\n                    items: {\n                      properties: {\n                        id: { type: 'string', description: 'Resource ID.' }\n                      },\n                      description: 'Reference to another subresource.',\n                      'x-ms-azure-resource': true\n                    },\n                    description: 'List of egress NatRules.'\n                  }\n                }\n              },\n              name: {\n                type: 'string',\n                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n              },\n              etag: {\n                type: 'string',\n                readOnly: true,\n                description: 'A unique read-only string that changes whenever the resource is updated.'\n              },\n              type: {\n                readOnly: true,\n                type: 'string',\n                description: 'Resource type.'\n              }\n            },\n            allOf: [\n              {\n                properties: { id: { type: 'string', description: 'Resource ID.' } },\n                description: 'Reference to another subresource.',\n                'x-ms-azure-resource': true\n              }\n            ],\n            description: 'VpnSiteLinkConnection Resource.'\n          }\n        },\n        routingConfiguration: {\n          description: 'The Routing Configuration indicating the associated and propagated route tables on this connection.',\n          properties: {\n            associatedRouteTable: {\n              properties: { id: { type: 'string', description: 'Resource ID.' } },\n              description: 'Reference to another subresource.',\n              'x-ms-azure-resource': true\n            },\n            propagatedRouteTables: {\n              description: 'The list of RouteTables to advertise the routes to.',\n              properties: {\n                labels: {\n                  type: 'array',\n                  description: 'The list of labels.',\n                  items: { type: 'string' }\n                },\n                ids: {\n                  type: 'array',\n                  description: 'The list of resource ids of all the RouteTables.',\n                  items: {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  }\n                }\n              }\n            },\n            vnetRoutes: {\n              description: 'List of routes that control routing from VirtualHub into a virtual network connection.',\n              properties: {\n                staticRoutes: {\n                  type: 'array',\n                  description: 'List of all Static Routes.',\n                  items: {\n                    description: 'List of all Static Routes.',\n                    properties: {\n                      name: {\n                        type: 'string',\n                        description: 'The name of the StaticRoute that is unique within a VnetRoute.'\n                      },\n                      addressPrefixes: {\n                        type: 'array',\n                        description: 'List of all address prefixes.',\n                        items: { type: 'string' }\n                      },\n                      nextHopIpAddress: {\n                        type: 'string',\n                        description: 'The ip address of the next hop.'\n                      }\n                    }\n                  }\n                },\n                bgpConnections: {\n                  type: 'array',\n                  readOnly: true,\n                  description: 'The list of references to HubBgpConnection objects.',\n                  items: {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    },\n    name: {\n      type: 'string',\n      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: { id: { type: 'string', description: 'Resource ID.' } },\n      description: 'Reference to another subresource.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'VpnConnection Resource.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualWan.json"},"here"),"."))}l.isMDXComponent=!0}}]);