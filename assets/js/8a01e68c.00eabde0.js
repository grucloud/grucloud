"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[32742],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>m});var r=n(67294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=r.createContext({}),c=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},l=function(e){var t=c(e.components);return r.createElement(u.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},b=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,u=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),p=c(n),b=o,m=p["".concat(u,".").concat(b)]||p[b]||d[b]||i;return n?r.createElement(m,s(s({ref:t},l),{},{components:n})):r.createElement(m,s({ref:t},l))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,s=new Array(i);s[0]=b;var a={};for(var u in t)hasOwnProperty.call(t,u)&&(a[u]=t[u]);a.originalType=e,a[p]="string"==typeof e?e:o,s[1]=a;for(var c=2;c<i;c++)s[c]=n[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}b.displayName="MDXCreateElement"},45288:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>d,frontMatter:()=>i,metadata:()=>a,toc:()=>c});var r=n(87462),o=(n(67294),n(3905));const i={id:"HubVirtualNetworkConnection",title:"HubVirtualNetworkConnection"},s=void 0,a={unversionedId:"azure/resources/Network/HubVirtualNetworkConnection",id:"azure/resources/Network/HubVirtualNetworkConnection",title:"HubVirtualNetworkConnection",description:"Provides a HubVirtualNetworkConnection from the Network group",source:"@site/docs/azure/resources/Network/HubVirtualNetworkConnection.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/HubVirtualNetworkConnection",permalink:"/docs/azure/resources/Network/HubVirtualNetworkConnection",draft:!1,tags:[],version:"current",frontMatter:{id:"HubVirtualNetworkConnection",title:"HubVirtualNetworkConnection"},sidebar:"docs",previous:{title:"HubRouteTable",permalink:"/docs/azure/resources/Network/HubRouteTable"},next:{title:"InboundNatRule",permalink:"/docs/azure/resources/Network/InboundNatRule"}},u={},c=[{value:"Examples",id:"examples",level:2},{value:"HubVirtualNetworkConnectionPut",id:"hubvirtualnetworkconnectionput",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:c},p="wrapper";function d(e){let{components:t,...n}=e;return(0,o.kt)(p,(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"HubVirtualNetworkConnection")," from the ",(0,o.kt)("strong",{parentName:"p"},"Network")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"hubvirtualnetworkconnectionput"},"HubVirtualNetworkConnectionPut"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "HubVirtualNetworkConnection",\n    group: "Network",\n    name: "myHubVirtualNetworkConnection",\n    properties: () => ({\n      properties: {\n        remoteVirtualNetwork: {\n          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/SpokeVnet1",\n        },\n        enableInternetSecurity: false,\n        routingConfiguration: {\n          associatedRouteTable: {\n            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable1",\n          },\n          propagatedRouteTables: {\n            labels: ["label1", "label2"],\n            ids: [\n              {\n                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable1",\n              },\n            ],\n          },\n          vnetRoutes: {\n            staticRoutes: [\n              {\n                name: "route1",\n                addressPrefixes: ["10.1.0.0/16", "10.2.0.0/16"],\n                nextHopIpAddress: "10.0.0.68",\n              },\n              {\n                name: "route2",\n                addressPrefixes: ["10.3.0.0/16", "10.4.0.0/16"],\n                nextHopIpAddress: "10.0.0.65",\n              },\n            ],\n          },\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      virtualNetwork: "myVirtualNetwork",\n      routeTable: "myRouteTable",\n      virtualHub: "myVirtualHub",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualNetwork"},"VirtualNetwork")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/RouteTable"},"RouteTable")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualHub"},"VirtualHub"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the hub virtual network connection.',\n      properties: {\n        remoteVirtualNetwork: {\n          description: 'Reference to the remote virtual network.',\n          properties: { id: { type: 'string', description: 'Resource ID.' } },\n          'x-ms-azure-resource': true\n        },\n        allowHubToRemoteVnetTransit: {\n          type: 'boolean',\n          description: 'Deprecated: VirtualHub to RemoteVnet transit to enabled or not.'\n        },\n        allowRemoteVnetToUseHubVnetGateways: {\n          type: 'boolean',\n          description: \"Deprecated: Allow RemoteVnet to use Virtual Hub's gateways.\"\n        },\n        enableInternetSecurity: { type: 'boolean', description: 'Enable internet security.' },\n        routingConfiguration: {\n          description: 'The Routing Configuration indicating the associated and propagated route tables on this connection.',\n          properties: {\n            associatedRouteTable: {\n              description: 'The resource id RouteTable associated with this RoutingConfiguration.',\n              properties: { id: { type: 'string', description: 'Resource ID.' } },\n              'x-ms-azure-resource': true\n            },\n            propagatedRouteTables: {\n              description: 'The list of RouteTables to advertise the routes to.',\n              properties: {\n                labels: {\n                  type: 'array',\n                  description: 'The list of labels.',\n                  items: { type: 'string' }\n                },\n                ids: {\n                  type: 'array',\n                  description: 'The list of resource ids of all the RouteTables.',\n                  items: {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  }\n                }\n              }\n            },\n            vnetRoutes: {\n              description: 'List of routes that control routing from VirtualHub into a virtual network connection.',\n              properties: {\n                staticRoutes: {\n                  type: 'array',\n                  description: 'List of all Static Routes.',\n                  items: {\n                    description: 'List of all Static Routes.',\n                    properties: {\n                      name: {\n                        type: 'string',\n                        description: 'The name of the StaticRoute that is unique within a VnetRoute.'\n                      },\n                      addressPrefixes: {\n                        type: 'array',\n                        description: 'List of all address prefixes.',\n                        items: { type: 'string' }\n                      },\n                      nextHopIpAddress: {\n                        type: 'string',\n                        description: 'The ip address of the next hop.'\n                      }\n                    }\n                  }\n                },\n                bgpConnections: {\n                  type: 'array',\n                  readOnly: true,\n                  description: 'The list of references to HubBgpConnection objects.',\n                  items: {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  }\n                }\n              }\n            }\n          }\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the hub virtual network connection resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    },\n    name: {\n      type: 'string',\n      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: { id: { type: 'string', description: 'Resource ID.' } },\n      description: 'Reference to another subresource.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'HubVirtualNetworkConnection Resource.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-01-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualWan.json"},"here"),"."))}d.isMDXComponent=!0}}]);