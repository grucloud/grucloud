"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[77178],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(67294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var d=r.createContext({}),p=function(e){var t=r.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(d.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},l=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,d=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),l=p(n),m=o,h=l["".concat(d,".").concat(m)]||l[m]||u[m]||a;return n?r.createElement(h,i(i({ref:t},c),{},{components:n})):r.createElement(h,i({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=l;var s={};for(var d in t)hasOwnProperty.call(t,d)&&(s[d]=t[d]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var p=2;p<a;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}l.displayName="MDXCreateElement"},19284:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>p});var r=n(87462),o=(n(67294),n(3905));const a={id:"DedicatedHostGroup",title:"DedicatedHostGroup"},i=void 0,s={unversionedId:"azure/resources/Compute/DedicatedHostGroup",id:"azure/resources/Compute/DedicatedHostGroup",title:"DedicatedHostGroup",description:"Provides a DedicatedHostGroup from the Compute group",source:"@site/docs/azure/resources/Compute/DedicatedHostGroup.md",sourceDirName:"azure/resources/Compute",slug:"/azure/resources/Compute/DedicatedHostGroup",permalink:"/docs/azure/resources/Compute/DedicatedHostGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"DedicatedHostGroup",title:"DedicatedHostGroup"},sidebar:"docs",previous:{title:"DedicatedHost",permalink:"/docs/azure/resources/Compute/DedicatedHost"},next:{title:"Disk",permalink:"/docs/azure/resources/Compute/Disk"}},d={},p=[{value:"Examples",id:"examples",level:2},{value:"Create or update a dedicated host group.",id:"create-or-update-a-dedicated-host-group",level:3},{value:"Create or update a dedicated host group with Ultra SSD support.",id:"create-or-update-a-dedicated-host-group-with-ultra-ssd-support",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],c={toc:p};function u(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"DedicatedHostGroup")," from the ",(0,o.kt)("strong",{parentName:"p"},"Compute")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"create-or-update-a-dedicated-host-group"},"Create or update a dedicated host group."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "DedicatedHostGroup",\n    group: "Compute",\n    name: "myDedicatedHostGroup",\n    properties: () => ({\n      location: "westus",\n      tags: { department: "finance" },\n      zones: ["1"],\n      properties: {\n        platformFaultDomainCount: 3,\n        supportAutomaticPlacement: true,\n      },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,o.kt)("h3",{id:"create-or-update-a-dedicated-host-group-with-ultra-ssd-support"},"Create or update a dedicated host group with Ultra SSD support."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "DedicatedHostGroup",\n    group: "Compute",\n    name: "myDedicatedHostGroup",\n    properties: () => ({\n      location: "westus",\n      tags: { department: "finance" },\n      zones: ["1"],\n      properties: {\n        platformFaultDomainCount: 3,\n        supportAutomaticPlacement: true,\n        additionalCapabilities: { ultraSSDEnabled: true },\n      },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      properties: {\n        platformFaultDomainCount: {\n          type: 'integer',\n          format: 'int32',\n          minimum: 1,\n          description: 'Number of fault domains that the host group can span.'\n        },\n        hosts: {\n          type: 'array',\n          items: {\n            properties: {\n              id: {\n                readOnly: true,\n                type: 'string',\n                description: 'Resource Id'\n              }\n            },\n            'x-ms-azure-resource': true\n          },\n          readOnly: true,\n          description: 'A list of references to all dedicated hosts in the dedicated host group.'\n        },\n        instanceView: {\n          readOnly: true,\n          description: 'The dedicated host group instance view, which has the list of instance view of the dedicated hosts under the dedicated host group.',\n          properties: {\n            hosts: {\n              type: 'array',\n              items: {\n                properties: {\n                  name: {\n                    type: 'string',\n                    readOnly: true,\n                    description: 'The name of the dedicated host.'\n                  }\n                },\n                allOf: [\n                  {\n                    properties: {\n                      assetId: {\n                        readOnly: true,\n                        type: 'string',\n                        description: 'Specifies the unique id of the dedicated physical machine on which the dedicated host resides.'\n                      },\n                      availableCapacity: {\n                        description: 'Unutilized capacity of the dedicated host.',\n                        properties: {\n                          allocatableVMs: {\n                            type: 'array',\n                            items: {\n                              properties: {\n                                vmSize: {\n                                  type: 'string',\n                                  description: 'VM size in terms of which the unutilized capacity is represented.'\n                                },\n                                count: {\n                                  type: 'number',\n                                  format: 'double',\n                                  description: \"Maximum number of VMs of size vmSize that can fit in the dedicated host's remaining capacity.\"\n                                }\n                              },\n                              description: 'Represents the dedicated host unutilized capacity in terms of a specific VM size.'\n                            },\n                            'x-ms-identifiers': [],\n                            description: 'The unutilized capacity of the dedicated host represented in terms of each VM size that is allowed to be deployed to the dedicated host.'\n                          }\n                        }\n                      },\n                      statuses: {\n                        type: 'array',\n                        items: {\n                          properties: {\n                            code: {\n                              type: 'string',\n                              description: 'The status code.'\n                            },\n                            level: {\n                              type: 'string',\n                              description: 'The level code.',\n                              enum: [ 'Info', 'Warning', 'Error' ],\n                              'x-ms-enum': {\n                                name: 'StatusLevelTypes',\n                                modelAsString: false\n                              }\n                            },\n                            displayStatus: {\n                              type: 'string',\n                              description: 'The short localizable label for the status.'\n                            },\n                            message: {\n                              type: 'string',\n                              description: 'The detailed status message, including for alerts and error messages.'\n                            },\n                            time: {\n                              type: 'string',\n                              format: 'date-time',\n                              description: 'The time of the status.'\n                            }\n                          },\n                          description: 'Instance view status.'\n                        },\n                        'x-ms-identifiers': [],\n                        description: 'The resource status information.'\n                      }\n                    },\n                    description: 'The instance view of a dedicated host.'\n                  }\n                ],\n                description: 'The instance view of a dedicated host that includes the name of the dedicated host. It is used for the response to the instance view of a dedicated host group.'\n              },\n              'x-ms-identifiers': [ 'name' ],\n              description: 'List of instance view of the dedicated hosts under the dedicated host group.'\n            }\n          }\n        },\n        supportAutomaticPlacement: {\n          type: 'boolean',\n          description: \"Specifies whether virtual machines or virtual machine scale sets can be placed automatically on the dedicated host group. Automatic placement means resources are allocated on dedicated hosts, that are chosen by Azure, under the dedicated host group. The value is defaulted to 'false' when not provided. <br><br>Minimum api-version: 2020-06-01.\"\n        },\n        additionalCapabilities: {\n          type: 'object',\n          properties: {\n            ultraSSDEnabled: {\n              type: 'boolean',\n              description: \"The flag that enables or disables a capability to have UltraSSD Enabled Virtual Machines on Dedicated Hosts of the Dedicated Host Group. For the Virtual Machines to be UltraSSD Enabled, UltraSSDEnabled flag for the resource needs to be set true as well. The value is defaulted to 'false' when not provided. Please refer to https://docs.microsoft.com/en-us/azure/virtual-machines/disks-enable-ultra-ssd for more details on Ultra SSD feature. <br><br>NOTE: The ultraSSDEnabled setting can only be enabled for Host Groups that are created as zonal. <br><br>Minimum api-version: 2022-03-01.\"\n            }\n          },\n          description: 'Enables or disables a capability on the dedicated host group.<br><br>Minimum api-version: 2022-03-01.'\n        }\n      },\n      required: [ 'platformFaultDomainCount' ],\n      description: 'Dedicated Host Group Properties.'\n    },\n    zones: {\n      type: 'array',\n      items: { type: 'string' },\n      description: 'Availability Zone to use for this host group. Only single zone is supported. The zone can be assigned only during creation. If not provided, the group supports all zones in the region. If provided, enforces each host in the group to be in the same zone.'\n    }\n  },\n  allOf: [\n    {\n      description: 'The Resource model definition.',\n      properties: {\n        id: { readOnly: true, type: 'string', description: 'Resource Id' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type'\n        },\n        location: { type: 'string', description: 'Resource location' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags'\n        }\n      },\n      required: [ 'location' ],\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Specifies information about the dedicated host group that the dedicated hosts should be assigned to. <br><br> Currently, a dedicated host can only be added to a dedicated host group at creation time. An existing dedicated host cannot be added to another dedicated host group.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2022-03-01/dedicatedHost.json"},"here"),"."))}u.isMDXComponent=!0}}]);