"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[305],{3905:function(e,n,r){r.d(n,{Zo:function(){return u},kt:function(){return f}});var t=r(67294);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function s(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function a(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var c=t.createContext({}),p=function(e){var n=t.useContext(c),r=n;return e&&(r="function"==typeof e?e(n):s(s({},n),e)),r},u=function(e){var n=p(e.components);return t.createElement(c.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},l=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),l=p(r),f=i,g=l["".concat(c,".").concat(f)]||l[f]||d[f]||o;return r?t.createElement(g,s(s({ref:n},u),{},{components:r})):t.createElement(g,s({ref:n},u))}));function f(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=r.length,s=new Array(o);s[0]=l;var a={};for(var c in n)hasOwnProperty.call(n,c)&&(a[c]=n[c]);a.originalType=e,a.mdxType="string"==typeof e?e:i,s[1]=a;for(var p=2;p<o;p++)s[p]=r[p];return t.createElement.apply(null,s)}return t.createElement.apply(null,r)}l.displayName="MDXCreateElement"},50392:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return a},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return u},default:function(){return l}});var t=r(87462),i=r(63366),o=(r(67294),r(3905)),s=["components"],a={id:"NetworkProfile",title:"NetworkProfile"},c=void 0,p={unversionedId:"azure/resources/Network/NetworkProfile",id:"azure/resources/Network/NetworkProfile",isDocsHomePage:!1,title:"NetworkProfile",description:"Provides a NetworkProfile from the Network group",source:"@site/docs/azure/resources/Network/NetworkProfile.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/NetworkProfile",permalink:"/docs/azure/resources/Network/NetworkProfile",tags:[],version:"current",frontMatter:{id:"NetworkProfile",title:"NetworkProfile"},sidebar:"docs",previous:{title:"NetworkInterfaceTapConfiguration",permalink:"/docs/azure/resources/Network/NetworkInterfaceTapConfiguration"},next:{title:"NetworkSecurityGroup",permalink:"/docs/azure/resources/Network/NetworkSecurityGroup"}},u=[{value:"Examples",id:"examples",children:[{value:"Create network profile defaults",id:"create-network-profile-defaults",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],d={toc:u};function l(e){var n=e.components,r=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,t.Z)({},d,r,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"NetworkProfile")," from the ",(0,o.kt)("strong",{parentName:"p"},"Network")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"create-network-profile-defaults"},"Create network profile defaults"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "NetworkProfile",\n    group: "Network",\n    name: "myNetworkProfile",\n    properties: () => ({\n      location: "westus",\n      properties: {\n        containerNetworkInterfaceConfigurations: [\n          {\n            name: "eth1",\n            properties: {\n              ipConfigurations: [\n                {\n                  name: "ipconfig1",\n                  properties: {\n                    subnet: {\n                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/networkProfileVnet/subnets/networkProfileSubnet1",\n                    },\n                  },\n                },\n              ],\n            },\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Network profile properties.',\n      properties: {\n        containerNetworkInterfaces: {\n          readOnly: true,\n          type: 'array',\n          items: {\n            properties: {\n              properties: {\n                'x-ms-client-flatten': true,\n                description: 'Container network interface properties.',\n                properties: {\n                  containerNetworkInterfaceConfiguration: {\n                    readOnly: true,\n                    description: 'Container network interface configuration from which this container network interface is created.',\n                    properties: {\n                      properties: {\n                        'x-ms-client-flatten': true,\n                        description: 'Container network interface configuration properties.',\n                        properties: {\n                          ipConfigurations: {\n                            type: 'array',\n                            items: {\n                              properties: {\n                                properties: [Object],\n                                name: [Object],\n                                type: [Object],\n                                etag: [Object]\n                              },\n                              allOf: [ [Object] ],\n                              description: 'IP configuration profile child resource.'\n                            },\n                            description: 'A list of ip configurations of the container network interface configuration.'\n                          },\n                          containerNetworkInterfaces: {\n                            type: 'array',\n                            items: {\n                              properties: { id: [Object] },\n                              description: 'Reference to another subresource.',\n                              'x-ms-azure-resource': true\n                            },\n                            description: 'A list of container network interfaces created from this container network interface configuration.'\n                          },\n                          provisioningState: {\n                            readOnly: true,\n                            description: 'The provisioning state of the container network interface configuration resource.',\n                            type: 'string',\n                            enum: [\n                              'Succeeded',\n                              'Updating',\n                              'Deleting',\n                              'Failed'\n                            ],\n                            'x-ms-enum': {\n                              name: 'ProvisioningState',\n                              modelAsString: true\n                            }\n                          }\n                        }\n                      },\n                      name: {\n                        type: 'string',\n                        description: 'The name of the resource. This name can be used to access the resource.'\n                      },\n                      type: {\n                        readOnly: true,\n                        type: 'string',\n                        description: 'Sub Resource type.'\n                      },\n                      etag: {\n                        readOnly: true,\n                        type: 'string',\n                        description: 'A unique read-only string that changes whenever the resource is updated.'\n                      }\n                    },\n                    allOf: [\n                      {\n                        properties: {\n                          id: {\n                            type: 'string',\n                            description: 'Resource ID.'\n                          }\n                        },\n                        description: 'Reference to another subresource.',\n                        'x-ms-azure-resource': true\n                      }\n                    ]\n                  },\n                  container: {\n                    description: 'Reference to the container to which this container network interface is attached.',\n                    properties: {},\n                    allOf: [\n                      {\n                        properties: {\n                          id: {\n                            type: 'string',\n                            description: 'Resource ID.'\n                          }\n                        },\n                        description: 'Reference to another subresource.',\n                        'x-ms-azure-resource': true\n                      }\n                    ]\n                  },\n                  ipConfigurations: {\n                    readOnly: true,\n                    type: 'array',\n                    items: {\n                      properties: {\n                        properties: {\n                          'x-ms-client-flatten': true,\n                          description: 'Properties of the container network interface IP configuration.',\n                          properties: {\n                            provisioningState: {\n                              readOnly: true,\n                              description: 'The provisioning state of the container network interface IP configuration resource.',\n                              type: 'string',\n                              enum: [\n                                'Succeeded',\n                                'Updating',\n                                'Deleting',\n                                'Failed'\n                              ],\n                              'x-ms-enum': {\n                                name: 'ProvisioningState',\n                                modelAsString: true\n                              }\n                            }\n                          }\n                        },\n                        name: {\n                          type: 'string',\n                          description: 'The name of the resource. This name can be used to access the resource.'\n                        },\n                        type: {\n                          readOnly: true,\n                          type: 'string',\n                          description: 'Sub Resource type.'\n                        },\n                        etag: {\n                          readOnly: true,\n                          type: 'string',\n                          description: 'A unique read-only string that changes whenever the resource is updated.'\n                        }\n                      },\n                      description: 'The ip configuration for a container network interface.'\n                    },\n                    description: 'Reference to the ip configuration on this container nic.'\n                  },\n                  provisioningState: {\n                    readOnly: true,\n                    description: 'The provisioning state of the container network interface resource.',\n                    type: 'string',\n                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n                  }\n                }\n              },\n              name: {\n                type: 'string',\n                description: 'The name of the resource. This name can be used to access the resource.'\n              },\n              type: {\n                readOnly: true,\n                type: 'string',\n                description: 'Sub Resource type.'\n              },\n              etag: {\n                readOnly: true,\n                type: 'string',\n                description: 'A unique read-only string that changes whenever the resource is updated.'\n              }\n            },\n            allOf: [\n              {\n                properties: { id: { type: 'string', description: 'Resource ID.' } },\n                description: 'Reference to another subresource.',\n                'x-ms-azure-resource': true\n              }\n            ],\n            description: 'Container network interface child resource.'\n          },\n          description: 'List of child container network interfaces.'\n        },\n        containerNetworkInterfaceConfigurations: {\n          type: 'array',\n          items: {\n            properties: {\n              properties: {\n                'x-ms-client-flatten': true,\n                description: 'Container network interface configuration properties.',\n                properties: {\n                  ipConfigurations: {\n                    type: 'array',\n                    items: {\n                      properties: {\n                        properties: {\n                          'x-ms-client-flatten': true,\n                          description: 'Properties of the IP configuration profile.',\n                          properties: {\n                            subnet: {\n                              description: 'The reference to the subnet resource to create a container network interface ip configuration.',\n                              properties: {\n                                properties: [Object],\n                                name: [Object],\n                                etag: [Object],\n                                type: [Object]\n                              },\n                              allOf: [ [Object] ]\n                            },\n                            provisioningState: {\n                              readOnly: true,\n                              description: 'The provisioning state of the IP configuration profile resource.',\n                              type: 'string',\n                              enum: [\n                                'Succeeded',\n                                'Updating',\n                                'Deleting',\n                                'Failed'\n                              ],\n                              'x-ms-enum': {\n                                name: 'ProvisioningState',\n                                modelAsString: true\n                              }\n                            }\n                          }\n                        },\n                        name: {\n                          type: 'string',\n                          description: 'The name of the resource. This name can be used to access the resource.'\n                        },\n                        type: {\n                          readOnly: true,\n                          type: 'string',\n                          description: 'Sub Resource type.'\n                        },\n                        etag: {\n                          readOnly: true,\n                          type: 'string',\n                          description: 'A unique read-only string that changes whenever the resource is updated.'\n                        }\n                      },\n                      allOf: [\n                        {\n                          properties: {\n                            id: {\n                              type: 'string',\n                              description: 'Resource ID.'\n                            }\n                          },\n                          description: 'Reference to another subresource.',\n                          'x-ms-azure-resource': true\n                        }\n                      ],\n                      description: 'IP configuration profile child resource.'\n                    },\n                    description: 'A list of ip configurations of the container network interface configuration.'\n                  },\n                  containerNetworkInterfaces: {\n                    type: 'array',\n                    items: {\n                      properties: {\n                        id: { type: 'string', description: 'Resource ID.' }\n                      },\n                      description: 'Reference to another subresource.',\n                      'x-ms-azure-resource': true\n                    },\n                    description: 'A list of container network interfaces created from this container network interface configuration.'\n                  },\n                  provisioningState: {\n                    readOnly: true,\n                    description: 'The provisioning state of the container network interface configuration resource.',\n                    type: 'string',\n                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n                  }\n                }\n              },\n              name: {\n                type: 'string',\n                description: 'The name of the resource. This name can be used to access the resource.'\n              },\n              type: {\n                readOnly: true,\n                type: 'string',\n                description: 'Sub Resource type.'\n              },\n              etag: {\n                readOnly: true,\n                type: 'string',\n                description: 'A unique read-only string that changes whenever the resource is updated.'\n              }\n            },\n            allOf: [\n              {\n                properties: { id: { type: 'string', description: 'Resource ID.' } },\n                description: 'Reference to another subresource.',\n                'x-ms-azure-resource': true\n              }\n            ],\n            description: 'Container network interface configuration child resource.'\n          },\n          description: 'List of chid container network interface configurations.'\n        },\n        resourceGuid: {\n          readOnly: true,\n          type: 'string',\n          description: 'The resource GUID property of the network profile resource.'\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the network profile resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    },\n    etag: {\n      readOnly: true,\n      type: 'string',\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: {\n        id: { type: 'string', description: 'Resource ID.' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type.'\n        },\n        location: { type: 'string', description: 'Resource location.' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags.'\n        }\n      },\n      description: 'Common resource representation.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Network profile resource.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/networkProfile.json"},"here"),"."))}l.isMDXComponent=!0}}]);