"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[38051],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=n.createContext({}),p=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(u.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,s=e.originalType,u=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),d=p(r),m=o,y=d["".concat(u,".").concat(m)]||d[m]||l[m]||s;return r?n.createElement(y,i(i({ref:t},c),{},{components:r})):n.createElement(y,i({ref:t},c))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var s=r.length,i=new Array(s);i[0]=d;var a={};for(var u in t)hasOwnProperty.call(t,u)&&(a[u]=t[u]);a.originalType=e,a.mdxType="string"==typeof e?e:o,i[1]=a;for(var p=2;p<s;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},65406:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>l,frontMatter:()=>s,metadata:()=>a,toc:()=>p});var n=r(87462),o=(r(67294),r(3905));const s={id:"ExpressRouteGateway",title:"ExpressRouteGateway"},i=void 0,a={unversionedId:"azure/resources/Network/ExpressRouteGateway",id:"azure/resources/Network/ExpressRouteGateway",title:"ExpressRouteGateway",description:"Provides a ExpressRouteGateway from the Network group",source:"@site/docs/azure/resources/Network/ExpressRouteGateway.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/ExpressRouteGateway",permalink:"/docs/azure/resources/Network/ExpressRouteGateway",draft:!1,tags:[],version:"current",frontMatter:{id:"ExpressRouteGateway",title:"ExpressRouteGateway"},sidebar:"docs",previous:{title:"ExpressRouteConnection",permalink:"/docs/azure/resources/Network/ExpressRouteConnection"},next:{title:"ExpressRoutePortAuthorization",permalink:"/docs/azure/resources/Network/ExpressRoutePortAuthorization"}},u={},p=[{value:"Examples",id:"examples",level:2},{value:"ExpressRouteGatewayCreate",id:"expressroutegatewaycreate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],c={toc:p};function l(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"ExpressRouteGateway")," from the ",(0,o.kt)("strong",{parentName:"p"},"Network")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"expressroutegatewaycreate"},"ExpressRouteGatewayCreate"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ExpressRouteGateway",\n    group: "Network",\n    name: "myExpressRouteGateway",\n    properties: () => ({\n      location: "westus",\n      properties: {\n        virtualHub: {\n          id: "/subscriptions/subid/resourceGroups/resourceGroupId/providers/Microsoft.Network/virtualHubs/virtualHubName",\n        },\n        autoScaleConfiguration: { bounds: { min: 3 } },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      expressRouteCircuitPeering: ["myExpressRouteCircuitPeering"],\n      routeTable: ["myRouteTable"],\n      virtualHub: "myVirtualHub",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/ExpressRouteCircuitPeering"},"ExpressRouteCircuitPeering")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/RouteTable"},"RouteTable")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualHub"},"VirtualHub"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the express route gateway.',\n      required: [ 'virtualHub' ],\n      properties: {\n        autoScaleConfiguration: {\n          properties: {\n            bounds: {\n              properties: {\n                min: {\n                  type: 'integer',\n                  description: 'Minimum number of scale units deployed for ExpressRoute gateway.'\n                },\n                max: {\n                  type: 'integer',\n                  description: 'Maximum number of scale units deployed for ExpressRoute gateway.'\n                }\n              },\n              description: 'Minimum and maximum number of scale units to deploy.'\n            }\n          },\n          description: 'Configuration for auto scaling.'\n        },\n        expressRouteConnections: {\n          type: 'array',\n          description: 'List of ExpressRoute connections to the ExpressRoute gateway.',\n          items: {\n            required: [ 'name' ],\n            properties: {\n              properties: {\n                'x-ms-client-flatten': true,\n                description: 'Properties of the express route connection.',\n                required: [ 'expressRouteCircuitPeering' ],\n                properties: {\n                  provisioningState: {\n                    readOnly: true,\n                    description: 'The provisioning state of the express route connection resource.',\n                    type: 'string',\n                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n                  },\n                  expressRouteCircuitPeering: {\n                    description: 'The ExpressRoute circuit peering.',\n                    properties: {\n                      id: {\n                        type: 'string',\n                        description: 'The ID of the ExpressRoute circuit peering.'\n                      }\n                    }\n                  },\n                  authorizationKey: {\n                    type: 'string',\n                    description: 'Authorization key to establish the connection.'\n                  },\n                  routingWeight: {\n                    type: 'integer',\n                    description: 'The routing weight associated to the connection.'\n                  },\n                  enableInternetSecurity: {\n                    type: 'boolean',\n                    description: 'Enable internet security.'\n                  },\n                  expressRouteGatewayBypass: {\n                    type: 'boolean',\n                    description: 'Enable FastPath to vWan Firewall hub.'\n                  },\n                  routingConfiguration: {\n                    description: 'The Routing Configuration indicating the associated and propagated route tables on this connection.',\n                    properties: {\n                      associatedRouteTable: {\n                        description: 'The resource id RouteTable associated with this RoutingConfiguration.',\n                        properties: {\n                          id: {\n                            type: 'string',\n                            description: 'Resource ID.'\n                          }\n                        },\n                        'x-ms-azure-resource': true\n                      },\n                      propagatedRouteTables: {\n                        description: 'The list of RouteTables to advertise the routes to.',\n                        properties: {\n                          labels: {\n                            type: 'array',\n                            description: 'The list of labels.',\n                            items: { type: 'string' }\n                          },\n                          ids: {\n                            type: 'array',\n                            description: 'The list of resource ids of all the RouteTables.',\n                            items: {\n                              properties: { id: [Object] },\n                              description: 'Reference to another subresource.',\n                              'x-ms-azure-resource': true\n                            }\n                          }\n                        }\n                      },\n                      vnetRoutes: {\n                        description: 'List of routes that control routing from VirtualHub into a virtual network connection.',\n                        properties: {\n                          staticRoutes: {\n                            type: 'array',\n                            description: 'List of all Static Routes.',\n                            items: {\n                              description: 'List of all Static Routes.',\n                              properties: {\n                                name: [Object],\n                                addressPrefixes: [Object],\n                                nextHopIpAddress: [Object]\n                              }\n                            }\n                          },\n                          bgpConnections: {\n                            type: 'array',\n                            readOnly: true,\n                            description: 'The list of references to HubBgpConnection objects.',\n                            items: {\n                              properties: { id: [Object] },\n                              description: 'Reference to another subresource.',\n                              'x-ms-azure-resource': true\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              },\n              name: {\n                type: 'string',\n                description: 'The name of the resource.'\n              }\n            },\n            allOf: [\n              {\n                properties: { id: { type: 'string', description: 'Resource ID.' } },\n                description: 'Reference to another subresource.',\n                'x-ms-azure-resource': true\n              }\n            ],\n            description: 'ExpressRouteConnection resource.'\n          }\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the express route gateway resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        virtualHub: {\n          description: 'The Virtual Hub where the ExpressRoute gateway is or will be deployed.',\n          properties: {\n            id: {\n              type: 'string',\n              description: 'The resource URI for the Virtual Hub where the ExpressRoute gateway is or will be deployed. The Virtual Hub resource and the ExpressRoute gateway resource reside in the same subscription.'\n            }\n          }\n        }\n      }\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: {\n        id: { type: 'string', description: 'Resource ID.' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type.'\n        },\n        location: { type: 'string', description: 'Resource location.' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags.'\n        }\n      },\n      description: 'Common resource representation.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'ExpressRoute gateway resource.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualWan.json"},"here"),"."))}l.isMDXComponent=!0}}]);