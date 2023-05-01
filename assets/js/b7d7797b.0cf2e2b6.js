"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3399],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),c=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(p.Provider,{value:t},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},y=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),l=c(n),y=a,m=l["".concat(p,".").concat(y)]||l[y]||d[y]||i;return n?r.createElement(m,o(o({ref:t},u),{},{components:n})):r.createElement(m,o({ref:t},u))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=y;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s[l]="string"==typeof e?e:a,o[1]=s;for(var c=2;c<i;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}y.displayName="MDXCreateElement"},32217:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var r=n(87462),a=(n(67294),n(3905));const i={id:"CapacityReservationGroup",title:"CapacityReservationGroup"},o=void 0,s={unversionedId:"azure/resources/Compute/CapacityReservationGroup",id:"azure/resources/Compute/CapacityReservationGroup",title:"CapacityReservationGroup",description:"Provides a CapacityReservationGroup from the Compute group",source:"@site/docs/azure/resources/Compute/CapacityReservationGroup.md",sourceDirName:"azure/resources/Compute",slug:"/azure/resources/Compute/CapacityReservationGroup",permalink:"/docs/azure/resources/Compute/CapacityReservationGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"CapacityReservationGroup",title:"CapacityReservationGroup"},sidebar:"docs",previous:{title:"CapacityReservation",permalink:"/docs/azure/resources/Compute/CapacityReservation"},next:{title:"CloudService",permalink:"/docs/azure/resources/Compute/CloudService"}},p={},c=[{value:"Examples",id:"examples",level:2},{value:"Create or update a capacity reservation group.",id:"create-or-update-a-capacity-reservation-group",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:c},l="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(l,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"CapacityReservationGroup")," from the ",(0,a.kt)("strong",{parentName:"p"},"Compute")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"create-or-update-a-capacity-reservation-group"},"Create or update a capacity reservation group."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "CapacityReservationGroup",\n    group: "Compute",\n    name: "myCapacityReservationGroup",\n    properties: () => ({\n      location: "westus",\n      tags: { department: "finance" },\n      zones: ["1", "2"],\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"{\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      type: 'object',\n      properties: {\n        capacityReservations: {\n          type: 'array',\n          items: {\n            properties: {\n              id: {\n                readOnly: true,\n                type: 'string',\n                description: 'Resource Id'\n              }\n            },\n            'x-ms-azure-resource': true\n          },\n          readOnly: true,\n          description: 'A list of all capacity reservation resource ids that belong to capacity reservation group.'\n        },\n        virtualMachinesAssociated: {\n          type: 'array',\n          items: {\n            properties: {\n              id: {\n                readOnly: true,\n                type: 'string',\n                description: 'Resource Id'\n              }\n            },\n            'x-ms-azure-resource': true\n          },\n          readOnly: true,\n          description: 'A list of references to all virtual machines associated to the capacity reservation group.'\n        },\n        instanceView: {\n          readOnly: true,\n          description: 'The capacity reservation group instance view which has the list of instance views for all the capacity reservations that belong to the capacity reservation group.',\n          type: 'object',\n          properties: {\n            capacityReservations: {\n              type: 'array',\n              items: {\n                type: 'object',\n                properties: {\n                  name: {\n                    type: 'string',\n                    readOnly: true,\n                    description: 'The name of the capacity reservation.'\n                  }\n                },\n                allOf: [\n                  {\n                    type: 'object',\n                    properties: {\n                      utilizationInfo: {\n                        description: 'Unutilized capacity of the capacity reservation.',\n                        type: 'object',\n                        properties: {\n                          virtualMachinesAllocated: {\n                            type: 'array',\n                            items: {\n                              properties: {\n                                id: {\n                                  readOnly: true,\n                                  type: 'string',\n                                  description: 'Resource Id'\n                                }\n                              },\n                              'x-ms-azure-resource': true\n                            },\n                            readOnly: true,\n                            description: 'A list of all virtual machines resource ids allocated against the capacity reservation.'\n                          }\n                        }\n                      },\n                      statuses: {\n                        type: 'array',\n                        items: {\n                          properties: {\n                            code: {\n                              type: 'string',\n                              description: 'The status code.'\n                            },\n                            level: {\n                              type: 'string',\n                              description: 'The level code.',\n                              enum: [ 'Info', 'Warning', 'Error' ],\n                              'x-ms-enum': {\n                                name: 'StatusLevelTypes',\n                                modelAsString: false\n                              }\n                            },\n                            displayStatus: {\n                              type: 'string',\n                              description: 'The short localizable label for the status.'\n                            },\n                            message: {\n                              type: 'string',\n                              description: 'The detailed status message, including for alerts and error messages.'\n                            },\n                            time: {\n                              type: 'string',\n                              format: 'date-time',\n                              description: 'The time of the status.'\n                            }\n                          },\n                          description: 'Instance view status.'\n                        },\n                        'x-ms-identifiers': [],\n                        description: 'The resource status information.'\n                      }\n                    },\n                    description: 'The instance view of a capacity reservation that provides as snapshot of the runtime properties of the capacity reservation that is managed by the platform and can change outside of control plane operations.'\n                  }\n                ],\n                description: 'The instance view of a capacity reservation that includes the name of the capacity reservation. It is used for the response to the instance view of a capacity reservation group.'\n              },\n              'x-ms-identifiers': [ 'name' ],\n              readOnly: true,\n              description: 'List of instance view of the capacity reservations under the capacity reservation group.'\n            }\n          }\n        }\n      },\n      description: 'capacity reservation group Properties.'\n    },\n    zones: {\n      type: 'array',\n      items: { type: 'string' },\n      description: 'Availability Zones to use for this capacity reservation group. The zones can be assigned only during creation. If not provided, the group supports only regional resources in the region. If provided, enforces each capacity reservation in the group to be in one of the zones.'\n    }\n  },\n  allOf: [\n    {\n      description: 'The Resource model definition.',\n      properties: {\n        id: { readOnly: true, type: 'string', description: 'Resource Id' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type'\n        },\n        location: { type: 'string', description: 'Resource location' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags'\n        }\n      },\n      required: [ 'location' ],\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Specifies information about the capacity reservation group that the capacity reservations should be assigned to. <br><br> Currently, a capacity reservation can only be added to a capacity reservation group at creation time. An existing capacity reservation cannot be added or moved to another capacity reservation group.'\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2022-03-01/capacityReservation.json"},"here"),"."))}d.isMDXComponent=!0}}]);